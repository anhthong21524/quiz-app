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
  <div class="quiz-card-list">
    <article
      v-for="quiz in quizzes"
      :key="`${quiz.id}-card`"
      class="quiz-mobile-card"
    >
      <div class="mobile-card-header">
        <div class="quiz-title-cell">
          <QuizIconAvatar :icon="quiz.icon" />
          <span>{{ quiz.title }}</span>
        </div>
        <QuizStatusBadge :status="quiz.status" :is-exposed="quiz.isExposed" />
      </div>

      <dl class="mobile-card-meta">
        <div>
          <dt>{{ t("dashboard.recent.columns.subject") }}</dt>
          <dd>{{ quiz.subject }}</dd>
        </div>
        <div>
          <dt>{{ t("dashboard.recent.columns.questions") }}</dt>
          <dd>{{ quiz.questions }}</dd>
        </div>
        <div>
          <dt>{{ t("dashboard.recent.columns.lastUpdated") }}</dt>
          <dd>{{ quiz.lastUpdatedLabel }}</dd>
        </div>
      </dl>

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
    </article>
  </div>
</template>
