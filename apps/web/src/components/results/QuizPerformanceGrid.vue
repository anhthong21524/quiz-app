<script setup lang="ts">
import type { QuizPerformanceResult } from "../../data/quiz-results";
import ResultQuizIcon from "./ResultQuizIcon.vue";

defineProps<{ quizzes: QuizPerformanceResult[] }>();

const emit = defineEmits<{ view: [quiz: QuizPerformanceResult] }>();

function scoreClass(score: string) {
  const n = Number.parseInt(score.match(/(\d+)%$/)?.[1] ?? "", 10);
  if (Number.isNaN(n)) return "score-neutral";
  return n >= 80 ? "score-high" : n < 70 ? "score-low" : "score-mid";
}
</script>

<template>
  <div class="perf-grid">
    <article
      v-for="quiz in quizzes"
      :key="quiz.id"
      class="perf-grid-card"
      tabindex="0"
      :aria-label="`View submissions for ${quiz.title}`"
      @click="emit('view', quiz)"
      @keydown.enter.prevent="emit('view', quiz)"
      @keydown.space.prevent="emit('view', quiz)"
    >
      <div class="pgc-topline">
        <ResultQuizIcon :icon="quiz.icon" />
        <span class="pgc-score-badge" :class="scoreClass(quiz.averageScore)">
          {{ quiz.averageScore }}
        </span>
      </div>

      <div class="pgc-copy">
        <h3>{{ quiz.title }}</h3>
        <p>{{ quiz.subject }} &middot; {{ quiz.submissions }} submission{{ quiz.submissions !== 1 ? "s" : "" }}</p>
      </div>

      <div class="pgc-footer">
        <span>{{ quiz.lastUpdateDate }}</span>
      </div>
    </article>
  </div>
</template>

<style scoped>
.perf-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-content: start;
  gap: 10px;
  padding: 12px;
  border-top: 1px solid #edf0f2;
}

.perf-grid-card {
  border: 1px solid #edf0f2;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 8px 22px rgba(34, 24, 12, 0.04);
  padding: 12px 14px;
  display: grid;
  gap: 10px;
  cursor: pointer;
  outline: 0;
  transition: box-shadow 0.18s ease, border-color 0.18s ease;
}

.perf-grid-card:hover {
  border-color: #a7f3d0;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.1);
}

.perf-grid-card:focus-visible {
  box-shadow: inset 0 0 0 2px rgba(16, 185, 129, 0.26);
}

.pgc-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.pgc-score-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 800;
  white-space: nowrap;
}

.score-high  { background: #dcfce7; color: #15803d; }
.score-mid   { background: #fef9c3; color: #a16207; }
.score-low   { background: #ffedd5; color: #c2410c; }
.score-neutral { background: #f1f5f9; color: #64748b; }

.pgc-copy {
  display: grid;
  gap: 3px;
}

.pgc-copy h3 {
  margin: 0;
  font-size: 0.95rem;
  color: #182033;
  font-weight: 800;
}

.pgc-copy p {
  margin: 0;
  font-size: 0.88rem;
  color: #657286;
}

.pgc-footer {
  display: flex;
  align-items: flex-end;
}

.pgc-footer span {
  font-size: 0.88rem;
  color: #657286;
}

@media (max-width: 860px) {
  .perf-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding: 16px;
  }
}

@media (max-width: 560px) {
  .perf-grid {
    grid-template-columns: 1fr;
  }
}
</style>
