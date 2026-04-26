<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import QuizResultSummaryCard from "../components/results/QuizResultSummaryCard.vue";
import ResultTabs from "../components/results/ResultTabs.vue";
import SubmissionDetailPanel from "../components/results/SubmissionDetailPanel.vue";
import SubmissionTable from "../components/results/SubmissionTable.vue";
import {
  quizResultDetails,
  type QuizResultDetail as MockQuizResultDetail,
  type QuizSubmission,
  type QuizSubmissionAnswer
} from "../data/quiz-submissions";
import type { QuizResultSummary } from "@quiz-app/shared";
import {
  fetchQuizResultDetail,
  type QuizResultDetail as ApiQuizResultDetail,
  type SubmissionResult
} from "../services/quiz-api";

const route = useRoute();

const searchQuery = ref("");
const scoreFilter = ref("All scores");
const dateFilter = ref("All time");
const currentPage = ref(1);
const selectedSubmissionId = ref<string | null>(null);
const activeTab = ref<"submissions" | "submission-detail">("submissions");
const isLoading = ref(false);
const quizDetail = ref<MockQuizResultDetail | null>(null);

const pageSize = 10;
const scoreOptions = ["All scores", "80% and above", "70% - 79%", "Below 70%"];
const dateOptions = ["All time", "Today", "Last 7 days"];
const tabs = [
  { id: "submissions", label: "Submissions" },
  { id: "submission-detail", label: "Submission detail", disabled: true }
];

const ACCENT_CYCLE = ["green", "red", "blue", "purple", "orange"] as const;

function formatTime(secs: number | null): string {
  if (secs == null) return "-";
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(iso));
}

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function toQuizSubmission(attempt: SubmissionResult, index: number, questionCount: number): QuizSubmission {
  const scorePercent =
    attempt.score != null && questionCount > 0
      ? Math.round((attempt.score / questionCount) * 100)
      : 0;

  const answers: QuizSubmissionAnswer[] = attempt.answers.map((a) => ({
    id: a.questionId,
    question: a.question,
    userAnswer: a.selectedIndex != null ? (a.options[a.selectedIndex] ?? "-") : "-",
    correctAnswer: a.options[a.correctIndex] ?? "-",
    isCorrect: a.isCorrect
  }));

  return {
    id: attempt.id,
    participantName: attempt.takerName,
    participantEmail: "",
    initials: initials(attempt.takerName),
    accent: ACCENT_CYCLE[index % ACCENT_CYCLE.length],
    submittedAt: attempt.submittedAt ? formatDate(attempt.submittedAt) : "-",
    submittedAtIso: attempt.submittedAt ?? attempt.startedAt,
    score: attempt.score ?? 0,
    totalScore: questionCount,
    scorePercent,
    timeTaken: formatTime(attempt.timeTaken),
    correctAnswers: attempt.score ?? 0,
    totalQuestions: questionCount,
    status: attempt.status,
    answers
  };
}

function toPublishedOrDraft(status: string): QuizResultSummary["status"] {
  return status === "published" ? "published" : "draft";
}

function toDisplayDetail(detail: ApiQuizResultDetail): MockQuizResultDetail {
  const totalQuestions = detail.questionCount;
  const totalSubmissions = detail.totalSubmissions;
  const completedCount = detail.completedSubmissions;
  const averageScorePercent = detail.averageScorePercent ?? 0;
  const averageScoreText =
    completedCount > 0 ? `${(detail.totalCorrect / completedCount).toFixed(1)} / ${totalQuestions} points` : "-";
  const completionRate =
    totalSubmissions > 0 ? Math.round((completedCount / totalSubmissions) * 100) : 0;

  return {
    id: detail.id,
    publishedAt: "",
    summary: {
      quizId: detail.id,
      quizTitle: detail.title,
      status: toPublishedOrDraft(detail.status),
      category: detail.subject || "General",
      totalQuestions,
      totalSubmissions,
      uniqueParticipants: totalSubmissions,
      averageScorePercent,
      averageScoreText,
      averageTime: formatTime(detail.averageTimeSecs),
      completionRate,
      completedCount
    },
    submissions: detail.submissions.map((attempt, index) =>
      toQuizSubmission(attempt, index, totalQuestions)
    )
  };
}

function mockDetailForRoute(): MockQuizResultDetail | null {
  const quizId = route.params.quizId as string;
  return quizResultDetails.find((item) => item.id === quizId) ?? null;
}

const summary = computed(() => quizDetail.value?.summary ?? null);
const submissions = computed<QuizSubmission[]>(() => quizDetail.value?.submissions ?? []);

const summaryCards = computed(() => {
  const s = summary.value;
  if (!s) return [];

  return [
    {
      id: "total-submissions",
      label: "Total submissions",
      value: String(s.totalSubmissions),
      icon: "users" as const
    },
    {
      id: "average-score",
      label: "Average score",
      value: `${s.averageScorePercent}%`,
      icon: "star" as const
    },
    {
      id: "average-time",
      label: "Average time",
      value: s.averageTime,
      icon: "clock" as const
    }
  ];
});

const filteredSubmissions = computed(() => {
  const normalizedSearch = searchQuery.value.trim().toLowerCase();

  return submissions.value.filter((submission) => {
    const matchesSearch =
      !normalizedSearch ||
      submission.participantName.toLowerCase().includes(normalizedSearch) ||
      submission.participantEmail.toLowerCase().includes(normalizedSearch);
    const matchesScore = isInSelectedScoreRange(submission);
    const matchesDate = isInSelectedDateRange(submission.submittedAtIso);

    return matchesSearch && matchesScore && matchesDate;
  });
});

const pageCount = computed(() => Math.max(1, Math.ceil(filteredSubmissions.value.length / pageSize)));

const paginatedSubmissions = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredSubmissions.value.slice(start, start + pageSize);
});

const showingStart = computed(() => {
  if (!filteredSubmissions.value.length) return 0;
  return (currentPage.value - 1) * pageSize + 1;
});

const showingEnd = computed(() =>
  Math.min(currentPage.value * pageSize, filteredSubmissions.value.length)
);

const selectedSubmission = computed(() => {
  if (!selectedSubmissionId.value) return null;
  return submissions.value.find((s) => s.id === selectedSubmissionId.value) ?? null;
});

watch(
  submissions,
  (next) => {
    selectedSubmissionId.value = next[0]?.id ?? null;
    currentPage.value = 1;
  },
  { immediate: true }
);

watch([searchQuery, scoreFilter, dateFilter], () => {
  currentPage.value = 1;
});

function isInSelectedScoreRange(submission: QuizSubmission) {
  if (scoreFilter.value === "All scores") return true;
  if (scoreFilter.value === "80% and above") return submission.scorePercent >= 80;
  if (scoreFilter.value === "70% - 79%") return submission.scorePercent >= 70 && submission.scorePercent < 80;
  return submission.scorePercent < 70;
}

function isInSelectedDateRange(value: string) {
  if (dateFilter.value === "All time") return true;

  const submittedAt = new Date(value);
  if (isNaN(submittedAt.getTime())) return false;

  const now = new Date();
  const daysDifference = Math.floor((now.getTime() - submittedAt.getTime()) / (1000 * 60 * 60 * 24));

  if (dateFilter.value === "Today") return daysDifference === 0;
  return daysDifference <= 7;
}

function selectTab(tabId: string) {
  if (tabId === "submissions" || tabId === "submission-detail") {
    activeTab.value = tabId;
  }
}

function selectSubmission(submission: QuizSubmission) {
  selectedSubmissionId.value = submission.id;
  activeTab.value = "submission-detail";
}

function setPage(page: number) {
  currentPage.value = Math.min(Math.max(page, 1), pageCount.value);
}

function downloadCsv() {
  if (!quizDetail.value || !summary.value) return;

  const header = ["#", "Participant", "Email", "Submitted at", "Score", "Time taken", "Status"];
  const rows = submissions.value.map((submission, index) => [
    String(index + 1),
    submission.participantName,
    submission.participantEmail,
    submission.submittedAt,
    `${submission.score}/${submission.totalScore} - ${submission.scorePercent}%`,
    submission.timeTaken,
    submission.status
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${summary.value.quizId}-submissions.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

onMounted(async () => {
  const quizId = route.params.quizId as string;
  isLoading.value = true;
  try {
    quizDetail.value = toDisplayDetail(await fetchQuizResultDetail(quizId));
  } catch {
    quizDetail.value = mockDetailForRoute();
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <section v-if="isLoading" class="result-not-found-card">
    <p>Loading...</p>
  </section>

  <section v-else-if="quizDetail && summary" class="result-detail-page">
    <div class="result-detail-topbar">
      <nav class="result-breadcrumb" aria-label="Breadcrumb">
        <RouterLink :to="{ name: 'results' }">
          Result Quiz
        </RouterLink>
        <span aria-hidden="true">></span>
        <span>{{ summary.quizTitle }}</span>
      </nav>

      <button type="button" class="export-button" @click="downloadCsv">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <path d="M12 4v10M8 10l4 4 4-4M5 20h14" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        Export CSV
      </button>
    </div>

    <section class="summary-grid" aria-label="Result summary">
      <QuizResultSummaryCard
        v-for="card in summaryCards"
        :key="card.id"
        :label="card.label"
        :value="card.value"
        :icon="card.icon"
      />
    </section>

    <section class="submissions-card" aria-labelledby="result-detail-table-title">
      <ResultTabs :tabs="tabs" :active-tab="activeTab" @select="selectTab" />

      <div v-if="activeTab === 'submissions'">
        <h2 id="result-detail-table-title" class="sr-only">Quiz submissions</h2>

        <SubmissionTable
          v-model:search-query="searchQuery"
          v-model:score-filter="scoreFilter"
          v-model:date-filter="dateFilter"
          :submissions="paginatedSubmissions"
          :selected-submission-id="selectedSubmissionId"
          :current-page="currentPage"
          :page-count="pageCount"
          :showing-start="showingStart"
          :showing-end="showingEnd"
          :total-submissions="filteredSubmissions.length"
          :score-options="scoreOptions"
          :date-options="dateOptions"
          @page="setPage"
          @select="selectSubmission"
        />
      </div>

      <SubmissionDetailPanel
        v-else-if="selectedSubmission"
        :submission="selectedSubmission"
      />

      <div v-else class="submission-detail-empty">
        <span aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" stroke-linejoin="round" />
            <circle cx="12" cy="12" r="2.5" />
          </svg>
        </span>
        <h2>Select a submission</h2>
        <p>Open the submissions tab to review participant details.</p>
      </div>
    </section>
  </section>

  <section v-else class="result-not-found-card">
    <RouterLink class="back-link" :to="{ name: 'results' }">Back to Result Quiz</RouterLink>
    <h1>Quiz result not found</h1>
    <p>This quiz does not exist or you do not have access to it.</p>
  </section>
</template>

<style scoped>
.result-detail-page {
  display: grid;
  gap: 10px;
}

.result-detail-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.result-breadcrumb {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #53627c;
  font-size: 0.9rem;
  font-weight: 700;
}

.result-breadcrumb a {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.result-breadcrumb a:hover {
  color: #10b981;
}

.result-breadcrumb svg {
  width: 17px;
  height: 17px;
}

.export-button {
  min-height: 38px;
  border: 1px solid #dfe4ea;
  border-radius: 9px;
  padding: 0 13px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  color: #182033;
  font-weight: 900;
  white-space: nowrap;
}

.export-button:hover {
  border-color: #a7f3d0;
  background: #eef9f4;
  color: #10b981;
}

.export-button svg {
  width: 17px;
  height: 17px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(160px, 1fr));
  gap: 10px;
}

.result-detail-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 400px);
  align-items: start;
  gap: 18px;
}

.result-detail-layout.is-detail-hidden {
  grid-template-columns: 1fr;
}

.submissions-card,
.result-not-found-card {
  border: var(--surface-border);
  border-radius: 16px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: var(--surface-shadow);
}

.submissions-card :deep(.submission-detail-panel) {
  min-height: 0;
  border: 0;
  border-radius: 0;
  box-shadow: none;
}

.submission-detail-empty {
  min-height: 420px;
  padding: 42px 20px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 10px;
  text-align: center;
}

.submission-detail-empty span {
  width: 58px;
  height: 58px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: #e8fbf2;
  color: #10b981;
}

.submission-detail-empty svg {
  width: 30px;
  height: 30px;
}

.submission-detail-empty h2,
.submission-detail-empty p {
  margin: 0;
}

.submission-detail-empty h2 {
  color: #182033;
  font-size: 1.1rem;
}

.submission-detail-empty p {
  max-width: 360px;
  color: #657286;
}

.result-not-found-card {
  padding: 28px;
  display: grid;
  gap: 8px;
}

.result-not-found-card h1,
.result-not-found-card p {
  margin: 0;
}

.back-link {
  width: fit-content;
  color: #10b981;
  font-weight: 900;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 1120px) {
  .summary-grid {
    grid-template-columns: repeat(2, minmax(180px, 1fr));
  }

  .result-detail-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .result-detail-topbar {
    align-items: stretch;
    flex-direction: column;
  }

  .export-button {
    justify-content: center;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
