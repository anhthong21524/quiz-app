<script setup lang="ts">
import { computed, ref, watch } from "vue";
import AppPagination from "../AppPagination.vue";
import AppTable from "../AppTable.vue";
import type { QuizSubmissionAnswer } from "../../data/quiz-submissions";

const props = withDefaults(defineProps<{
  answers: QuizSubmissionAnswer[];
  pageSize?: number;
}>(), {
  pageSize: 6
});

const columns = [
  { label: "#" },
  { label: "Question" },
  { label: "User answer" },
  { label: "Correct answer" },
  { label: "Status" }
];

const currentPage = ref(1);

const pageCount = computed(() => Math.max(1, Math.ceil(props.answers.length / props.pageSize)));

const showingStart = computed(() => {
  if (!props.answers.length) return 0;
  return (currentPage.value - 1) * props.pageSize + 1;
});

const showingEnd = computed(() =>
  Math.min(currentPage.value * props.pageSize, props.answers.length)
);

const paginatedAnswers = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize;
  return props.answers.slice(start, start + props.pageSize);
});

const showingCopy = computed(() =>
  `Showing ${showingStart.value} to ${showingEnd.value} of ${props.answers.length} answers`
);

watch(
  () => props.answers,
  () => {
    currentPage.value = 1;
  }
);

watch(pageCount, (nextPageCount) => {
  currentPage.value = Math.min(currentPage.value, nextPageCount);
});

function setPage(page: number) {
  currentPage.value = Math.min(Math.max(page, 1), pageCount.value);
}
</script>

<template>
  <div class="answer-review-table">
    <AppTable
      :columns="columns"
      min-width="820px"
      column-spacing="16px"
      row-spacing="12px"
      first-column-variant="index"
    >
      <tr v-for="(answer, index) in paginatedAnswers" :key="answer.id">
        <td>{{ showingStart + index }}</td>
        <td>
          <span class="answer-question">{{ answer.question }}</span>
        </td>
        <td>
          <strong class="answer-value" :class="{ 'is-incorrect': !answer.isCorrect }">
            {{ answer.userAnswer }}
          </strong>
        </td>
        <td>
          <strong class="answer-value" :class="{ 'is-correct': answer.isCorrect, 'is-incorrect': !answer.isCorrect }">
            {{ answer.correctAnswer }}
          </strong>
        </td>
        <td>
          <span class="answer-status-badge" :class="{ 'is-incorrect': !answer.isCorrect }">
            <svg
              v-if="answer.isCorrect"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path d="m7.5 12 3 3 6-6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="m8 8 8 8M16 8l-8 8" stroke-linecap="round" />
            </svg>
            {{ answer.isCorrect ? "Correct" : "Incorrect" }}
          </span>
        </td>
      </tr>
    </AppTable>

    <AppPagination
      v-if="answers.length > pageSize"
      :current-page="currentPage"
      :total-pages="pageCount"
      :showing-copy="showingCopy"
      aria-label="Answer review pagination"
      @update:current-page="setPage"
    />
  </div>
</template>

<style scoped>
.answer-review-table {
  display: grid;
}

.answer-question {
  display: inline-block;
  max-width: 420px;
  overflow-wrap: anywhere;
  color: #182033;
  line-height: 1.35;
}

.answer-value {
  overflow-wrap: anywhere;
  color: #182033;
  font-size: 0.88rem;
}

.answer-value.is-correct {
  color: #10b981;
}

.answer-value.is-incorrect {
  color: #ef4444;
}

.answer-status-badge {
  width: fit-content;
  min-height: 26px;
  border-radius: 999px;
  padding: 0 10px 0 8px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #dff8ed;
  color: #10b981;
  font-size: 0.78rem;
  font-weight: 900;
  white-space: nowrap;
}

.answer-status-badge.is-incorrect {
  background: #ffe7e7;
  color: #ef4444;
}

.answer-status-badge svg {
  width: 15px;
  height: 15px;
  flex: 0 0 auto;
}
</style>
