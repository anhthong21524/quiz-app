<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { QuizStatus, type Quiz } from "@quiz-app/shared";
import AppStatsBar from "../../components/AppStatsBar.vue";
import AppToolbar, { type ToolbarFilter } from "../../components/AppToolbar.vue";
import QuizCardList from "../../components/my-quizzes/QuizCardList.vue";
import QuizEmptyState from "../../components/my-quizzes/QuizEmptyState.vue";
import QuizGrid from "../../components/my-quizzes/QuizGrid.vue";
import QuizPagination from "../../components/my-quizzes/QuizPagination.vue";
import QuizTable from "../../components/my-quizzes/QuizTable.vue";
import ConfirmModal from "../../components/ConfirmModal.vue";
import ShareModal from "../../components/ShareModal.vue";
import PrivateCodeModal from "../../components/PrivateCodeModal.vue";
import SectionErrorState from "../../components/feedback/SectionErrorState.vue";
import QuizListSkeleton from "../../components/loading/QuizListSkeleton.vue";
import PageHeader from "../../components/PageHeader.vue";
import type {
  MyQuizStatus,
  QuizListItem,
  ViewMode
} from "../../components/my-quizzes/types";
import { getQuizIcon, mapQuizStatus } from "../../lib/quiz-helpers";
import { useQuizStore } from "../../stores/quizzes";
import { useToast } from "../../composables/useToast";
import { isAppError } from "../../lib/api/errors";
import { fetchQuizResultDetail } from "../../services/quiz-api";
import { useI18n } from "../../i18n";

const router = useRouter();
const quizStore = useQuizStore();
const { show: showToast } = useToast();
const { t } = useI18n();

const PAGE_SIZE = 6;

const searchQuery = ref("");
const selectedStatus = ref<MyQuizStatus | "All status">("All status");
const selectedSubject = ref("All subjects");
const viewMode = ref<ViewMode>("list");
const currentPage = ref(1);
const sortKey = ref("");
const sortDir = ref<"asc" | "desc">("asc");

function onSort(key: string, dir: "asc" | "desc") {
  sortKey.value = key;
  sortDir.value = dir;
}

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
  confirmLabel: "",
  danger: false,
  onConfirm: async () => {}
});

const shareState = ref<{ open: boolean; title: string; url: string }>({
  open: false,
  title: "",
  url: ""
});

const privateCodeState = ref<{ open: boolean; title: string; code: string }>({
  open: false,
  title: "",
  code: ""
});

const localizedStatusOptions = computed(() => [
  t("myQuizzes.toolbar.allStatuses"),
  t("myQuizzes.status.published"),
  t("myQuizzes.status.inProgress"),
  t("myQuizzes.status.unpublished")
]);

const localizedStatusValue = computed(() => {
  if (selectedStatus.value === "Published") return t("myQuizzes.status.published");
  if (selectedStatus.value === "In progress") return t("myQuizzes.status.inProgress");
  if (selectedStatus.value === "Unpublished") return t("myQuizzes.status.unpublished");
  return t("myQuizzes.toolbar.allStatuses");
});

const localizedSubjectValue = computed(() =>
  selectedSubject.value === "All subjects" ? t("myQuizzes.toolbar.allSubjects") : selectedSubject.value
);

const toolbarFilters = computed<ToolbarFilter[]>(() => [
  {
    label: t("myQuizzes.toolbar.filterByStatus"),
    options: localizedStatusOptions.value,
    value: localizedStatusValue.value
  },
  {
    label: t("myQuizzes.toolbar.filterBySubject"),
    options: subjectOptions.value,
    value: localizedSubjectValue.value
  },
]);

function onToolbarFiltersChange(filters: ToolbarFilter[]) {
  const [statusFilter, subjectFilter] = filters;

  if (statusFilter.value === t("myQuizzes.status.published")) {
    selectedStatus.value = "Published";
  } else if (statusFilter.value === t("myQuizzes.status.inProgress")) {
    selectedStatus.value = "In progress";
  } else if (statusFilter.value === t("myQuizzes.status.unpublished")) {
    selectedStatus.value = "Unpublished";
  } else {
    selectedStatus.value = "All status";
  }

  selectedSubject.value =
    subjectFilter.value === t("myQuizzes.toolbar.allSubjects") ? "All subjects" : subjectFilter.value;
}

// True only on first load when there are no items yet — shows skeleton instead of blank.
// During background refresh (items already present) we keep stale content visible.
const isInitialLoad = computed(
  () => quizStore.isLoading && quizStore.items.length === 0
);

onMounted(async () => {
  if (!quizStore.items.length) {
    await quizStore.loadQuizzes();
  }
});

async function retryLoadQuizzes() {
  await quizStore.loadQuizzes();
}

const apiQuizzes = computed<QuizListItem[]>(() => quizStore.items.map(mapApiQuiz));

const subjectOptions = computed(() => [
  t("myQuizzes.toolbar.allSubjects"),
  ...Array.from(new Set(apiQuizzes.value.map((quiz) => quiz.subject))).sort()
]);

const filteredQuizzes = computed(() => {
  const normalizedSearch = searchQuery.value.trim().toLowerCase();

  const matchingQuizzes = apiQuizzes.value.filter((quiz) => {
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

  return [...matchingQuizzes].sort((left, right) =>
    new Date(right.lastUpdated).getTime() - new Date(left.lastUpdated).getTime()
  );
});

watch(filteredQuizzes, () => { currentPage.value = 1; });

const sortedFilteredQuizzes = computed(() => {
  const key = sortKey.value as keyof QuizListItem;
  if (!key) return filteredQuizzes.value;

  return [...filteredQuizzes.value].sort((a, b) => {
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

const totalPages = computed(() =>
  Math.max(1, Math.ceil(sortedFilteredQuizzes.value.length / PAGE_SIZE))
);

const pageOffset = computed(() => (currentPage.value - 1) * PAGE_SIZE);

const pagedQuizzes = computed(() =>
  sortedFilteredQuizzes.value.slice(pageOffset.value, pageOffset.value + PAGE_SIZE)
);

const showingCopy = computed(() => {
  const total = sortedFilteredQuizzes.value.length;
  if (!total) return t("myQuizzes.pagination.empty");
  const from = pageOffset.value + 1;
  const to = Math.min(pageOffset.value + PAGE_SIZE, total);
  return t("myQuizzes.pagination.showing", { from, to, total });
});

function setPage(page: number) {
  currentPage.value = page;
}

// ── Empty-state helpers ───────────────────────────────────────
// True when there are quizzes in total but the active filters match none.
const hasAnyQuizzes = computed(() => apiQuizzes.value.length > 0);

const isFilteredEmpty = computed(
  () =>
    !quizStore.error &&
    !isInitialLoad.value &&
    hasAnyQuizzes.value &&
    filteredQuizzes.value.length === 0
);

// ── Dashboard stats ───────────────────────────────────────────
const publishedCount = computed(
  () => apiQuizzes.value.filter((q) => q.status === "Published").length
);
const inProgressCount = computed(
  () => apiQuizzes.value.filter((q) => q.status === "In progress").length
);
const unpublishedCount = computed(
  () => apiQuizzes.value.filter((q) => q.status === "Unpublished").length
);
const quizStatsItems = computed(() => [
  {
    id: "total",
    label: t("myQuizzes.stats.total"),
    value: apiQuizzes.value.length
  },
  {
    id: "published",
    label: t("myQuizzes.stats.published"),
    value: publishedCount.value,
    tone: "green" as const
  },
  {
    id: "in-progress",
    label: t("myQuizzes.stats.inProgress"),
    value: inProgressCount.value,
    tone: "amber" as const
  },
  {
    id: "unpublished",
    label: t("myQuizzes.stats.unpublished"),
    value: unpublishedCount.value,
    tone: "gray" as const
  }
]);

function clearFilters() {
  searchQuery.value = "";
  selectedStatus.value = "All status";
  selectedSubject.value = "All subjects";
}

function handleStatClick(id: string) {
  const map: Record<string, MyQuizStatus | "All status"> = {
    total: "All status",
    published: "Published",
    "in-progress": "In progress",
    unpublished: "Unpublished",
  };
  const status = map[id];
  if (status !== undefined) {
    selectedStatus.value = status;
    currentPage.value = 1;
  }
}

function createQuiz() {
  router.push({ name: "create-quiz" });
}

function formatLastUpdated(value?: string) {
  if (!value) {
    return t("myQuizzes.table.notSavedYet");
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}


function mapApiQuiz(quiz: Quiz): QuizListItem {
  const id = quiz.id ?? quiz.title;
  const subject = quiz.subject ?? t("dashboard.recent.customSubject");

  return {
    id,
    apiId: quiz.id,
    slug: quiz.slug,
    title: quiz.title,
    subject,
    questions: quiz.questions.length,
    status: mapQuizStatus(quiz.status),
    lastUpdated: quiz.updatedAt ?? quiz.createdAt ?? "",
    lastUpdatedLabel: formatLastUpdated(quiz.updatedAt ?? quiz.createdAt),
    icon: getQuizIcon(subject),
    isPrivate: quiz.isPrivate ?? false,
    accessCode: quiz.accessCode
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
  if (quiz.status === "Published" && quiz.slug) {
    const baseUrl = import.meta.env.VITE_SITE_URL ?? window.location.origin;
    const url = quiz.isPrivate && quiz.accessCode
      ? `${baseUrl}/q/${quiz.slug}?accessCode=${quiz.accessCode}`
      : `${baseUrl}/q/${quiz.slug}`;
    window.open(url, "_blank", "noopener");
  } else if (quiz.apiId) {
    router.push({ name: "edit-quiz-questions", params: { id: quiz.apiId } });
  }
}

function editQuiz(quiz: QuizListItem) {
  if (!quiz.apiId) return;
  router.push({ name: "edit-quiz-questions", params: { id: quiz.apiId } });
}

function publishQuiz(quiz: QuizListItem) {
  if (!quiz.apiId) return;

  openConfirm({
    title: t("myQuizzes.actions.publishTitle"),
    message: t("myQuizzes.actions.publishMessage", { title: quiz.title }),
    confirmLabel: t("myQuizzes.actions.publishConfirm"),
    danger: false,
    onConfirm: async () => {
      try {
        await quizStore.setQuizPublished(quiz.apiId!, true);
        showToast(t("myQuizzes.toasts.quizPublished"));
      } catch {
        showToast(t("myQuizzes.toasts.publishFailed"), "error");
      }
    }
  });
}

function unpublishQuiz(quiz: QuizListItem) {
  if (!quiz.apiId) return;

  openConfirm({
    title: t("myQuizzes.actions.unpublishTitle"),
    message: t("myQuizzes.actions.unpublishMessage", { title: quiz.title }),
    confirmLabel: t("myQuizzes.actions.unpublishConfirm"),
    danger: false,
    onConfirm: async () => {
      try {
        await quizStore.setQuizPublished(quiz.apiId!, false);
        showToast(t("myQuizzes.toasts.quizUnpublished"));
      } catch (error) {
        const message = isAppError(error) && error.userMessage
          ? error.userMessage
          : t("myQuizzes.toasts.unpublishFailed");
        showToast(message, "error");
      }
    }
  });
}

async function duplicateQuiz(quiz: QuizListItem) {
  if (!quiz.apiId) return;

  try {
    await quizStore.duplicateQuiz(quiz.apiId);
    showToast(t("myQuizzes.toasts.duplicated", { title: quiz.title }));
  } catch {
    showToast(t("myQuizzes.toasts.duplicateFailed"), "error");
  }
}

function deleteQuiz(quiz: QuizListItem) {
  if (!quiz.apiId) return;

  openConfirm({
    title: t("myQuizzes.actions.deleteTitle"),
    message: t("myQuizzes.actions.deleteMessage", { title: quiz.title }),
    confirmLabel: t("myQuizzes.actions.deleteConfirm"),
    danger: true,
    onConfirm: async () => {
      try {
        await quizStore.deleteQuiz(quiz.apiId!);
        showToast(t("myQuizzes.toasts.deleted"));
      } catch {
        showToast(t("myQuizzes.toasts.deleteFailed"), "error");
      }
    }
  });
}

async function viewResults(quiz: QuizListItem) {
  if (!quiz.apiId) return;

  try {
    const results = await fetchQuizResultDetail(quiz.apiId);
    if (results.totalSubmissions === 0) {
      showToast(t("myQuizzes.toasts.noSubmissions"), "info");
      return;
    }
  } catch {
    // Network error — fall through and let the results page handle it
  }

  router.push({ name: "result-quiz-detail", params: { quizId: quiz.apiId } });
}

function shareQuiz(quiz: QuizListItem) {
  if (!quiz.apiId) return;

  const baseUrl = import.meta.env.VITE_SITE_URL ?? window.location.origin;
  const identifier = quiz.slug ?? quiz.apiId;
  shareState.value = {
    open: true,
    title: quiz.title,
    url: `${baseUrl}/q/${identifier}`
  };
}

function copyPrivateCode(quiz: QuizListItem) {
  if (!quiz.accessCode) return;
  privateCodeState.value = {
    open: true,
    title: quiz.title,
    code: quiz.accessCode
  };
}

</script>

<template>
  <section class="my-quizzes-page">
    <PageHeader
      :title="t('myQuizzes.title')"
      :description="t('myQuizzes.description')"
    />

    <!-- UX-5: Dashboard stats / empty-dashboard state.
         Shows a skeleton while the initial load runs, a welcome banner when
         there are no quizzes yet, or live stat pills once quizzes exist. -->
    <AppStatsBar
      :items="quizStatsItems"
      height="56px"
      :loading="isInitialLoad"
      :empty="false"
      :clickable="apiQuizzes.length > 0"
      :aria-label="t('myQuizzes.stats.aria')"
      :loading-label="t('myQuizzes.stats.loading')"
      :empty-title="t('myQuizzes.stats.emptyTitle')"
      :empty-description="t('myQuizzes.stats.emptyDescription')"
      @item-click="handleStatClick"
    />

    <section
      class="quiz-manager-card"
      aria-labelledby="my-quizzes-list-title"
      :aria-busy="isInitialLoad"
    >
      <h2 id="my-quizzes-list-title" class="sr-only">{{ t("myQuizzes.listTitle") }}</h2>

      <!-- Initial load: show skeleton instead of blank card area.
           Transition requires exactly one root child per branch, so each branch
           is a single element keyed to let Vue swap them cleanly. -->
      <Transition name="quiz-list-fade" mode="out-in">
        <QuizListSkeleton
          v-if="isInitialLoad"
          key="skeleton"
          :count="5"
          :aria-label="t('myQuizzes.loading')"
        />

        <div v-else key="content" class="quiz-manager-content">
          <AppToolbar
            v-model:search="searchQuery"
            :search-placeholder="t('myQuizzes.toolbar.searchPlaceholder')"
            :filters="toolbarFilters"
            :view-mode="viewMode"
            @update:filters="onToolbarFiltersChange"
            @update:view-mode="viewMode = $event"
          />

          <SectionErrorState
            v-if="quizStore.error && !quizStore.isLoading"
            :message="quizStore.error.userMessage"
            :retryable="quizStore.error.isRetryable"
            :loading="quizStore.isLoading"
            :retry-label="t('myQuizzes.retry')"
            @retry="retryLoadQuizzes"
          />

          <template v-else-if="filteredQuizzes.length">
            <template v-if="viewMode === 'list'">
              <QuizTable
                :quizzes="pagedQuizzes"
                :offset="pageOffset"
                :page-size="PAGE_SIZE"
                :sort-key="sortKey"
                :sort-dir="sortDir"
                @view="viewQuiz"
                @edit="editQuiz"
                @publish="publishQuiz"
                @unpublish="unpublishQuiz"
                @duplicate="duplicateQuiz"
                @delete="deleteQuiz"
                @share="shareQuiz"
                @copy-code="copyPrivateCode"
                @sort="onSort"
                @row-click="viewResults"
              />
              <QuizCardList
                :quizzes="pagedQuizzes"
                @view="viewQuiz"
                @edit="editQuiz"
                @publish="publishQuiz"
                @unpublish="unpublishQuiz"
                @duplicate="duplicateQuiz"
                @delete="deleteQuiz"
                @share="shareQuiz"
                @copy-code="copyPrivateCode"
              />
            </template>

            <QuizGrid
              v-else
              :quizzes="pagedQuizzes"
              @view="viewQuiz"
              @edit="editQuiz"
              @publish="publishQuiz"
              @unpublish="unpublishQuiz"
              @duplicate="duplicateQuiz"
              @delete="deleteQuiz"
              @share="shareQuiz"
              @copy-code="copyPrivateCode"
            />

            <QuizPagination
              :current-page="currentPage"
              :total-pages="totalPages"
              :showing-copy="showingCopy"
              @update:current-page="setPage"
            />
          </template>

          <!-- UX-4: no-quizzes (first-time) vs no-results (filtered empty) -->
          <QuizEmptyState
            v-else
            :variant="isFilteredEmpty ? 'no-results' : 'no-quizzes'"
            @create="createQuiz"
            @clear-filters="clearFilters"
          />
        </div>
      </Transition>
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

  <PrivateCodeModal
    v-if="privateCodeState.open"
    :title="privateCodeState.title"
    :code="privateCodeState.code"
    @close="privateCodeState.open = false"
  />
</template>

<style>
.quiz-list-fade-enter-active,
.quiz-list-fade-leave-active {
  transition: opacity 0.2s ease;
}

.quiz-list-fade-enter-from,
.quiz-list-fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .quiz-list-fade-enter-active,
  .quiz-list-fade-leave-active {
    transition: none;
  }
}

/* Transparent wrapper required by <Transition> single-root constraint.
   Inherits the flex column layout from .quiz-manager-card. */
.quiz-manager-content {
  display: contents;
}

.my-quizzes-page {
  display: grid;
  gap: 18px;
  min-height: 100%;
}


.quiz-manager-card {
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

.search-clear {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border: 0;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #e2e6ea;
  color: #5a6373;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.search-clear:hover {
  background: #c8cdd5;
}

.search-clear svg {
  width: 12px;
  height: 12px;
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
  align-content: start;
  gap: 10px;
  padding: 12px;
}

.quiz-grid-card {
  display: grid;
  gap: 10px;
  padding: 12px 14px;
}

.grid-card-copy {
  display: grid;
  gap: 3px;
}

.grid-card-copy h3,
.grid-card-copy p,
.grid-card-footer span {
  margin: 0;
}

.grid-card-copy h3 {
  color: #182033;
  font-size: 0.95rem;
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
  flex: 0 0 auto;
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
  flex: 1 1 auto;
  margin: 0;
  min-height: 0;
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

  .quiz-card-list {
    display: grid;
    flex: 1 1 auto;
    align-content: start;
    min-height: 0;
    overflow: visible;
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
