<script setup lang="ts">
import { computed } from "vue";
import AppTable from "../AppTable.vue";
import QuizIconAvatar from "./QuizIconAvatar.vue";
import QuizRowActions from "./QuizRowActions.vue";
import QuizStatusBadge from "./QuizStatusBadge.vue";
import type { QuizListItem } from "./types";
import { useI18n } from "../../i18n";

const props = withDefaults(defineProps<{
  quizzes: QuizListItem[];
  offset?: number;
  pageSize?: number;
  sortKey?: string;
  sortDir?: "asc" | "desc";
}>(), {
  offset: 0,
  pageSize: 6,
  sortKey: "",
  sortDir: "asc",
});

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
  sort: [key: string, dir: "asc" | "desc"];
  "row-click": [quiz: QuizListItem];
}>();

const { t } = useI18n();

const columns = computed(() => [
  { label: "#", class: "col-num" },
  { label: t("dashboard.recent.columns.quizTitle"), key: "title" },
  { label: t("dashboard.recent.columns.subject"), key: "subject" },
  { label: t("dashboard.recent.columns.questions"), key: "questions" },
  { label: t("dashboard.recent.columns.status"), key: "status" },
  { label: t("dashboard.recent.columns.lastUpdated"), key: "lastUpdated" },
  { label: t("myQuizzes.table.actions"), class: "col-actions" }
]);

const paddedRows = computed<(QuizListItem | null)[]>(() => {
  const rows: (QuizListItem | null)[] = [...props.quizzes.slice(0, props.pageSize)];
  while (rows.length < props.pageSize) rows.push(null);
  return rows;
});
</script>

<template>
  <div class="quiz-table-shell">
    <AppTable
      :columns="columns"
      min-width="1100px"
      first-column-variant="index"
      sorting-enabled
      :sort-key="sortKey"
      :sort-dir="sortDir"
      @sort="(key, dir) => emit('sort', key, dir)"
    >
      <tr
        v-for="(quiz, i) in paddedRows"
        :key="quiz ? quiz.id : `empty-${i}`"
        :class="{ 'row-empty': !quiz, 'row-clickable': quiz && Boolean(quiz.apiId) }"
        @click="quiz && quiz.apiId && emit('row-click', quiz)"
      >
        <template v-if="quiz">
          <td class="col-num cell-num">{{ offset + i + 1 }}</td>
          <td>
            <div class="quiz-title-cell">
              <QuizIconAvatar :icon="quiz.icon" />
              <span>{{ quiz.title }}</span>
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
              <span
                v-if="quiz.isExposed"
                class="ml-1 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700"
                :title="t('myQuizzes.table.exposedQuizHint')"
              >
                <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
                  <circle cx="12" cy="8" r="3" />
                  <path d="M4 19c0-3.3 3.6-6 8-6s8 2.7 8 6" stroke-linecap="round" />
                </svg>
                {{ t("createQuiz.fields.exposeQuiz") }}
              </span>
            </div>
          </td>
          <td>{{ quiz.subject }}</td>
          <td>{{ quiz.questions }}</td>
          <td><QuizStatusBadge :status="quiz.status" :is-exposed="quiz.isExposed" /></td>
          <td>{{ quiz.lastUpdatedLabel }}</td>
          <td class="col-actions-cell" @click.stop>
            <QuizRowActions
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
          </td>
        </template>
        <template v-else>
          <td colspan="7" class="cell-empty">&nbsp;</td>
        </template>
      </tr>
    </AppTable>
  </div>
</template>

<style scoped>
.quiz-table-shell {
  width: 100%;
  overflow-x: auto;
}

.quiz-title-cell {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
  color: #182033;
  font-weight: 800;
}

.col-num { width: 48px; text-align: center; }
.cell-num { text-align: center; color: #8a93a3; }

.col-actions { width: 140px; text-align: right; }
.col-actions-cell { text-align: right; }

.row-empty { pointer-events: none; }
.row-empty:hover { background: transparent !important; }
.cell-empty { height: 44px; }

.row-clickable { cursor: pointer; }

@media (max-width: 860px) {
  .quiz-table-shell {
    display: none;
  }
}
</style>
