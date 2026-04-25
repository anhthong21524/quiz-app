<script setup lang="ts">
import QuizIconAvatar from "./QuizIconAvatar.vue";
import QuizRowActions from "./QuizRowActions.vue";
import QuizStatusBadge from "./QuizStatusBadge.vue";
import type { QuizListItem } from "./types";

defineProps<{
  quizzes: QuizListItem[];
}>();

const emit = defineEmits<{
  view: [quiz: QuizListItem];
  edit: [quiz: QuizListItem];
  publish: [quiz: QuizListItem];
  unpublish: [quiz: QuizListItem];
  duplicate: [quiz: QuizListItem];
  delete: [quiz: QuizListItem];
  share: [quiz: QuizListItem];
}>();
</script>

<template>
  <div class="quiz-grid">
    <article
      v-for="quiz in quizzes"
      :key="`${quiz.id}-grid`"
      class="quiz-grid-card"
      :class="{ 'is-highlighted': quiz.id === 'chemistry-basics' }"
    >
      <div class="grid-card-topline">
        <QuizIconAvatar :icon="quiz.icon" />
        <QuizStatusBadge :status="quiz.status" />
      </div>

      <div class="grid-card-copy">
        <h3>{{ quiz.title }}</h3>
        <p>{{ quiz.subject }} &middot; {{ quiz.questions }} questions</p>
      </div>

      <div class="grid-card-footer">
        <span>{{ quiz.lastUpdatedLabel }}</span>
        <QuizRowActions
          class="card-actions"
          :title="quiz.title"
          :status="quiz.status"
          :is-api-quiz="quiz.source === 'api'"
          @view="emit('view', quiz)"
          @edit="emit('edit', quiz)"
          @publish="emit('publish', quiz)"
          @unpublish="emit('unpublish', quiz)"
          @duplicate="emit('duplicate', quiz)"
          @delete="emit('delete', quiz)"
          @share="emit('share', quiz)"
        />
      </div>
    </article>
  </div>
</template>
