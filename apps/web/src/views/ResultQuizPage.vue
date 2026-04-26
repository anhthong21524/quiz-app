<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import QuizPerformanceTable from "../components/results/QuizPerformanceTable.vue";
import RecentSubmissionsCard from "../components/results/RecentSubmissionsCard.vue";
import ResultFilterPanel from "../components/results/ResultFilterPanel.vue";
import ResultSummaryCard from "../components/results/ResultSummaryCard.vue";
import {
  quizPerformanceResults,
  recentSubmissionResults,
  resultSummaryMetrics,
  type QuizPerformanceResult
} from "../data/quiz-results";

const router = useRouter();

const searchQuery = ref("");
const selectedSubject = ref("All subjects");
const selectedDateRange = ref("All time");
const isLoading = ref(false);
const currentPage = ref(1);

const dateRangeOptions = ["All time", "Today", "Last 7 days", "Last 30 days"];
const referenceDate = new Date("2026-04-26T23:59:59");
const pageSize = 5;
const totalQuizCount = 12;

const subjectOptions = computed(() => [
  "All subjects",
  ...Array.from(new Set(quizPerformanceResults.map((quiz) => quiz.subject))).sort()
]);

const filteredQuizzes = computed(() => {
  const normalizedSearch = searchQuery.value.trim().toLowerCase();

  return quizPerformanceResults.filter((quiz) => {
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
  if (!filteredQuizzes.value.length) {
    return 0;
  }

  return (currentPage.value - 1) * pageSize + 1;
});

const showingEnd = computed(() =>
  Math.min(currentPage.value * pageSize, filteredQuizzes.value.length)
);

watch([searchQuery, selectedSubject, selectedDateRange], () => {
  currentPage.value = 1;
});

function isInSelectedDateRange(value: string) {
  if (selectedDateRange.value === "All time") {
    return true;
  }

  const updatedAt = new Date(value);
  const daysDifference = Math.floor(
    (referenceDate.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (selectedDateRange.value === "Today") {
    return daysDifference === 0;
  }

  if (selectedDateRange.value === "Last 7 days") {
    return daysDifference <= 7;
  }

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
          :total-quizzes="totalQuizCount"
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
