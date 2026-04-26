<script setup lang="ts">
import type { QuizPerformanceResult } from "../../data/quiz-results";
import ResultQuizIcon from "./ResultQuizIcon.vue";

defineProps<{
  quizzes: QuizPerformanceResult[];
  currentPage: number;
  pageCount: number;
  showingStart: number;
  showingEnd: number;
  totalQuizzes: number;
}>();

const emit = defineEmits<{
  page: [page: number];
  view: [quiz: QuizPerformanceResult];
}>();

function scoreClass(score: string) {
  const numericScore = Number.parseInt(score, 10);

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

    <div v-if="quizzes.length" class="performance-table-shell">
      <table class="performance-table">
        <thead>
          <tr>
            <th>Quiz</th>
            <th>Subject</th>
            <th>Questions</th>
            <th>Submissions</th>
            <th>Average score</th>
            <th>Completion rate</th>
            <th>Average time</th>
            <th>Last update</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="quiz in quizzes"
            :key="quiz.id"
            class="clickable-row"
            tabindex="0"
            :aria-label="`View submissions for ${quiz.title}`"
            @click="emit('view', quiz)"
            @keydown.enter.prevent="emit('view', quiz)"
            @keydown.space.prevent="emit('view', quiz)"
          >
            <td>
              <div class="quiz-title-cell">
                <ResultQuizIcon :icon="quiz.icon" />
                <span class="quiz-title-text">{{ quiz.title }}</span>
                <span class="result-status-badge" :class="`is-${quiz.status.toLowerCase()}`">
                  {{ quiz.status }}
                </span>
              </div>
            </td>
            <td>{{ quiz.subject }}</td>
            <td>{{ quiz.questions }}</td>
            <td>{{ quiz.submissions }}</td>
            <td>
              <span class="metric-value" :class="scoreClass(quiz.averageScore)">{{ quiz.averageScore }}</span>
              <span class="metric-helper">{{ quiz.scoreDetail }}</span>
            </td>
            <td>
              <span class="metric-value">{{ quiz.completionRate }}</span>
              <span class="metric-helper">{{ quiz.completionDetail }}</span>
            </td>
            <td>
              <span class="metric-value">{{ quiz.averageTime }}</span>
              <span class="metric-helper">{{ quiz.averageTimeHelper }}</span>
            </td>
            <td>
              <time class="last-update" :datetime="quiz.lastUpdate">
                <span>{{ quiz.lastUpdateDate }}</span>
                <span>{{ quiz.lastUpdateTime }}</span>
              </time>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="results-empty-state">
      <span aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M5 19V5M5 19h14M9 16v-5M13 16V8M17 16v-3" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
      <h3>No quizzes match these filters</h3>
      <p>Adjust the search, status, subject, or date filter to see quiz performance.</p>
    </div>

    <footer class="performance-pagination">
      <p>Showing {{ showingStart }} to {{ showingEnd }} of {{ totalQuizzes }} quizzes</p>
      <div class="pagination-controls" aria-label="Pagination">
        <button
          type="button"
          class="pagination-button"
          aria-label="Previous page"
          :disabled="currentPage === 1"
          @click="emit('page', currentPage - 1)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path d="m15 18-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <button
          v-for="page in pageCount"
          :key="page"
          type="button"
          class="pagination-button"
          :class="{ 'is-active': page === currentPage }"
          :aria-current="page === currentPage ? 'page' : undefined"
          @click="emit('page', page)"
        >
          {{ page }}
        </button>
        <button
          type="button"
          class="pagination-button"
          aria-label="Next page"
          :disabled="currentPage === pageCount"
          @click="emit('page', currentPage + 1)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path d="m9 18 6-6-6-6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
    </footer>
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

.performance-table-shell {
  width: 100%;
  overflow: auto;
  border-top: 1px solid #edf0f2;
}

.performance-table {
  width: 100%;
  min-width: 980px;
  border-collapse: collapse;
}

.performance-table th,
.performance-table td {
  padding: 12px 18px;
  border-bottom: 1px solid #edf0f2;
  text-align: left;
  vertical-align: middle;
}

.performance-table th {
  background: #fbfcfd;
  color: #53627c;
  font-size: 0.78rem;
  font-weight: 800;
  white-space: nowrap;
}

.performance-table td {
  color: #293246;
  font-size: 0.9rem;
}

.performance-table tbody tr {
  transition: background-color 0.2s ease;
}

.performance-table tbody tr:hover,
.performance-table tbody tr:focus-visible {
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
  gap: 10px;
  min-width: 220px;
}

.quiz-title-text {
  min-width: 0;
  overflow: hidden;
  color: #182033;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-status-badge {
  min-height: 22px;
  border-radius: 999px;
  padding: 0 8px;
  display: inline-flex;
  align-items: center;
  color: #667287;
  background: #f2f4f7;
  font-size: 0.72rem;
  font-weight: 900;
  white-space: nowrap;
}

.result-status-badge.is-published {
  border: 1px solid rgba(16, 185, 129, 0.2);
  background: #e8fbf2;
  color: #0f9f65;
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

.last-update {
  display: grid;
  gap: 2px;
  color: #344159;
  white-space: nowrap;
}

.last-update span + span {
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

.performance-pagination {
  min-height: 70px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.performance-pagination p {
  margin: 0;
  color: #657286;
  font-size: 0.92rem;
}

.pagination-controls {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.pagination-button {
  min-width: 36px;
  height: 36px;
  border: 1px solid #dfe4ea;
  border-radius: 10px;
  display: inline-grid;
  place-items: center;
  background: #ffffff;
  color: #344159;
  font-weight: 900;
}

.pagination-button svg {
  width: 17px;
  height: 17px;
}

.pagination-button.is-active {
  border-color: #10b981;
  background: #10b981;
  color: #ffffff;
  box-shadow: 0 12px 20px rgba(16, 185, 129, 0.18);
}

.pagination-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

@media (max-width: 720px) {
  .performance-card-header,
  .performance-pagination {
    align-items: flex-start;
    flex-direction: column;
  }

  .pagination-controls {
    align-self: stretch;
    justify-content: flex-end;
  }
}
</style>
