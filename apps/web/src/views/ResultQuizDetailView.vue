<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import QuizResultSummaryCard from "../components/results/QuizResultSummaryCard.vue";
import SubmissionDetailPanel from "../components/results/SubmissionDetailPanel.vue";
import SubmissionTable from "../components/results/SubmissionTable.vue";
import {
  quizResultDetails,
  type QuizResultDetail,
  type QuizSubmission
} from "../data/quiz-submissions";

const route = useRoute();

const searchQuery = ref("");
const statusFilter = ref("All status");
const scoreFilter = ref("All scores");
const dateFilter = ref("All time");
const currentPage = ref(1);
const selectedSubmissionId = ref<string | null>(null);

const pageSize = 5;
const referenceDate = new Date("2026-04-26T23:59:59");
const statusOptions = ["All status", "Completed", "Incomplete"];
const scoreOptions = ["All scores", "80% and above", "70% - 79%", "Below 70%"];
const dateOptions = ["All time", "Today", "Last 7 days"];

const quiz = computed<QuizResultDetail | undefined>(() =>
  quizResultDetails.find((item) => item.id === route.params.quizId)
);

const summaryCards = computed(() => {
  if (!quiz.value) {
    return [];
  }

  return [
    {
      id: "total-submissions",
      label: "Total submissions",
      value: quiz.value.summary.totalSubmissions,
      helper: quiz.value.summary.totalSubmissionsHelper,
      icon: "users" as const
    },
    {
      id: "average-score",
      label: "Average score",
      value: quiz.value.summary.averageScore,
      helper: quiz.value.summary.averageScoreHelper,
      icon: "star" as const
    },
    {
      id: "average-time",
      label: "Average time",
      value: quiz.value.summary.averageTime,
      helper: quiz.value.summary.averageTimeHelper,
      icon: "clock" as const
    },
    {
      id: "completion-rate",
      label: "Completion rate",
      value: quiz.value.summary.completionRate,
      helper: quiz.value.summary.completionRateHelper,
      icon: "check" as const
    }
  ];
});

const filteredSubmissions = computed(() => {
  if (!quiz.value) {
    return [];
  }

  const normalizedSearch = searchQuery.value.trim().toLowerCase();

  return quiz.value.submissions.filter((submission) => {
    const matchesSearch =
      !normalizedSearch ||
      submission.participantName.toLowerCase().includes(normalizedSearch) ||
      submission.email.toLowerCase().includes(normalizedSearch);
    const matchesStatus =
      statusFilter.value === "All status" || submission.status === statusFilter.value;
    const matchesScore = isInSelectedScoreRange(submission);
    const matchesDate = isInSelectedDateRange(submission.submittedAtIso);

    return matchesSearch && matchesStatus && matchesScore && matchesDate;
  });
});

const pageCount = computed(() => Math.max(1, Math.ceil(filteredSubmissions.value.length / pageSize)));

const paginatedSubmissions = computed(() => {
  const start = (currentPage.value - 1) * pageSize;

  return filteredSubmissions.value.slice(start, start + pageSize);
});

const showingStart = computed(() => {
  if (!filteredSubmissions.value.length) {
    return 0;
  }

  return (currentPage.value - 1) * pageSize + 1;
});

const showingEnd = computed(() =>
  Math.min(currentPage.value * pageSize, filteredSubmissions.value.length)
);

const selectedSubmission = computed(() => {
  if (!quiz.value || !selectedSubmissionId.value) {
    return null;
  }

  return quiz.value.submissions.find((submission) => submission.id === selectedSubmissionId.value) ?? null;
});

watch(
  quiz,
  (nextQuiz) => {
    selectedSubmissionId.value = nextQuiz?.submissions[0]?.id ?? null;
    currentPage.value = 1;
  },
  { immediate: true }
);

watch([searchQuery, statusFilter, scoreFilter, dateFilter], () => {
  currentPage.value = 1;
});

function isInSelectedScoreRange(submission: QuizSubmission) {
  if (scoreFilter.value === "All scores") {
    return true;
  }

  if (scoreFilter.value === "80% and above") {
    return submission.scorePercent >= 80;
  }

  if (scoreFilter.value === "70% - 79%") {
    return submission.scorePercent >= 70 && submission.scorePercent < 80;
  }

  return submission.scorePercent < 70;
}

function isInSelectedDateRange(value: string) {
  if (dateFilter.value === "All time") {
    return true;
  }

  const submittedAt = new Date(value);
  const daysDifference = Math.floor(
    (referenceDate.getTime() - submittedAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (dateFilter.value === "Today") {
    return daysDifference === 0;
  }

  return daysDifference <= 7;
}

function selectSubmission(submission: QuizSubmission) {
  selectedSubmissionId.value = submission.id;
}

function setPage(page: number) {
  currentPage.value = Math.min(Math.max(page, 1), pageCount.value);
}

function clearSelectedSubmission() {
  selectedSubmissionId.value = null;
}

function downloadCsv() {
  if (!quiz.value) {
    return;
  }

  const header = [
    "#",
    "Participant",
    "Email",
    "Submitted at",
    "Score",
    "Time taken",
    "Correct",
    "Status"
  ];
  const rows = quiz.value.submissions.map((submission, index) => [
    String(index + 1),
    submission.participantName,
    submission.email,
    submission.submittedAt,
    `${submission.score} / ${submission.totalScore}`,
    submission.timeTaken,
    `${submission.correctAnswers} / ${submission.totalQuestions}`,
    submission.status
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map((value) => `"${value.replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${quiz.value.id}-submissions.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
</script>

<template>
  <section v-if="quiz" class="result-detail-page">
    <nav class="result-breadcrumb" aria-label="Breadcrumb">
      <RouterLink :to="{ name: 'results' }">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <path d="m15 18-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        Result Quiz
      </RouterLink>
      <span aria-hidden="true">></span>
      <span>{{ quiz.title }}</span>
    </nav>

    <header class="result-detail-heading">
      <div class="heading-copy">
        <h1>{{ quiz.title }}</h1>
      </div>

      <button type="button" class="export-button" @click="downloadCsv">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <path d="M12 4v10M8 10l4 4 4-4M5 20h14" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        Export CSV
      </button>
    </header>

    <section class="summary-grid" aria-label="Result summary">
      <QuizResultSummaryCard
        v-for="card in summaryCards"
        :key="card.id"
        :label="card.label"
        :value="card.value"
        :helper="card.helper"
        :icon="card.icon"
      />
    </section>

    <div class="result-detail-layout" :class="{ 'is-detail-hidden': !selectedSubmission }">
      <section class="submissions-card" aria-labelledby="result-detail-table-title">
        <h2 id="result-detail-table-title" class="sr-only">Quiz submissions</h2>

        <SubmissionTable
          v-model:search-query="searchQuery"
          v-model:status-filter="statusFilter"
          v-model:score-filter="scoreFilter"
          v-model:date-filter="dateFilter"
          :submissions="paginatedSubmissions"
          :selected-submission-id="selectedSubmissionId"
          :current-page="currentPage"
          :page-count="pageCount"
          :showing-start="showingStart"
          :showing-end="showingEnd"
          :total-submissions="filteredSubmissions.length"
          :status-options="statusOptions"
          :score-options="scoreOptions"
          :date-options="dateOptions"
          @page="setPage"
          @select="selectSubmission"
        />
      </section>

      <SubmissionDetailPanel
        v-if="selectedSubmission"
        :submission="selectedSubmission"
        @close="clearSelectedSubmission"
      />
    </div>
  </section>

  <section v-else class="result-not-found-card">
    <RouterLink class="back-link" :to="{ name: 'results' }">Back to Result Quiz</RouterLink>
    <h1>Quiz result not found</h1>
    <p>This quiz result is not available in the mock result data.</p>
  </section>
</template>

<style scoped>
.result-detail-page {
  display: grid;
  gap: 18px;
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

.result-detail-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 18px;
}

.heading-copy {
  min-width: 0;
  display: grid;
  gap: 10px;
}

.heading-copy h1 {
  margin: 0;
  color: #182033;
  font-size: 1.75rem;
  line-height: 1.15;
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
  grid-template-columns: repeat(4, minmax(160px, 1fr));
  gap: 16px;
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
  .result-detail-heading {
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
