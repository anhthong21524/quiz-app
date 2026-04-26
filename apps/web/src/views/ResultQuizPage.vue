<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import QuizPerformanceTable from "../components/results/QuizPerformanceTable.vue";
import RecentSubmissionsCard from "../components/results/RecentSubmissionsCard.vue";
import ResultFilterPanel from "../components/results/ResultFilterPanel.vue";
import ResultSummaryCard from "../components/results/ResultSummaryCard.vue";
import {
  fetchQuizPerformance,
  fetchRecentSubmissions,
  fetchResultsSummary,
  type QuizPerformanceItem,
  type RecentSubmissionItem,
  type ResultsSummary
} from "../services/quiz-api";
import type { QuizPerformanceResult, RecentSubmissionResult, ResultSummaryMetric } from "../data/quiz-results";

const router = useRouter();

const searchQuery = ref("");
const selectedSubject = ref("All subjects");
const selectedDateRange = ref("All time");
const isLoading = ref(false);
const currentPage = ref(1);

const summary = ref<ResultsSummary | null>(null);
const performanceData = ref<QuizPerformanceItem[]>([]);
const recentData = ref<RecentSubmissionItem[]>([]);

const dateRangeOptions = ["All time", "Today", "Last 7 days", "Last 30 days"];
const pageSize = 5;

const SUBJECT_ICON_MAP: Record<string, string> = {
  science: "science",
  geography: "geography",
  general: "knowledge",
  math: "mathematics",
  mathematics: "mathematics",
  technology: "technology",
  biology: "biology",
  history: "history",
  chemistry: "chemistry"
};

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

function subjectIcon(subject: string): string {
  return SUBJECT_ICON_MAP[subject.toLowerCase()] ?? "knowledge";
}

function statusLabel(status: string): "Published" | "Draft" {
  return status === "published" ? "Published" : "Draft";
}

const resultSummaryMetrics = computed<ResultSummaryMetric[]>(() => {
  const s = summary.value;
  if (!s) return [];

  const avgScoreDetail =
    s.totalPossible > 0
      ? `${(s.totalCorrect / (s.completedSubmissions || 1)).toFixed(1)} / ${(s.totalPossible / (s.completedSubmissions || 1)).toFixed(0)} points`
      : "-";

  return [
    {
      id: "total-quizzes",
      label: "Total quizzes",
      value: String(s.totalQuizzes),
      helper: `${s.publishedQuizzes} published quizzes`,
      icon: "users" as const
    },
    {
      id: "total-submissions",
      label: "Total submissions",
      value: String(s.totalSubmissions),
      helper: "Across all quizzes",
      icon: "clipboard" as const
    },
    {
      id: "average-score",
      label: "Average score",
      value: s.averageScorePercent != null ? `${s.averageScorePercent}%` : "-",
      helper: avgScoreDetail,
      icon: "star" as const
    },
    {
      id: "average-time",
      label: "Average time",
      value: formatTime(s.averageTimeSecs),
      helper: "mm:ss",
      icon: "clock" as const
    },
    {
      id: "completion-rate",
      label: "Completion rate",
      value: s.totalSubmissions > 0 ? `${Math.round((s.completedSubmissions / s.totalSubmissions) * 100)}%` : "-",
      helper: `${s.completedSubmissions} / ${s.totalSubmissions} completed`,
      icon: "check" as const
    }
  ];
});

const quizPerformanceResults = computed<QuizPerformanceResult[]>(() =>
  performanceData.value.map((item) => {
    const avgScorePct = item.averageScorePercent ?? 0;
    const avgPointsPerQ = item.completedSubmissions > 0 ? item.totalCorrect / item.completedSubmissions : 0;
    const completionPct =
      item.totalSubmissions > 0 ? Math.round((item.completedSubmissions / item.totalSubmissions) * 100) : 0;
    const lastIso = item.lastSubmittedAt ?? new Date(0).toISOString();

    return {
      id: item.id,
      title: item.title,
      subject: item.subject,
      questions: item.questionCount,
      submissions: item.totalSubmissions,
      averageScore: item.averageScorePercent != null ? `${avgScorePct}%` : "-",
      scoreDetail:
        item.completedSubmissions > 0
          ? `${avgPointsPerQ.toFixed(1)} / ${item.questionCount}`
          : `- / ${item.questionCount}`,
      completionRate: item.totalSubmissions > 0 ? `${completionPct}%` : "0%",
      completionDetail:
        item.totalSubmissions > 0
          ? `${item.completedSubmissions} / ${item.totalSubmissions}`
          : "0 / 0",
      averageTime: formatTime(item.averageTimeSecs),
      averageTimeHelper: "mm:ss",
      lastUpdate: item.lastSubmittedAt ? formatDate(item.lastSubmittedAt) : "-",
      lastUpdateIso: lastIso,
      lastUpdateDate: item.lastSubmittedAt
        ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
            new Date(item.lastSubmittedAt)
          )
        : "-",
      lastUpdateTime: item.lastSubmittedAt
        ? new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(
            new Date(item.lastSubmittedAt)
          )
        : "-",
      status: statusLabel(item.status),
      icon: subjectIcon(item.subject) as QuizPerformanceResult["icon"]
    };
  })
);

const recentSubmissionResults = computed<RecentSubmissionResult[]>(() =>
  recentData.value.map((item, index) => ({
    id: item.id,
    studentName: item.takerName,
    quizTitle: item.quizTitle,
    submittedAt: formatDate(item.submittedAt),
    initials: initials(item.takerName),
    accent: ACCENT_CYCLE[index % ACCENT_CYCLE.length]
  }))
);

const subjectOptions = computed(() => [
  "All subjects",
  ...Array.from(new Set(quizPerformanceResults.value.map((q) => q.subject))).sort()
]);

const filteredQuizzes = computed(() => {
  const normalizedSearch = searchQuery.value.trim().toLowerCase();

  return quizPerformanceResults.value.filter((quiz) => {
    const matchesSearch =
      !normalizedSearch ||
      quiz.title.toLowerCase().includes(normalizedSearch) ||
      quiz.subject.toLowerCase().includes(normalizedSearch);
    const matchesSubject =
      selectedSubject.value === "All subjects" || quiz.subject === selectedSubject.value;
    const matchesDate = isInSelectedDateRange(quiz.lastUpdateIso);

    return matchesSearch && matchesSubject && matchesDate;
  });
});

const pageCount = computed(() => Math.max(1, Math.ceil(filteredQuizzes.value.length / pageSize)));

const paginatedQuizzes = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredQuizzes.value.slice(start, start + pageSize);
});

const showingStart = computed(() => {
  if (!filteredQuizzes.value.length) return 0;
  return (currentPage.value - 1) * pageSize + 1;
});

const showingEnd = computed(() =>
  Math.min(currentPage.value * pageSize, filteredQuizzes.value.length)
);

watch([searchQuery, selectedSubject, selectedDateRange], () => {
  currentPage.value = 1;
});

function isInSelectedDateRange(value: string) {
  if (selectedDateRange.value === "All time") return true;

  const updatedAt = new Date(value);
  if (isNaN(updatedAt.getTime())) return false;

  const now = new Date();
  const daysDifference = Math.floor((now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24));

  if (selectedDateRange.value === "Today") return daysDifference === 0;
  if (selectedDateRange.value === "Last 7 days") return daysDifference <= 7;
  return daysDifference <= 30;
}

function clearFilters() {
  searchQuery.value = "";
  selectedSubject.value = "All subjects";
  selectedDateRange.value = "All time";
  currentPage.value = 1;
}

function openQuizSubmissions(quiz: QuizPerformanceResult) {
  router.push({ name: "result-quiz-detail", params: { quizId: quiz.id } });
}

function setPage(page: number) {
  currentPage.value = Math.min(Math.max(page, 1), pageCount.value);
}

onMounted(async () => {
  isLoading.value = true;
  try {
    const [s, p, r] = await Promise.all([
      fetchResultsSummary(),
      fetchQuizPerformance(),
      fetchRecentSubmissions(5)
    ]);
    summary.value = s;
    performanceData.value = p;
    recentData.value = r;
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <section class="result-quiz-page" :aria-busy="isLoading">
    <header class="result-quiz-heading">
      <h1>Result Quiz</h1>
      <p>View and analyze results for all quizzes.</p>
    </header>

    <div class="result-quiz-layout">
      <main class="result-main">
        <section class="summary-grid" aria-label="Result summary">
          <ResultSummaryCard
            v-for="metric in resultSummaryMetrics"
            :key="metric.id"
            :metric="metric"
          />
        </section>

        <QuizPerformanceTable
          :quizzes="paginatedQuizzes"
          :current-page="currentPage"
          :page-count="pageCount"
          :showing-start="showingStart"
          :showing-end="showingEnd"
          :total-quizzes="filteredQuizzes.length"
          @page="setPage"
          @view="openQuizSubmissions"
        />
      </main>

      <aside class="result-sidebar">
        <ResultFilterPanel
          v-model:search-query="searchQuery"
          v-model:selected-subject="selectedSubject"
          v-model:selected-date-range="selectedDateRange"
          :subject-options="subjectOptions"
          :date-range-options="dateRangeOptions"
          @clear="clearFilters"
        />

        <RecentSubmissionsCard :submissions="recentSubmissionResults" />
      </aside>
    </div>
  </section>
</template>

<style scoped>
.result-quiz-page {
  display: grid;
  gap: 22px;
}

.result-quiz-heading {
  display: grid;
  gap: 6px;
}

.result-quiz-heading h1,
.result-quiz-heading p {
  margin: 0;
}

.result-quiz-heading h1 {
  color: #182033;
  font-size: 2rem;
  line-height: 1.15;
}

.result-quiz-heading p {
  color: #657286;
}

.result-quiz-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  align-items: start;
  gap: 22px;
}

.result-main,
.result-sidebar {
  min-width: 0;
  display: grid;
  gap: 18px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(140px, 1fr));
  gap: 16px;
}

@media (max-width: 1180px) {
  .summary-grid {
    grid-template-columns: repeat(3, minmax(160px, 1fr));
  }
}

@media (max-width: 980px) {
  .result-quiz-layout {
    grid-template-columns: 1fr;
  }

  .result-sidebar {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .result-sidebar > :first-child {
    grid-column: 1 / -1;
  }
}

@media (max-width: 720px) {
  .result-quiz-heading h1 {
    font-size: 1.7rem;
  }

  .summary-grid,
  .result-sidebar {
    grid-template-columns: 1fr;
  }
}
</style>
