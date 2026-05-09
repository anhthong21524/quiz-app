<script setup lang="ts">
import QuizIconAvatar from "./QuizIconAvatar.vue";
import QuizRowActions from "./QuizRowActions.vue";
import QuizStatusBadge from "./QuizStatusBadge.vue";
import type { QuizListItem } from "./types";
import { useI18n } from "../../i18n";

defineProps<{
  quizzes: QuizListItem[];
}>();

const emit = defineEmits<{
  view: [quiz: QuizListItem];
  edit: [quiz: QuizListItem];
  publish: [quiz: QuizListItem];
  unpublish: [quiz: QuizListItem];
  expose: [quiz: QuizListItem];
  unexpose: [quiz: QuizListItem];
  duplicate: [quiz: QuizListItem];
  delete: [quiz: QuizListItem];
  share: [quiz: QuizListItem];
  copyCode: [quiz: QuizListItem];
}>();

const { t } = useI18n();
</script>

<template>
  <div class="quiz-grid">
    <article
      v-for="quiz in quizzes"
      :key="`${quiz.id}-grid`"
      class="quiz-grid-card"
    >
      <div class="grid-card-topline">
        <QuizIconAvatar :icon="quiz.icon" />
        <QuizStatusBadge :status="quiz.status" :is-exposed="quiz.isExposed" />
      </div>

      <div class="grid-card-copy">
        <h3>
          {{ quiz.title }}
          <span
            v-if="quiz.isPrivate"
            class="ml-1 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700"
            :title="t('myQuizzes.table.privateQuizHint')"
          >
            <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke-linejoin="round" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke-linecap="round" />
            </svg>
            {{ t("createQuiz.fields.privateQuiz") }}
          </span>
        </h3>
        <p>{{ t("myQuizzes.grid.summary", { subject: quiz.subject, count: quiz.questions }) }}</p>
      </div>

      <div class="grid-card-footer">
        <span>{{ quiz.lastUpdatedLabel }}</span>
        <QuizRowActions
          class="card-actions"
          :title="quiz.title"
          :status="quiz.status"
          :is-api-quiz="Boolean(quiz.apiId)"
          :is-private="quiz.isPrivate"
          :is-exposed="quiz.isExposed"
          @view="emit('view', quiz)"
          @edit="emit('edit', quiz)"
          @publish="emit('publish', quiz)"
          @unpublish="emit('unpublish', quiz)"
          @expose="emit('expose', quiz)"
          @unexpose="emit('unexpose', quiz)"
          @duplicate="emit('duplicate', quiz)"
          @delete="emit('delete', quiz)"
          @share="emit('share', quiz)"
          @copy-code="emit('copyCode', quiz)"
        />
      </div>
    </article>
  </div>
</template>
