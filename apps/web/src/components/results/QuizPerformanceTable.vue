<script setup lang="ts">
import { computed } from "vue";
import AppPagination from "../AppPagination.vue";
import AppTable from "../AppTable.vue";
import type { QuizPerformanceResult } from "../../data/quiz-results";
import { useI18n } from "../../i18n";
import ResultQuizIcon from "./ResultQuizIcon.vue";
import QuizPerformanceGrid from "./QuizPerformanceGrid.vue";

withDefaults(defineProps<{
  quizzes: QuizPerformanceResult[];
  currentPage: number;
  pageCount: number;
  showingStart: number;
  showingEnd: number;
  totalQuizzes: number;
  sortKey: string;
  sortDir: "asc" | "desc";
  viewMode?: "list" | "grid";
  loading?: boolean;
}>(), { viewMode: "list", loading: false });

const emit = defineEmits<{
  page: [page: number];
  view: [quiz: QuizPerformanceResult];
  sort: [key: string, dir: "asc" | "desc"];
  export: [];
}>();

const { t } = useI18n();

const columns = computed(() => [
  { label: t("results.overview.no"), class: "col-num" },
  { label: t("results.overview.quiz"), class: "col-quiz", key: "title" },
  { label: t("results.overview.subject"), class: "col-subject", key: "subject" },
  { label: t("results.overview.submissions"), class: "col-submissions", key: "submissions" },
  { label: t("results.overview.averageScoreLabel"), class: "col-score", key: "averageScore" },
  { label: "", class: "col-arrow" },
]);

const SKELETON_COUNT = 6;

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
  <section class="performance-card">
    <header class="performance-card-header">
      <button type="button" class="export-button" @click="emit('export')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <path d="M12 4v10M8 10l4 4 4-4M5 20h14" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        {{ t("results.overview.exportCsv") }}
      </button>
    </header>

    <slot name="toolbar" />

    <div v-if="loading" class="table-skeleton" aria-busy="true" :aria-label="t('results.overview.loadingTable')">
      <div v-for="i in SKELETON_COUNT" :key="i" class="skeleton-row">
        <div class="skeleton-cell skeleton-cell--narrow" />
        <div class="skeleton-cell skeleton-cell--wide" />
        <div class="skeleton-cell" />
        <div class="skeleton-cell" />
        <div class="skeleton-cell" />
      </div>
    </div>

    <template v-else-if="quizzes.length">
      <AppTable
        v-if="viewMode === 'list'"
        :columns="columns"
        min-width="860px"
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
          :aria-label="t('results.overview.rowAria', { title: quiz.title })"
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
          <td class="col-arrow">
            <svg class="row-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="m9 18 6-6-6-6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </td>
        </tr>
      </AppTable>

      <QuizPerformanceGrid
        v-else
        :quizzes="quizzes"
        @view="emit('view', $event)"
      />

      <div v-if="viewMode === 'list'" class="score-legend">
        <span class="legend-dot legend-dot--high" />{{ t("results.overview.scoreLegendHigh") }}
        <span class="legend-dot legend-dot--mid" />{{ t("results.overview.scoreLegendMid") }}
        <span class="legend-dot legend-dot--low" />{{ t("results.overview.scoreLegendLow") }}
      </div>
    </template>

    <div v-else class="results-empty-state">
      <span aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M5 19V5M5 19h14M9 16v-5M13 16V8M17 16v-3" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
      <h3>{{ t("results.overview.emptyTitle") }}</h3>
      <p>{{ t("results.overview.emptyDescription") }}</p>
    </div>

    <AppPagination
      :current-page="currentPage"
      :total-pages="pageCount"
      :showing-copy="t('results.overview.pagination', { start: showingStart, end: showingEnd, total: totalQuizzes })"
      :aria-label="t('results.overview.paginationAria')"
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
  min-height: 54px;
  padding: 10px 18px;
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
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.export-button:hover {
  border-color: #b0b8c4;
  background: #f8f9fa;
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

.col-arrow {
  width: 36px;
  text-align: center;
}

.row-arrow {
  width: 18px;
  height: 18px;
  color: #c0c8d4;
  opacity: 0;
  transition: opacity 0.15s ease, color 0.15s ease;
  vertical-align: middle;
}

.clickable-row:hover .row-arrow,
.clickable-row:focus-visible .row-arrow {
  opacity: 1;
  color: #10b981;
}

/* ── Score legend ──────────────────────────────────── */
.score-legend {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 18px;
  border-top: 1px solid #edf0f2;
  font-size: 0.78rem;
  color: #8a93a3;
  flex-wrap: wrap;
}

.legend-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-left: 10px;
}

.legend-dot:first-child {
  margin-left: 0;
}

.legend-dot--high { background: #10b981; }
.legend-dot--mid  { background: #182033; }
.legend-dot--low  { background: #f97316; }

/* ── Loading skeleton ──────────────────────────────── */
.table-skeleton {
  border-top: 1px solid #edf0f2;
  padding: 10px 18px;
  display: grid;
  gap: 2px;
}

.skeleton-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid #f3f5f7;
}

.skeleton-row:last-child {
  border-bottom: 0;
}

.skeleton-cell {
  height: 14px;
  border-radius: 6px;
  background: linear-gradient(90deg, #f0f2f4 25%, #e4e8ec 50%, #f0f2f4 75%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
  flex: 1;
}

.skeleton-cell--narrow { flex: 0 0 40px; }
.skeleton-cell--wide   { flex: 2; }

@keyframes shimmer {
  0%   { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}

@media (max-width: 720px) {
  .performance-card-header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
