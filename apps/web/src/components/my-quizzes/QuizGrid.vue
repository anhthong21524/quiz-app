<script setup lang="ts">
import { QuizStatus } from "@quiz-app/shared";
import QuizIconAvatar from "./QuizIconAvatar.vue";
import QuizRowActions from "./QuizRowActions.vue";
import QuizStatusBadge from "./QuizStatusBadge.vue";
import type { QuizListItem } from "./types";

defineProps<{
  quizzes: QuizListItem[];
  busyQuizId?: string | null;
}>();

const emit = defineEmits<{
  edit: [quiz: QuizListItem];
  view: [quiz: QuizListItem];
  "toggle-published": [quiz: QuizListItem];
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
          :can-publish="quiz.source === 'api'"
          :is-published="quiz.apiStatus === QuizStatus.PUBLISHED"
          :is-busy="busyQuizId === quiz.apiId"
          @view="emit('view', quiz)"
          @edit="emit('edit', quiz)"
          @toggle-published="emit('toggle-published', quiz)"
        />
      </div>
    </article>
  </div>
</template>
