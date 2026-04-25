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
  <div class="quiz-table-shell">
    <table class="quiz-table">
      <thead>
        <tr>
          <th>Quiz title</th>
          <th>Subject</th>
          <th>Questions</th>
          <th>Status</th>
          <th>Last updated</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="quiz in quizzes"
          :key="quiz.id"
          :class="{ 'is-highlighted': quiz.id === 'chemistry-basics' }"
        >
          <td>
            <div class="quiz-title-cell">
              <QuizIconAvatar :icon="quiz.icon" />
              <span>{{ quiz.title }}</span>
            </div>
          </td>
          <td>{{ quiz.subject }}</td>
          <td>{{ quiz.questions }}</td>
          <td><QuizStatusBadge :status="quiz.status" /></td>
          <td>{{ quiz.lastUpdatedLabel }}</td>
          <td>
            <QuizRowActions
              :title="quiz.title"
              :can-publish="quiz.source === 'api'"
              :is-published="quiz.apiStatus === QuizStatus.PUBLISHED"
              :is-busy="busyQuizId === quiz.apiId"
              @view="emit('view', quiz)"
              @edit="emit('edit', quiz)"
              @toggle-published="emit('toggle-published', quiz)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
