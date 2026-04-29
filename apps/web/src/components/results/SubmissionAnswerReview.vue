<script setup lang="ts">
import { computed, ref, watch } from "vue";
import AppPagination from "../AppPagination.vue";
import type { QuizSubmissionAnswer } from "../../data/quiz-submissions";
import { useI18n } from "../../i18n";

const props = withDefaults(defineProps<{
  answers: QuizSubmissionAnswer[];
  pageSize?: number;
}>(), {
  pageSize: 6
});

const currentPage = ref(1);
const expandedIds = ref<Set<string>>(new Set());
const { t } = useI18n();

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
  t("results.detail.answerPagination", {
    start: showingStart.value,
    end: showingEnd.value,
    total: props.answers.length
  })
);

watch(() => props.answers, () => {
  currentPage.value = 1;
  expandedIds.value = new Set();
});

watch(pageCount, (next) => {
  currentPage.value = Math.min(currentPage.value, next);
});

function setPage(page: number) {
  currentPage.value = Math.min(Math.max(page, 1), pageCount.value);
}

function toggleExpand(id: string) {
  const next = new Set(expandedIds.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  expandedIds.value = next;
}

function isExpanded(id: string) {
  return expandedIds.value.has(id);
}

function optionLabel(index: number) {
  return String.fromCharCode(65 + index);
}

function getOptionTag(answer: QuizSubmissionAnswer, optionIndex: number): string {
  const isCorrect = optionIndex === answer.correctIndex;
  const isSelected = optionIndex === answer.selectedIndex;
  if (isCorrect && isSelected) return t("participant.take.yourCorrectAnswer");
  if (isCorrect) return t("participant.take.correctAnswer");
  if (isSelected) return t("participant.take.yourAnswer");
  return "";
}

function getOptionButtonClass(answer: QuizSubmissionAnswer, optionIndex: number): string {
  if (optionIndex === answer.correctIndex) return "option-correct";
  if (optionIndex === answer.selectedIndex) return "option-wrong";
  return "option-neutral";
}

function getOptionLetterClass(answer: QuizSubmissionAnswer, optionIndex: number): string {
  if (optionIndex === answer.correctIndex) return "letter-correct";
  if (optionIndex === answer.selectedIndex) return "letter-wrong";
  return "letter-neutral";
}

interface OptionEntry { text: string; index: number }

function defaultVisibleOptions(answer: QuizSubmissionAnswer): OptionEntry[] {
  if (!answer.options?.length) return [];

  const all: OptionEntry[] = answer.options.map((text, index) => ({ text, index }));

  if (answer.selectedIndex == null) {
    return all.filter((entry) => entry.index === answer.correctIndex);
  }

  if (answer.isCorrect) {
    return all.filter((entry) => entry.index === answer.correctIndex);
  }

  // Incorrect: show wrong-selected first, then correct answer
  return [
    ...all.filter((entry) => entry.index === answer.selectedIndex),
    ...all.filter((entry) => entry.index === answer.correctIndex),
  ];
}

function visibleOptions(answer: QuizSubmissionAnswer): OptionEntry[] {
  if (!answer.options?.length) return [];
  if (isExpanded(answer.id)) {
    return answer.options.map((text, index) => ({ text, index }));
  }

  return defaultVisibleOptions(answer);
}

function hiddenCount(answer: QuizSubmissionAnswer): number {
  if (!answer.options) return 0;
  return Math.max(0, answer.options.length - defaultVisibleOptions(answer).length);
}

</script>

<template>
  <div class="answer-review-list">
    <div
      v-for="(answer, idx) in paginatedAnswers"
      :key="answer.id"
      class="question-card"
      :class="answer.isCorrect ? 'card-correct' : 'card-incorrect'"
    >
      <!-- Question header -->
      <div class="question-header">
        <div class="question-number-row">
          <span class="question-number">{{ showingStart + idx }}</span>
          <p class="question-text">{{ answer.question }}</p>
        </div>
        <span class="answer-status-badge" :class="{ 'is-incorrect': !answer.isCorrect }">
          <svg
            v-if="answer.isCorrect"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"
          >
            <path d="m7.5 12 3 3 6-6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
            <path d="m8 8 8 8M16 8l-8 8" stroke-linecap="round" />
          </svg>
          {{ answer.isCorrect ? t("results.detail.answerCorrect") : t("results.detail.answerIncorrect") }}
        </span>
      </div>

      <!-- Options (full data available) -->
      <div v-if="answer.options && answer.options.length" class="options-list">
        <div
          v-for="entry in visibleOptions(answer)"
          :key="entry.index"
          class="option-row"
          :class="getOptionButtonClass(answer, entry.index)"
        >
          <span class="option-letter" :class="getOptionLetterClass(answer, entry.index)" aria-hidden="true">
            {{ optionLabel(entry.index) }}
          </span>
          <span class="option-text">{{ entry.text }}</span>
          <span
            v-if="getOptionTag(answer, entry.index)"
            class="option-tag"
            :class="entry.index === answer.correctIndex ? 'tag-correct' : 'tag-wrong'"
          >
            {{ getOptionTag(answer, entry.index) }}
          </span>
        </div>

        <!-- Expand toggle -->
        <button
          v-if="hiddenCount(answer) > 0 || answer.explanation"
          class="expand-toggle"
          type="button"
          @click="toggleExpand(answer.id)"
        >
          {{ isExpanded(answer.id)
            ? t("results.detail.hideOptions")
            : t(
                hiddenCount(answer) === 1
                  ? "results.detail.moreOptionsOne"
                  : "results.detail.moreOptionsOther",
                { count: hiddenCount(answer) }
              ) }}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path
              :d="isExpanded(answer.id) ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'"
              stroke-linecap="round" stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>

      <!-- Explanation (shown when expanded) -->
      <div v-if="answer.explanation && isExpanded(answer.id)" class="explanation-block">
        <p class="explanation-text">{{ answer.explanation }}</p>
      </div>
    </div>

    <AppPagination
      v-if="answers.length > pageSize"
      :current-page="currentPage"
      :total-pages="pageCount"
      :showing-copy="showingCopy"
      :aria-label="t('results.detail.answerPaginationAria')"
      @update:current-page="setPage"
    />
  </div>
</template>

<style scoped>
.answer-review-list {
  display: grid;
  gap: 6px;
  padding: 10px 14px 14px;
}

/* Question card */
.question-card {
  padding: 10px 12px;
  border: 1px solid #edf0f2;
  border-radius: 10px;
  display: grid;
  gap: 8px;
  background: #fafbfc;
}

.question-card.card-correct {
  border-color: #6ee7b7;
}

.question-card.card-incorrect {
  border-color: #fca5a5;
}

/* Question header */
.question-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.question-number-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  min-width: 0;
  flex: 1;
}

.question-number {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 5px;
  background: #f1f4f8;
  color: #7a8899;
  font-size: 0.72rem;
  font-weight: 900;
  display: grid;
  place-items: center;
  margin-top: 2px;
}

.question-text {
  margin: 0;
  color: #182033;
  font-size: 0.88rem;
  font-weight: 700;
  line-height: 1.45;
  overflow-wrap: anywhere;
}

/* Status badge */
.answer-status-badge {
  flex-shrink: 0;
  min-height: 23px;
  border-radius: 999px;
  padding: 0 9px 0 7px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #dcfce7;
  color: #16a34a;
  font-size: 0.72rem;
  font-weight: 900;
  white-space: nowrap;
}

.answer-status-badge.is-incorrect {
  background: #fee2e2;
  color: #dc2626;
}

.answer-status-badge svg {
  width: 13px;
  height: 13px;
  flex: 0 0 auto;
}

/* Options list */
.options-list {
  display: grid;
  gap: 4px;
  padding-left: 28px;
}

.option-row {
  display: grid;
  grid-template-columns: 1.6rem minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 4px 10px 4px 4px;
  border-radius: 8px;
  border: 1.5px solid transparent;
}

.option-row.option-correct {
  border-color: #6ee7b7;
  background: #f0fdf4;
}

.option-row.option-wrong {
  border-color: #fca5a5;
  background: #fef2f2;
}

.option-row.option-neutral {
  border-color: #e5e9ef;
  background: #f9fafb;
}

/* Option letter circle */
.option-letter {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1.5px solid transparent;
  display: grid;
  place-items: center;
  font-size: 0.72rem;
  font-weight: 800;
  flex-shrink: 0;
}

.option-letter.letter-correct {
  border-color: #10b981;
  background: #10b981;
  color: #fff;
}

.option-letter.letter-wrong {
  border-color: #ef4444;
  background: #ef4444;
  color: #fff;
}

.option-letter.letter-neutral {
  border-color: #cbd5e1;
  background: #fff;
  color: #94a3b8;
}

/* Option text */
.option-text {
  font-size: 0.845rem;
  font-weight: 600;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.option-correct .option-text { color: #065f46; }
.option-wrong   .option-text { color: #7f1d1d; }
.option-neutral .option-text { color: #64748b; }

/* Option tag */
.option-tag {
  font-size: 0.68rem;
  font-weight: 800;
  border-radius: 999px;
  padding: 2px 8px;
  white-space: nowrap;
}

.option-tag.tag-correct {
  background: #bbf7d0;
  color: #15803d;
}

.option-tag.tag-wrong {
  background: #fecaca;
  color: #b91c1c;
}

/* Expand toggle */
.expand-toggle {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  margin-top: 2px;
  height: 22px;
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  width: fit-content;
  letter-spacing: 0.01em;
}

.expand-toggle:hover {
  color: #475569;
}

.expand-toggle svg {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
}

/* Toggles row */
.toggles-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

/* Explanation toggle */
.explanation-toggle {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 0;
  height: 22px;
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 0.775rem;
  font-weight: 700;
  cursor: pointer;
  width: fit-content;
}

.explanation-toggle:hover {
  color: #1d4ed8;
}

.explanation-toggle-icon {
  display: grid;
  place-items: center;
  width: 16px;
  height: 16px;
  color: inherit;
}

.explanation-toggle-icon svg {
  width: 14px;
  height: 14px;
}

.explanation-chevron {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
}

/* Explanation content */
.explanation-block {
  padding: 8px 10px;
  border-radius: 8px;
  background: #eff6ff;
}

.explanation-text {
  margin: 0;
  color: #1e40af;
  font-size: 0.84rem;
  font-weight: 500;
  line-height: 1.55;
  overflow-wrap: anywhere;
}
</style>
