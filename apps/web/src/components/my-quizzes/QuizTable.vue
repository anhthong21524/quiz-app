<script setup lang="ts">
import { computed, ref } from "vue";
import AppTable from "../AppTable.vue";
import QuizIconAvatar from "./QuizIconAvatar.vue";
import QuizRowActions from "./QuizRowActions.vue";
import QuizStatusBadge from "./QuizStatusBadge.vue";
import type { QuizListItem } from "./types";

const props = withDefaults(defineProps<{
  quizzes: QuizListItem[];
  offset?: number;
  pageSize?: number;
}>(), {
  offset: 0,
  pageSize: 6,
});

const emit = defineEmits<{
  view: [quiz: QuizListItem];
  edit: [quiz: QuizListItem];
  publish: [quiz: QuizListItem];
  unpublish: [quiz: QuizListItem];
  duplicate: [quiz: QuizListItem];
  delete: [quiz: QuizListItem];
  share: [quiz: QuizListItem];
}>();

const COLUMNS = [
  { label: "#",            class: "col-num" },
  { label: "Quiz title",   key: "title" },
  { label: "Subject",      key: "subject" },
  { label: "Questions",    key: "questions" },
  { label: "Status",       key: "status" },
  { label: "Last updated", key: "lastUpdated" },
  { label: "Actions",      class: "col-actions" },
];

const sortKey = ref("");
const sortDir = ref<"asc" | "desc">("asc");

function onSort(key: string, dir: "asc" | "desc") {
  sortKey.value = key;
  sortDir.value = dir;
}

const sortedQuizzes = computed(() => {
  const key = sortKey.value as keyof QuizListItem;
  if (!key) return props.quizzes;

  return [...props.quizzes].sort((a, b) => {
    const av = a[key];
    const bv = b[key];

    let cmp = 0;
    if (key === "lastUpdated") {
      cmp = new Date(av as string).getTime() - new Date(bv as string).getTime();
    } else if (typeof av === "number" && typeof bv === "number") {
      cmp = av - bv;
    } else {
      cmp = String(av ?? "").localeCompare(String(bv ?? ""));
    }

    return sortDir.value === "asc" ? cmp : -cmp;
  });
});

const paddedRows = computed<(QuizListItem | null)[]>(() => {
  const rows: (QuizListItem | null)[] = [...sortedQuizzes.value.slice(0, props.pageSize)];
  while (rows.length < props.pageSize) rows.push(null);
  return rows;
});
</script>

<template>
  <div class="quiz-table-shell">
    <AppTable
      :columns="COLUMNS"
      min-width="1100px"
      :sort-key="sortKey"
      :sort-dir="sortDir"
      @sort="onSort"
    >
      <tr
        v-for="(quiz, i) in paddedRows"
        :key="quiz ? quiz.id : `empty-${i}`"
        :class="{ 'row-empty': !quiz }"
      >
        <template v-if="quiz">
          <td class="col-num cell-num">{{ offset + i + 1 }}</td>
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
          <td class="col-actions-cell">
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

.col-actions { width: 110px; text-align: right; }
.col-actions-cell { text-align: right; }

.row-empty { pointer-events: none; }
.row-empty:hover { background: transparent !important; }
.cell-empty { height: 44px; }

@media (max-width: 860px) {
  .quiz-table-shell {
    display: none;
  }
}
</style>
