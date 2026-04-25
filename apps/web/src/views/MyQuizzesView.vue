<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { QuizStatus, type Quiz } from "@quiz-app/shared";
import QuizCardList from "../components/my-quizzes/QuizCardList.vue";
import QuizEmptyState from "../components/my-quizzes/QuizEmptyState.vue";
import QuizGrid from "../components/my-quizzes/QuizGrid.vue";
import QuizPagination from "../components/my-quizzes/QuizPagination.vue";
import QuizTable from "../components/my-quizzes/QuizTable.vue";
import QuizToolbar from "../components/my-quizzes/QuizToolbar.vue";
import ConfirmModal from "../components/ConfirmModal.vue";
import ShareModal from "../components/ShareModal.vue";
import type { QuizListItem, ViewMode } from "../components/my-quizzes/types";
import { myQuizzes, type MyQuizStatus } from "../data/my-quizzes";
import { useQuizStore } from "../stores/quizzes";
import { useToast } from "../composables/useToast";

const router = useRouter();
const quizStore = useQuizStore();
const { show: showToast } = useToast();

const searchQuery = ref("");
const selectedStatus = ref<MyQuizStatus | "All status">("All status");
const selectedSubject = ref("All subjects");
const selectedSort = ref("last-updated");
const viewMode = ref<ViewMode>("list");

interface ConfirmState {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  danger: boolean;
  onConfirm: () => Promise<void>;
}

const confirmState = ref<ConfirmState>({
  open: false,
  title: "",
  message: "",
  confirmLabel: "Confirm",
  danger: false,
  onConfirm: async () => {}
});

const shareState = ref<{ open: boolean; title: string; url: string }>({
  open: false,
  title: "",
  url: ""
});

const statusOptions: Array<MyQuizStatus | "All status"> = [
  "All status",
  "Published",
  "In progress",
  "Unpublished"
];

onMounted(async () => {
  if (!quizStore.items.length) {
    await quizStore.loadQuizzes();
  }
});

const seededQuizzes = computed<QuizListItem[]>(() =>
  myQuizzes.map((quiz) => ({
    ...quiz,
    source: "seeded"
  }))
);

const apiQuizzes = computed<QuizListItem[]>(() => quizStore.items.map(mapApiQuiz));

const allQuizzes = computed<QuizListItem[]>(() => [
  ...apiQuizzes.value,
  ...seededQuizzes.value
]);

const subjectOptions = computed(() => [
  "All subjects",
  ...Array.from(new Set(allQuizzes.value.map((quiz) => quiz.subject))).sort()
]);

const filteredQuizzes = computed(() => {
  const normalizedSearch = searchQuery.value.trim().toLowerCase();

  const matchingQuizzes = allQuizzes.value.filter((quiz) => {
    const matchesSearch =
      !normalizedSearch ||
      quiz.title.toLowerCase().includes(normalizedSearch) ||
      quiz.subject.toLowerCase().includes(normalizedSearch);
    const matchesStatus =
      selectedStatus.value === "All status" || quiz.status === selectedStatus.value;
    const matchesSubject =
      selectedSubject.value === "All subjects" || quiz.subject === selectedSubject.value;

    return matchesSearch && matchesStatus && matchesSubject;
  });

  return [...matchingQuizzes].sort((left, right) => {
    if (selectedSort.value === "title") {
      return left.title.localeCompare(right.title);
    }

    if (selectedSort.value === "questions") {
      return right.questions - left.questions;
    }

    return new Date(right.lastUpdated).getTime() - new Date(left.lastUpdated).getTime();
  });
});

const showingCopy = computed(() => {
  const quizCount = filteredQuizzes.value.length;

  if (!quizCount) {
    return "Showing 0 to 0 of 0 quizzes";
  }

  return `Showing 1 to ${quizCount} of ${quizCount} quizzes`;
});

function createQuiz() {
  router.push({ name: "create-quiz" });
}

function formatLastUpdated(value?: string) {
  if (!value) {
    return "Not saved yet";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

function mapQuizStatus(status: QuizStatus): MyQuizStatus {
  if (status === QuizStatus.PUBLISHED) return "Published";
  if (status === QuizStatus.IN_PROGRESS) return "In progress";
  return "Unpublished";
}

function mapApiQuiz(quiz: Quiz): QuizListItem {
  const id = quiz.id ?? quiz.title;

  return {
    id,
    apiId: quiz.id,
    source: "api",
    title: quiz.title,
    subject: "Custom",
    questions: quiz.questions.length,
    status: mapQuizStatus(quiz.status),
    lastUpdated: quiz.updatedAt ?? quiz.createdAt ?? "",
    lastUpdatedLabel: formatLastUpdated(quiz.updatedAt ?? quiz.createdAt),
    icon: "knowledge"
  };
}

function openConfirm(opts: Omit<ConfirmState, "open">) {
  confirmState.value = { open: true, ...opts };
}

async function runConfirm() {
  try {
    await confirmState.value.onConfirm();
  } finally {
    confirmState.value.open = false;
  }
}

function viewQuiz(quiz: QuizListItem) {
  if (quiz.apiId) {
    router.push({ name: "edit-quiz", params: { id: quiz.apiId } });
  }
}

function editQuiz(quiz: QuizListItem) {
  if (!quiz.apiId) return;

  if (quiz.status === "Published") {
    openConfirm({
      title: "Edit published quiz",
      message: "Editing will affect the currently published quiz. Users may see changes immediately. Continue?",
      confirmLabel: "Edit anyway",
      danger: false,
      onConfirm: async () => {
        router.push({ name: "edit-quiz", params: { id: quiz.apiId! } });
      }
    });
  } else {
    router.push({ name: "edit-quiz", params: { id: quiz.apiId } });
  }
}

function publishQuiz(quiz: QuizListItem) {
  if (!quiz.apiId) return;

  openConfirm({
    title: "Publish quiz",
    message: `"${quiz.title}" will become publicly visible. Are you sure you want to publish?`,
    confirmLabel: "Publish",
    danger: false,
    onConfirm: async () => {
      try {
        await quizStore.setQuizPublished(quiz.apiId!, true);
        showToast("Quiz published successfully");
      } catch {
        showToast("Failed to publish quiz", "error");
      }
    }
  });
}

function unpublishQuiz(quiz: QuizListItem) {
  if (!quiz.apiId) return;

  openConfirm({
    title: "Unpublish quiz",
    message: `"${quiz.title}" will no longer be visible to users. You can re-publish at any time.`,
    confirmLabel: "Unpublish",
    danger: false,
    onConfirm: async () => {
      try {
        await quizStore.setQuizPublished(quiz.apiId!, false);
        showToast("Quiz unpublished successfully");
      } catch {
        showToast("Failed to unpublish quiz", "error");
      }
    }
  });
}

async function duplicateQuiz(quiz: QuizListItem) {
  if (!quiz.apiId) return;

  try {
    await quizStore.duplicateQuiz(quiz.apiId);
    showToast(`"${quiz.title}" duplicated successfully`);
  } catch {
    showToast("Failed to duplicate quiz", "error");
  }
}

function deleteQuiz(quiz: QuizListItem) {
  if (!quiz.apiId) return;

  openConfirm({
    title: "Delete quiz",
    message: `"${quiz.title}" will be permanently deleted. This action cannot be undone.`,
    confirmLabel: "Delete",
    danger: true,
    onConfirm: async () => {
      try {
        await quizStore.deleteQuiz(quiz.apiId!);
        showToast("Quiz deleted successfully");
      } catch {
        showToast("Failed to delete quiz", "error");
      }
    }
  });
}

function shareQuiz(quiz: QuizListItem) {
  if (!quiz.apiId) return;

  const baseUrl = import.meta.env.VITE_SITE_URL ?? window.location.origin;
  shareState.value = {
    open: true,
    title: quiz.title,
    url: `${baseUrl}/quiz/${quiz.apiId}`
  };
}

</script>

<template>
  <section class="my-quizzes-page">
    <header class="my-quizzes-heading">
      <h1>My Quizzes</h1>
      <p>Manage your quiz drafts, published quizzes, and API-backed editor work.</p>
    </header>

    <section class="quiz-manager-card" aria-labelledby="my-quizzes-list-title">
      <h2 id="my-quizzes-list-title" class="sr-only">My quizzes list</h2>

      <QuizToolbar
        v-model:search-query="searchQuery"
        v-model:selected-status="selectedStatus"
        v-model:selected-subject="selectedSubject"
        v-model:selected-sort="selectedSort"
        v-model:view-mode="viewMode"
        :status-options="statusOptions"
        :subject-options="subjectOptions"
      />

      <p v-if="quizStore.error" class="quiz-error">{{ quizStore.error }}</p>

      <template v-if="filteredQuizzes.length">
        <template v-if="viewMode === 'list'">
          <QuizTable
            :quizzes="filteredQuizzes"
            @view="viewQuiz"
            @edit="editQuiz"
            @publish="publishQuiz"
            @unpublish="unpublishQuiz"
            @duplicate="duplicateQuiz"
            @delete="deleteQuiz"
            @share="shareQuiz"
          />
          <QuizCardList
            :quizzes="filteredQuizzes"
            @view="viewQuiz"
            @edit="editQuiz"
            @publish="publishQuiz"
            @unpublish="unpublishQuiz"
            @duplicate="duplicateQuiz"
            @delete="deleteQuiz"
            @share="shareQuiz"
          />
        </template>

        <QuizGrid
          v-else
          :quizzes="filteredQuizzes"
          @view="viewQuiz"
          @edit="editQuiz"
          @publish="publishQuiz"
          @unpublish="unpublishQuiz"
          @duplicate="duplicateQuiz"
          @delete="deleteQuiz"
          @share="shareQuiz"
        />

        <QuizPagination :showing-copy="showingCopy" />
      </template>

      <QuizEmptyState v-else @create="createQuiz" />
    </section>
  </section>

  <ConfirmModal
    v-if="confirmState.open"
    :title="confirmState.title"
    :message="confirmState.message"
    :confirm-label="confirmState.confirmLabel"
    :danger="confirmState.danger"
    @confirm="runConfirm"
    @cancel="confirmState.open = false"
  />

  <ShareModal
    v-if="shareState.open"
    :title="shareState.title"
    :url="shareState.url"
    @close="shareState.open = false"
  />
</template>

<style>
.my-quizzes-page {
  display: grid;
  gap: 18px;
  min-height: 100%;
}

.my-quizzes-heading {
  display: grid;
  gap: 6px;
}

.my-quizzes-heading h1,
.my-quizzes-heading p {
  margin: 0;
}

.my-quizzes-heading h1 {
  color: #182033;
  font-size: 2rem;
  line-height: 1.15;
}

.my-quizzes-heading p {
  color: #657286;
}

.quiz-manager-card {
  min-height: 100%;
  border: var(--surface-border);
  border-radius: var(--surface-radius);
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: var(--surface-shadow);
}

.new-quiz-button {
  min-height: 48px;
  border: 0;
  border-radius: 12px;
  padding: 0 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #10b981;
  color: #ffffff;
  box-shadow: 0 12px 22px rgba(16, 185, 129, 0.18);
  font-weight: 800;
  white-space: nowrap;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.new-quiz-button:hover {
  transform: translateY(-1px);
  background: #0ea873;
  box-shadow: 0 16px 26px rgba(16, 185, 129, 0.22);
}

.quiz-manager-card {
  overflow: hidden;
}

.quiz-toolbar {
  display: grid;
  grid-template-columns: minmax(240px, 1fr) minmax(0, auto) auto;
  align-items: center;
  gap: 14px;
  padding: 24px;
}

.quiz-error {
  margin: 0;
  padding: 0 24px 18px;
  color: #b91c1c;
  font-weight: 700;
}

.search-control,
.select-control {
  min-height: 40px;
  border: 1px solid #dfe4ea;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #ffffff;
  color: #7a8595;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.search-control {
  max-width: 330px;
  padding: 0 14px;
}

.search-control:focus-within,
.select-control:focus-within {
  border-color: #10b981;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
}

.search-control svg,
.select-control svg {
  width: 19px;
  height: 19px;
  flex-shrink: 0;
}

.search-control input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: #283141;
}

.search-control input::placeholder {
  color: #7f8a9c;
}

.filter-group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.select-control {
  position: relative;
  min-width: 156px;
}

.select-control select {
  width: 100%;
  min-height: 40px;
  border: 0;
  outline: none;
  appearance: none;
  background: transparent;
  color: #283141;
  padding: 0 42px 0 16px;
  cursor: pointer;
}

.select-control svg {
  position: absolute;
  right: 14px;
  pointer-events: none;
}

.sort-control {
  min-width: 220px;
}

.view-toggle {
  justify-self: end;
  display: inline-flex;
  overflow: hidden;
  border: 1px solid #dfe4ea;
  border-radius: 10px;
  background: #ffffff;
}

.view-toggle-button {
  width: 44px;
  height: 40px;
  border: 0;
  display: grid;
  place-items: center;
  background: transparent;
  color: #7c8797;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.view-toggle-button + .view-toggle-button {
  border-left: 1px solid #edf0f2;
}

.view-toggle-button svg {
  width: 20px;
  height: 20px;
}

.view-toggle-button.is-active {
  background: #e9fbf2;
  color: #10b981;
  box-shadow: inset 0 0 0 1px #86e3bf;
}

.quiz-table-shell {
  width: 100%;
  overflow-x: auto;
  border-top: 1px solid #edf0f2;
}

.quiz-table {
  width: 100%;
  min-width: 1060px;
  border-collapse: collapse;
}

.quiz-table th,
.quiz-table td {
  padding: 10px 24px;
  border-bottom: 1px solid #edf0f2;
  text-align: left;
}

.quiz-table th {
  background: #fbfcfd;
  color: #8a93a3;
  font-size: 0.88rem;
  font-weight: 700;
}

.quiz-table td {
  color: #293246;
  font-size: 0.96rem;
}

.quiz-table tbody tr {
  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.quiz-table tbody tr:hover {
  background: #fbfdfb;
}

.quiz-table tbody tr.is-highlighted {
  background: #f2fbf6;
}

.quiz-title-cell {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
  color: #182033;
  font-weight: 800;
}

.quiz-card-list,
.quiz-grid {
  border-top: 1px solid #edf0f2;
}

.quiz-card-list {
  display: none;
  padding: 16px;
  gap: 14px;
}

.quiz-mobile-card,
.quiz-grid-card {
  border: 1px solid #edf0f2;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 8px 22px rgba(34, 24, 12, 0.04);
}

.quiz-mobile-card.is-highlighted,
.quiz-grid-card.is-highlighted {
  border-color: #c8f1dd;
  background: #f4fbf7;
}

.quiz-mobile-card {
  display: grid;
  gap: 16px;
  padding: 16px;
}

.mobile-card-header,
.grid-card-topline,
.grid-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.mobile-card-meta {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin: 0;
}

.mobile-card-meta div {
  min-width: 0;
}

.mobile-card-meta dt {
  color: #8a93a3;
  font-size: 0.8rem;
  font-weight: 700;
}

.mobile-card-meta dd {
  margin: 2px 0 0;
  color: #293246;
  font-size: 0.95rem;
  font-weight: 700;
}

.quiz-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  padding: 18px;
}

.quiz-grid-card {
  display: grid;
  gap: 18px;
  padding: 18px;
}

.grid-card-copy {
  display: grid;
  gap: 6px;
}

.grid-card-copy h3,
.grid-card-copy p,
.grid-card-footer span {
  margin: 0;
}

.grid-card-copy h3 {
  color: #182033;
  font-size: 1.05rem;
}

.grid-card-copy p,
.grid-card-footer span {
  color: #657286;
}

.grid-card-footer {
  align-items: flex-end;
}

.grid-card-footer span {
  font-size: 0.88rem;
}

.quiz-pagination {
  min-height: 74px;
  margin-top: auto;
  padding: 18px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.quiz-pagination p {
  margin: 0;
  color: #657286;
  font-size: 0.95rem;
}

.pagination-controls {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.pagination-button {
  min-width: 34px;
  height: 34px;
  border: 0;
  border-radius: 9px;
  display: inline-grid;
  place-items: center;
  background: #eef2f6;
  color: #93a0af;
  font-weight: 800;
}

.pagination-button svg {
  width: 17px;
  height: 17px;
}

.pagination-button.is-active {
  background: #10b981;
  color: #ffffff;
}

.pagination-button:disabled {
  cursor: not-allowed;
  opacity: 0.64;
}

.empty-state {
  margin: 0;
  min-height: 360px;
  border-top: 1px solid #edf0f2;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 12px;
  padding: 46px 20px;
  text-align: center;
}

.empty-illustration {
  width: 76px;
  height: 76px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background: #e8fbf2;
  color: #10b981;
}

.empty-illustration svg {
  width: 42px;
  height: 42px;
}

.empty-state h3,
.empty-state p {
  margin: 0;
}

.empty-state h3 {
  color: #182033;
  font-size: 1.25rem;
}

.empty-state p {
  max-width: 380px;
  color: #657286;
}

.empty-state .new-quiz-button {
  margin-top: 6px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 1120px) {
  .quiz-toolbar {
    grid-template-columns: 1fr auto;
  }

  .filter-group {
    grid-column: 1 / -1;
    order: 3;
  }

  .search-control {
    max-width: none;
  }

  .view-toggle {
    grid-column: 2;
  }

  .quiz-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 860px) {
  .new-quiz-button {
    width: 100%;
  }

  .quiz-toolbar {
    grid-template-columns: 1fr;
    padding: 18px;
  }

  .filter-group {
    display: grid;
    grid-column: auto;
    grid-template-columns: 1fr;
    order: initial;
  }

  .select-control,
  .sort-control {
    min-width: 0;
  }

  .view-toggle {
    justify-self: start;
    grid-column: auto;
  }

  .quiz-table-shell {
    display: none;
  }

  .quiz-card-list {
    display: grid;
  }

  .quiz-grid {
    grid-template-columns: 1fr;
    padding: 16px;
  }

  .quiz-pagination {
    align-items: flex-start;
    flex-direction: column;
    padding: 18px;
  }

  .pagination-controls {
    align-self: stretch;
    justify-content: flex-end;
  }
}

@media (max-width: 560px) {
  .mobile-card-header,
  .grid-card-topline,
  .grid-card-footer {
    align-items: flex-start;
    flex-direction: column;
  }

  .mobile-card-meta {
    grid-template-columns: 1fr;
  }

  .card-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
