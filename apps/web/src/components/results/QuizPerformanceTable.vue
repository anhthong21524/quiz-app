<script setup lang="ts">
import AppPagination from "../AppPagination.vue";
import AppTable from "../AppTable.vue";
import type { QuizPerformanceResult } from "../../data/quiz-results";
import ResultQuizIcon from "./ResultQuizIcon.vue";

defineProps<{
  quizzes: QuizPerformanceResult[];
  currentPage: number;
  pageCount: number;
  showingStart: number;
  showingEnd: number;
  totalQuizzes: number;
  sortKey: string;
  sortDir: "asc" | "desc";
}>();

const emit = defineEmits<{
  page: [page: number];
  view: [quiz: QuizPerformanceResult];
  sort: [key: string, dir: "asc" | "desc"];
}>();

const columns = [
  { label: "No.", class: "col-num" },
  { label: "Quiz", class: "col-quiz", key: "title" },
  { label: "Subject", class: "col-subject", key: "subject" },
  { label: "Submissions", class: "col-submissions", key: "submissions" },
  { label: "Average score", class: "col-score", key: "averageScore" },
];

function scoreClass(score: string) {
  const numericScore = Number.parseInt(score.match(/(\d+)%$/)?.[1] ?? "", 10);

  if (Number.isNaN(numericScore)) {
    return "";
  }

  if (numericScore >= 80) {
    return "is-high";
  }

  if (numericScore < 70) {
    return "is-low";
  }

  return "";
}

function handleSort(key: string, dir: "asc" | "desc") {
  emit("sort", key, dir);
}

function handlePageChange(page: number) {
  emit("page", page);
}
</script>

<template>
  <section class="performance-card" aria-labelledby="performance-title">
    <header class="performance-card-header">
      <h2 id="performance-title">Quizzes performance</h2>
      <button type="button" class="export-button">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <path d="M12 4v10M8 10l4 4 4-4M5 20h14" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        Export CSV
      </button>
    </header>

    <AppTable
      v-if="quizzes.length"
      :columns="columns"
      min-width="820px"
      column-spacing="12px"
      first-column-variant="index"
      sorting-enabled
      :sort-key="sortKey"
      :sort-dir="sortDir"
      @sort="handleSort"
    >
      <tr
        v-for="(quiz, index) in quizzes"
        :key="quiz.id"
        class="clickable-row"
        tabindex="0"
        :aria-label="`View submissions for ${quiz.title}`"
        @click="emit('view', quiz)"
        @keydown.enter.prevent="emit('view', quiz)"
        @keydown.space.prevent="emit('view', quiz)"
      >
        <td class="col-num cell-num">{{ showingStart + index }}</td>
        <td class="col-quiz">
          <div class="quiz-title-cell">
            <ResultQuizIcon :icon="quiz.icon" />
            <span class="quiz-title-text">{{ quiz.title }}</span>
          </div>
        </td>
        <td class="col-subject">{{ quiz.subject }}</td>
        <td class="col-submissions">{{ quiz.submissions }}</td>
        <td class="col-score">
          <span class="metric-value" :class="scoreClass(quiz.averageScore)">{{ quiz.averageScore }}</span>
        </td>
      </tr>
    </AppTable>

    <div v-else class="results-empty-state">
      <span aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M5 19V5M5 19h14M9 16v-5M13 16V8M17 16v-3" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
      <h3>No quizzes match these filters</h3>
      <p>Adjust the search, status, subject, or date filter to see quiz performance.</p>
    </div>

    <AppPagination
      :current-page="currentPage"
      :total-pages="pageCount"
      :showing-copy="`Showing ${showingStart} to ${showingEnd} of ${totalQuizzes} quizzes`"
      aria-label="Quiz performance pagination"
      @update:current-page="handlePageChange"
    />
  </section>
</template>

<style scoped>
.performance-card {
  border: var(--surface-border);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: var(--surface-shadow);
}

.performance-card-header {
  min-height: 62px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.performance-card-header h2 {
  margin: 0;
  color: #182033;
  font-size: 1rem;
}

.export-button {
  min-height: 36px;
  border: 1px solid #dfe4ea;
  border-radius: 9px;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  color: #283141;
  font-size: 0.86rem;
  font-weight: 800;
}

.export-button svg {
  width: 17px;
  height: 17px;
  color: #657286;
}

.performance-card :deep(td) {
  color: #293246;
  font-size: 0.9rem;
}

.performance-card :deep(tbody tr) {
  transition: background-color 0.2s ease;
}

.performance-card :deep(tbody tr:hover),
.performance-card :deep(tbody tr:focus-visible) {
  background: #fbfdfb;
}

.clickable-row {
  cursor: pointer;
  outline: 0;
}

.clickable-row:focus-visible {
  box-shadow: inset 0 0 0 2px rgba(16, 185, 129, 0.26);
}

.quiz-title-cell {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.quiz-title-text {
  min-width: 0;
  overflow: hidden;
  color: #182033;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.col-num {
  width: 48px;
  text-align: center;
}

.cell-num {
  text-align: center;
  color: #8a93a3;
}

.col-quiz {
  width: 180px;
}

.col-subject {
  width: 150px;
}

.col-submissions {
  width: 120px;
}

.col-score {
  width: 150px;
}

.metric-value,
.metric-helper {
  display: block;
  white-space: nowrap;
}

.metric-value {
  color: #182033;
  font-weight: 900;
}

.metric-value.is-high {
  color: #10b981;
}

.metric-value.is-low {
  color: #f97316;
}

.metric-helper {
  margin-top: 2px;
  color: #667287;
  font-size: 0.82rem;
}

.results-empty-state {
  min-height: 320px;
  border-top: 1px solid #edf0f2;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 10px;
  padding: 40px 20px;
  text-align: center;
}

.results-empty-state span {
  width: 58px;
  height: 58px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: #e8fbf2;
  color: #10b981;
}

.results-empty-state svg {
  width: 30px;
  height: 30px;
}

.results-empty-state h3,
.results-empty-state p {
  margin: 0;
}

.results-empty-state h3 {
  color: #182033;
  font-size: 1.1rem;
}

.results-empty-state p {
  max-width: 360px;
  color: #657286;
}

@media (max-width: 720px) {
  .performance-card-header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
