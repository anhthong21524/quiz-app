<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import AppStatsBar from "../../components/AppStatsBar.vue";
import AppToolbar, { type ToolbarFilter } from "../../components/AppToolbar.vue";
import QuizPerformanceTable from "../../components/results/QuizPerformanceTable.vue";
import RecentSubmissionsCard from "../../components/results/RecentSubmissionsCard.vue";
import {
  fetchQuizPerformance,
  fetchRecentSubmissions,
  fetchResultsSummary,
  type QuizPerformanceItem,
  type RecentSubmissionItem,
  type ResultsSummary
} from "../../services/quiz-api";
import type { QuizPerformanceResult, RecentSubmissionResult } from "../../data/quiz-results";
import PageHeader from "../../components/PageHeader.vue";
import { stableAccent } from "../../lib/accent";

const router = useRouter();

const searchQuery = ref("");
const selectedSubject = ref("All subjects");
const selectedDateRange = ref("All time");
const viewMode = ref<"list" | "grid">("list");
const isLoading = ref(false);
const loadError = ref(false);
const currentPage = ref(1);
const sortKey = ref("submissions");
const sortDir = ref<"asc" | "desc">("desc");

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

function formatPoints(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

const resultOverviewItems = computed(() => {
  const s = summary.value;
  if (!s) return [];

  return [
    {
      id: "total-quizzes",
      label: "Total quizzes",
      value: s.totalQuizzes
    },
    {
      id: "total-submissions",
      label: "Submissions",
      value: s.totalSubmissions,
      tone: "teal" as const
    },
    {
      id: "average-score",
      label: "Avg score",
      value: s.averageScorePercent != null ? `${s.averageScorePercent}%` : "-",
      tone: "amber" as const
    }
  ];
});

const quizPerformanceResults = computed<QuizPerformanceResult[]>(() =>
  performanceData.value.map((item) => {
    const avgScorePct = item.averageScorePercent ?? 0;
    const completionPct =
      item.totalSubmissions > 0 ? Math.round((item.completedSubmissions / item.totalSubmissions) * 100) : 0;
    const lastIso = item.lastSubmittedAt ?? new Date(0).toISOString();
    const averageScoreValue = item.completedSubmissions > 0 ? `${avgScorePct}%` : "-";
    const completionValue =
      item.totalSubmissions > 0 ? `${item.completedSubmissions}/${item.totalSubmissions} - ${completionPct}%` : "";

    return {
      id: item.id,
      title: item.title,
      subject: item.subject,
      questions: item.questionCount,
      submissions: item.totalSubmissions,
      averageScore: averageScoreValue,
      scoreDetail: "",
      completionRate: completionValue,
      completionDetail: "",
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
      icon: subjectIcon(item.subject) as QuizPerformanceResult["icon"]
    };
  })
);

const recentSubmissionResults = computed<RecentSubmissionResult[]>(() =>
  recentData.value.map((item) => ({
    id: item.id,
    studentName: item.takerName,
    quizTitle: item.quizTitle,
    submittedAt: formatDate(item.submittedAt),
    submittedAtIso: item.submittedAt,
    initials: initials(item.takerName),
    accent: stableAccent(item.takerName),
    scorePercent: item.scorePercent,
  }))
);

const subjectOptions = computed(() => [
  "All subjects",
  ...Array.from(new Set(quizPerformanceResults.value.map((q) => q.subject))).sort()
]);

const toolbarFilters = computed<ToolbarFilter[]>(() => [
  { label: "Filter by subject", options: subjectOptions.value, value: selectedSubject.value },
  { label: "Filter by date range", options: dateRangeOptions, value: selectedDateRange.value },
]);

function onToolbarFiltersChange(filters: ToolbarFilter[]) {
  selectedSubject.value = filters[0].value;
  selectedDateRange.value = filters[1].value;
}

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

function averageScorePercent(score: string) {
  const match = score.match(/(\d+)%$/);
  return match ? Number.parseInt(match[1], 10) : -1;
}

const sortedQuizzes = computed(() => {
  return [...filteredQuizzes.value].sort((a, b) => {
    let comparison = 0;

    if (sortKey.value === "title") {
      comparison = a.title.localeCompare(b.title);
    } else if (sortKey.value === "subject") {
      comparison = a.subject.localeCompare(b.subject);
    } else if (sortKey.value === "submissions") {
      comparison = a.submissions - b.submissions;
    } else if (sortKey.value === "averageScore") {
      comparison = averageScorePercent(a.averageScore) - averageScorePercent(b.averageScore);
    }

    return sortDir.value === "asc" ? comparison : -comparison;
  });
});

const pageCount = computed(() => Math.max(1, Math.ceil(sortedQuizzes.value.length / pageSize)));

const paginatedQuizzes = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return sortedQuizzes.value.slice(start, start + pageSize);
});

const showingStart = computed(() => {
  if (!sortedQuizzes.value.length) return 0;
  return (currentPage.value - 1) * pageSize + 1;
});

const showingEnd = computed(() =>
  Math.min(currentPage.value * pageSize, sortedQuizzes.value.length)
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

function exportCSV() {
  const headers = ["#", "Quiz", "Subject", "Submissions", "Average Score"];
  const rows = sortedQuizzes.value.map((q, i) => [
    i + 1,
    `"${q.title.replace(/"/g, '""')}"`,
    `"${q.subject.replace(/"/g, '""')}"`,
    q.submissions,
    q.averageScore,
  ]);
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quiz-results.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function setPage(page: number) {
  currentPage.value = Math.min(Math.max(page, 1), pageCount.value);
}

function setSort(key: string, dir: "asc" | "desc") {
  sortKey.value = key;
  sortDir.value = dir;
  currentPage.value = 1;
}

onMounted(async () => {
  isLoading.value = true;
  loadError.value = false;
  try {
    const [s, p, r] = await Promise.all([
      fetchResultsSummary(),
      fetchQuizPerformance(),
      fetchRecentSubmissions(5)
    ]);
    summary.value = s;
    performanceData.value = p;
    recentData.value = r;
  } catch {
    loadError.value = true;
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <section class="result-quiz-page" :aria-busy="isLoading">
    <PageHeader title="Quiz Results" description="View and analyze results for all quizzes." />

    <div v-if="loadError" class="load-error-banner" role="alert">
      Could not load results. Please refresh the page or try again later.
    </div>

    <AppStatsBar
      :items="resultOverviewItems"
      height="56px"
      :loading="isLoading"
      :loading-item-count="3"
      aria-label="Result summary"
      loading-label="Loading result summary"
    />

    <div class="result-quiz-layout">
      <main class="result-main">
        <QuizPerformanceTable
          :quizzes="paginatedQuizzes"
          :current-page="currentPage"
          :page-count="pageCount"
          :showing-start="showingStart"
          :showing-end="showingEnd"
          :total-quizzes="sortedQuizzes.length"
          :sort-key="sortKey"
          :sort-dir="sortDir"
          :view-mode="viewMode"
          :loading="isLoading"
          @page="setPage"
          @sort="setSort"
          @view="openQuizSubmissions"
          @export="exportCSV"
        >
          <template #toolbar>
            <AppToolbar
              v-model:search="searchQuery"
              search-placeholder="Search quizzes..."
              :filters="toolbarFilters"
              :view-mode="viewMode"
              @update:filters="onToolbarFiltersChange"
              @update:view-mode="viewMode = $event"
            />
          </template>
        </QuizPerformanceTable>
      </main>

      <aside class="result-sidebar">
        <RecentSubmissionsCard :submissions="recentSubmissionResults" />
      </aside>
    </div>
  </section>
</template>

<style scoped>
.result-quiz-page {
  display: grid;
  gap: 14px;
}

.load-error-banner {
  padding: 12px 16px;
  border-radius: 10px;
  background: #fff5f5;
  border: 1px solid #fecaca;
  color: #b91c1c;
  font-size: 0.9rem;
  font-weight: 600;
}

.result-quiz-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  align-items: start;
  gap: 16px;
}

.result-main,
.result-sidebar {
  min-width: 0;
}

@media (max-width: 980px) {
  .result-quiz-layout {
    grid-template-columns: 1fr;
  }
}
</style>
