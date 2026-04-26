<script setup lang="ts">
import type { QuizSubmissionAnswer } from "../../data/quiz-submissions";

defineProps<{
  answers: QuizSubmissionAnswer[];
}>();
</script>

<template>
  <ol class="answer-review-list">
    <li v-for="(answer, index) in answers" :key="answer.id" class="answer-review-item">
      <span class="answer-number" :class="{ 'is-incorrect': !answer.isCorrect }">
        {{ index + 1 }}
      </span>

      <div class="answer-copy">
        <h3>{{ answer.question }}</h3>

        <div class="answer-columns">
          <div>
            <span>User answer</span>
            <strong :class="{ 'is-incorrect': !answer.isCorrect }">{{ answer.userAnswer }}</strong>
          </div>
          <div>
            <span>Correct answer</span>
            <strong :class="{ 'is-correct': answer.isCorrect, 'is-incorrect': !answer.isCorrect }">
              {{ answer.correctAnswer }}
            </strong>
          </div>
        </div>
      </div>

      <div class="answer-status" :class="{ 'is-incorrect': !answer.isCorrect }">
        <span aria-hidden="true">
          <svg
            v-if="answer.isCorrect"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="m7.5 12 3 3 6-6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m8 8 8 8M16 8l-8 8" stroke-linecap="round" />
          </svg>
        </span>
        <strong>{{ answer.isCorrect ? "Correct" : "Incorrect" }}</strong>
      </div>
    </li>
  </ol>
</template>

<style scoped>
.answer-review-list {
  margin: 0;
  padding: 0;
  display: grid;
  list-style: none;
}

.answer-review-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 14px;
  padding: 18px 0;
  border-bottom: 1px solid #edf0f2;
}

.answer-number {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #dff8ed;
  color: #0f9f65;
  font-size: 0.8rem;
  font-weight: 900;
}

.answer-number.is-incorrect {
  background: #ffe7e7;
  color: #ef4444;
}

.answer-copy {
  min-width: 0;
  display: grid;
  gap: 14px;
}

.answer-copy h3 {
  margin: 0;
  color: #182033;
  font-size: 0.88rem;
  line-height: 1.35;
}

.answer-columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.answer-columns div {
  min-width: 0;
  display: grid;
  gap: 5px;
}

.answer-columns span {
  color: #667287;
  font-size: 0.76rem;
  font-weight: 700;
}

.answer-columns strong {
  overflow-wrap: anywhere;
  color: #182033;
  font-size: 0.88rem;
}

.answer-columns strong.is-correct {
  color: #10b981;
}

.answer-columns strong.is-incorrect {
  color: #ef4444;
}

.answer-status {
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 6px;
  color: #10b981;
}

.answer-status.is-incorrect {
  color: #ef4444;
}

.answer-status span {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #dff8ed;
}

.answer-status.is-incorrect span {
  background: #ffe7e7;
}

.answer-status svg {
  width: 18px;
  height: 18px;
}

.answer-status strong {
  font-size: 0.8rem;
}

@media (max-width: 560px) {
  .answer-review-item {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .answer-status {
    grid-column: 2;
    justify-items: start;
    grid-auto-flow: column;
    align-items: center;
  }

  .answer-columns {
    grid-template-columns: 1fr;
  }
}
</style>
