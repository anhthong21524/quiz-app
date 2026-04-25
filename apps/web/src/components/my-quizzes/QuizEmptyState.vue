<script setup lang="ts">
/**
 * QuizEmptyState — context-aware empty state for the My Quizzes page.
 *
 * variant "no-quizzes"  → user has never created a quiz (first-time onboarding tone).
 * variant "no-results"  → quizzes exist but none match the current search/filters.
 *
 * Events:
 *   create       – emitted when the user clicks "Create quiz" (no-quizzes variant)
 *   clearFilters – emitted when the user clicks "Clear filters" (no-results variant)
 */
import EmptyState from "../feedback/EmptyState.vue";

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
</script>

<template>
  <!-- ── First-time: no quizzes exist yet ─────────────────── -->
  <EmptyState
    v-if="variant === 'no-quizzes'"
    title="No quizzes yet"
    description="Create your first quiz to start building your question library and sharing knowledge with others."
    icon-variant="quiz"
    size="section"
    :primary-action="{ label: 'Create quiz', onClick: () => emit('create') }"
    :secondary-action="{ label: 'How it works', href: '#about' }"
  />

  <!-- ── Filter empty: quizzes exist but none match ─────── -->
  <EmptyState
    v-else
    title="No quizzes match your filters"
    description="Try adjusting your search terms, status, or subject filter — or clear everything to see all quizzes."
    icon-variant="search"
    size="section"
    :primary-action="{ label: 'Clear filters', onClick: () => emit('clearFilters') }"
  />
</template>
