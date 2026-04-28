<script setup lang="ts">
import EmptyState from "../feedback/EmptyState.vue";
import { useI18n } from "../../i18n";

withDefaults(
  defineProps<{
    variant?: "no-quizzes" | "no-results";
  }>(),
  { variant: "no-quizzes" }
);

const emit = defineEmits<{
  create: [];
  clearFilters: [];
}>();

const { t } = useI18n();
</script>

<template>
  <EmptyState
    v-if="variant === 'no-quizzes'"
    :title="t('myQuizzes.empty.noQuizzesTitle')"
    :description="t('myQuizzes.empty.noQuizzesDescription')"
    icon-variant="quiz"
    size="section"
    :primary-action="{ label: t('myQuizzes.empty.createQuiz'), onClick: () => emit('create') }"
    :secondary-action="{ label: t('myQuizzes.empty.howItWorks'), href: '#about' }"
  />

  <EmptyState
    v-else
    :title="t('myQuizzes.empty.noResultsTitle')"
    :description="t('myQuizzes.empty.noResultsDescription')"
    icon-variant="search"
    size="section"
    :primary-action="{ label: t('myQuizzes.empty.clearFilters'), onClick: () => emit('clearFilters') }"
  />
</template>
