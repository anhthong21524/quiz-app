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
              :status="quiz.status"
              :is-api-quiz="Boolean(quiz.apiId)"
              @view="emit('view', quiz)"
              @edit="emit('edit', quiz)"
              @publish="emit('publish', quiz)"
              @unpublish="emit('unpublish', quiz)"
              @duplicate="emit('duplicate', quiz)"
              @delete="emit('delete', quiz)"
              @share="emit('share', quiz)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
