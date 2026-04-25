<script setup lang="ts">
/**
 * EditorEmptyQuestions — UX-6 inline empty state for the quiz editor.
 *
 * Shown inside the "Questions" section when form.questions.length === 0.
 * Uses the `inline` size variant of EmptyState so it sits flush inside the
 * card's form layout without disrupting the title / description fields above it.
 *
 * Emits:
 *   addQuestion – parent calls addQuestion() on the form to insert the first entry.
 */
import EmptyState from "../feedback/EmptyState.vue";

const emit = defineEmits<{
  addQuestion: [];
}>();
</script>

<template>
  <EmptyState
    title="No questions yet"
    description="Build your quiz by adding questions one at a time. You can reorder and edit them at any time before saving."
    icon-variant="questions"
    size="inline"
    :primary-action="{
      label: 'Add your first question',
      onClick: () => emit('addQuestion'),
    }"
  />
</template>
