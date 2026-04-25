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
  <div class="quiz-card-list">
    <article
      v-for="quiz in quizzes"
      :key="`${quiz.id}-card`"
      class="quiz-mobile-card"
      :class="{ 'is-highlighted': quiz.id === 'chemistry-basics' }"
    >
      <div class="mobile-card-header">
        <div class="quiz-title-cell">
          <QuizIconAvatar :icon="quiz.icon" />
          <span>{{ quiz.title }}</span>
        </div>
        <QuizStatusBadge :status="quiz.status" />
      </div>

      <dl class="mobile-card-meta">
        <div>
          <dt>Subject</dt>
          <dd>{{ quiz.subject }}</dd>
        </div>
        <div>
          <dt>Questions</dt>
          <dd>{{ quiz.questions }}</dd>
        </div>
        <div>
          <dt>Last updated</dt>
          <dd>{{ quiz.lastUpdatedLabel }}</dd>
        </div>
      </dl>

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
    </article>
  </div>
</template>
