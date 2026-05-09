<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useI18n } from "../../i18n";
import {
  getPublicQuizzes,
  getQuizzesByUsername,
  validatePrivateQuizCode,
  type PublicQuizInfo
} from "../../services/publicQuizApi";

const { t } = useI18n();
const router = useRouter();

// ── Public quiz list ──────────────────────────────────────────
const quizzes = ref<PublicQuizInfo[]>([]);
const searchTerm = ref("");
const sortKey = ref("");
const isLoading = ref(true);
const pageError = ref("");
const PAGE_SIZE = 6;
const visibleCount = ref(PAGE_SIZE);

// ── Private code panel ────────────────────────────────────────
const codeInput = ref("");
const codeError = ref("");
const isValidating = ref(false);
const codeInputRef = ref<HTMLInputElement | null>(null);

// ── Username search panel ─────────────────────────────────────
const usernameInput = ref("");
const isSearching = ref(false);
const searchError = ref("");
const searchedUsername = ref("");
const userResults = ref<PublicQuizInfo[]>([]);
const hasSearched = ref(false);
const usernameInputRef = ref<HTMLInputElement | null>(null);

// ── Computed ──────────────────────────────────────────────────
const normalizedSearchTerm = computed(() => searchTerm.value.trim().toLowerCase());

const filteredQuizzes = computed(() => {
  let list = quizzes.value;
  if (normalizedSearchTerm.value) {
    list = list.filter((quiz) => {
      const searchableText = [
        quiz.title,
        quiz.description,
        quiz.subject ?? "",
        quiz.difficulty ?? "",
        String(quiz.questionCount),
        formatTimeLimit(quiz.timeLimit)
      ]
        .join(" ")
        .toLowerCase();
      return searchableText.includes(normalizedSearchTerm.value);
    });
  }
  if (sortKey.value) {
    list = [...list].sort((a, b) => {
      switch (sortKey.value) {
        case "title-asc":       return a.title.localeCompare(b.title);
        case "title-desc":      return b.title.localeCompare(a.title);
        case "questions-desc":  return b.questionCount - a.questionCount;
        case "questions-asc":   return a.questionCount - b.questionCount;
        default:                return 0;
      }
    });
  }
  return list;
});

const visibleQuizzes = computed(() =>
  normalizedSearchTerm.value
    ? filteredQuizzes.value
    : filteredQuizzes.value.slice(0, visibleCount.value)
);

const hasMore = computed(
  () => !normalizedSearchTerm.value && visibleCount.value < filteredQuizzes.value.length
);

const resultsSummary = computed(() => {
  if (normalizedSearchTerm.value) {
    const n = filteredQuizzes.value.length;
    return t(n === 1 ? "participant.browse.matchOne" : "participant.browse.matchOther", { count: n });
  }
  const shown = Math.min(visibleCount.value, quizzes.value.length);
  return t("participant.browse.showing", { shown, total: quizzes.value.length });
});

const emptyTitle = computed(() =>
  normalizedSearchTerm.value
    ? t("participant.browse.emptySearchTitle")
    : t("participant.browse.emptyTitle")
);

const emptyDescription = computed(() =>
  normalizedSearchTerm.value
    ? t("participant.browse.emptySearchDescription")
    : t("participant.browse.emptyDescription")
);

watch(normalizedSearchTerm, () => { visibleCount.value = PAGE_SIZE; });

// Auto-submit private code at 6 chars
watch(codeInput, (val) => {
  if (val.trim().length === 6 && !isValidating.value) {
    void submitCode();
  }
});

// ── Methods ───────────────────────────────────────────────────
function formatTimeLimit(timeLimit: number | null) {
  return timeLimit
    ? t("participant.browse.timeMinutes", { count: timeLimit })
    : t("participant.browse.untimed");
}

function loadMore() { visibleCount.value += PAGE_SIZE; }

function difficultyClasses(difficulty: string | undefined) {
  switch (difficulty?.toLowerCase()) {
    case "easy":   return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400";
    case "medium": return "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
    case "hard":   return "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400";
    default:       return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
  }
}

async function loadPublicQuizzes() {
  isLoading.value = true;
  pageError.value = "";
  try {
    quizzes.value = await getPublicQuizzes();
  } catch {
    pageError.value = t("participant.browse.loadError");
  } finally {
    isLoading.value = false;
  }
}

async function submitCode() {
  const code = codeInput.value.trim().toUpperCase();
  codeError.value = "";
  isValidating.value = true;
  try {
    const quiz = await validatePrivateQuizCode(code);
    router.push({ name: "public-quiz", params: { slug: quiz.slug }, query: { accessCode: code } });
  } catch {
    codeError.value = t("participant.privateEntry.invalidCode");
  } finally {
    isValidating.value = false;
  }
}

async function searchByUsername() {
  const username = usernameInput.value.trim().toLowerCase();
  if (!username || isSearching.value) return;
  isSearching.value = true;
  searchError.value = "";
  hasSearched.value = false;
  try {
    userResults.value = await getQuizzesByUsername(username);
    searchedUsername.value = username;
    hasSearched.value = true;
  } catch {
    searchError.value = t("participant.userQuizzes.loadError");
  } finally {
    isSearching.value = false;
  }
}

function clearUserSearch() {
  hasSearched.value = false;
  usernameInput.value = "";
  userResults.value = [];
  searchedUsername.value = "";
  searchError.value = "";
  nextTick(() => usernameInputRef.value?.focus());
}

onMounted(loadPublicQuizzes);
</script>

<template>
  <section class="min-h-full bg-white dark:bg-slate-950 text-slate-950 dark:text-white">
    <div class="mx-auto grid w-full max-w-[1180px] gap-8 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">

      <!-- Header -->
      <div class="grid gap-4">
        <p class="text-sm font-extrabold uppercase tracking-[0.08em] text-emerald-600 dark:text-emerald-400">
          {{ t("participant.browse.headerEyebrow") }}
        </p>
        <div class="grid gap-3">
          <h1 class="text-4xl font-extrabold tracking-normal text-slate-950 dark:text-white sm:text-5xl">
            {{ t("participant.browse.headerTitle") }}
          </h1>
          <p class="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
            {{ t("participant.browse.headerDescription") }}
          </p>
        </div>
      </div>

      <!-- Quick-access row -->
      <div class="grid gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 sm:grid-cols-2">

        <!-- Private code -->
        <div class="grid gap-2">
          <label for="access-code-inline" class="text-sm font-extrabold text-slate-700 dark:text-slate-300">
            {{ t("participant.browse.privateTitle") }}
          </label>
          <div class="flex gap-2">
            <input
              id="access-code-inline"
              ref="codeInputRef"
              v-model="codeInput"
              type="text"
              autocomplete="off"
              spellcheck="false"
              maxlength="6"
              placeholder="A1B2C3"
              :disabled="isValidating"
              class="min-h-12 flex-1 rounded-xl border px-4 text-center font-bold uppercase tracking-[0.2em] outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-600 placeholder:normal-case placeholder:tracking-normal placeholder:text-sm placeholder:font-normal disabled:opacity-60"
              :class="codeError
                ? 'border-red-400 bg-white dark:bg-slate-800 text-red-800 dark:text-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900'"
              @input="codeError = ''"
              @keydown.enter="submitCode"
            />
            <button
              type="button"
              :disabled="codeInput.trim().length !== 6 || isValidating"
              class="inline-flex min-h-12 items-center gap-1.5 rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 dark:focus-visible:ring-emerald-800"
              @click="submitCode"
            >
              <svg v-if="isValidating" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke-opacity="0.25" />
                <path d="M12 3a9 9 0 0 1 9 9" stroke-linecap="round" />
              </svg>
              <svg v-else class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M5 12h14m0 0-5-5m5 5-5 5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              {{ t("participant.browse.enterCode") }}
            </button>
          </div>
          <p class="text-xs font-medium text-red-600 dark:text-red-400 min-h-4" aria-live="polite">{{ codeError }}</p>
        </div>

        <!-- Username search -->
        <div class="grid gap-2">
          <label for="username-inline" class="text-sm font-extrabold text-slate-700 dark:text-slate-300">
            {{ t("participant.browse.userTitle") }}
          </label>
          <form class="flex gap-2" @submit.prevent="searchByUsername">
            <span
              class="flex min-h-12 flex-1 items-center gap-2 rounded-xl border px-3 transition"
              :class="searchError
                ? 'border-red-400 bg-white dark:bg-slate-800 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-100 dark:focus-within:ring-red-900'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100 dark:focus-within:ring-emerald-900'"
            >
              <svg class="h-4 w-4 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke-linecap="round" />
              </svg>
              <input
                id="username-inline"
                ref="usernameInputRef"
                v-model="usernameInput"
                type="text"
                autocomplete="off"
                spellcheck="false"
                :placeholder="t('participant.userQuizzes.placeholder')"
                :disabled="isSearching"
                class="min-w-0 flex-1 border-0 bg-transparent text-sm font-semibold text-slate-900 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-normal disabled:opacity-60"
                @input="searchError = ''"
              />
            </span>
            <button
              type="submit"
              :disabled="!usernameInput.trim() || isSearching"
              class="inline-flex min-h-12 items-center gap-1.5 rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 dark:focus-visible:ring-emerald-800"
            >
              <svg v-if="isSearching" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke-opacity="0.25" />
                <path d="M12 3a9 9 0 0 1 9 9" stroke-linecap="round" />
              </svg>
              <svg v-else class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m16.5 16.5 4 4" stroke-linecap="round" />
              </svg>
              {{ isSearching ? t("participant.userQuizzes.searching") : t("participant.userQuizzes.search") }}
            </button>
          </form>
          <p class="text-xs font-medium text-red-600 dark:text-red-400 min-h-4" aria-live="polite">{{ searchError }}</p>
        </div>

      </div><!-- end quick-access row -->

      <!-- Username search results (inline) -->
      <template v-if="hasSearched">
        <div class="grid gap-4">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-sm font-extrabold uppercase tracking-[0.08em] text-emerald-600 dark:text-emerald-400">
                {{ t("participant.userQuizzes.resultEyebrow", { username: searchedUsername }) }}
              </p>
              <p class="text-sm text-slate-500 dark:text-slate-400">
                {{ t("participant.userQuizzes.resultCount", { count: userResults.length }) }}
              </p>
            </div>
            <button
              type="button"
              class="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-xs font-bold text-slate-600 dark:text-slate-400 transition hover:border-slate-300 dark:hover:border-slate-600"
              @click="clearUserSearch"
            >
              <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" stroke-linecap="round" />
              </svg>
              {{ t("participant.browse.clearSearch") }}
            </button>
          </div>

          <!-- User results grid -->
          <div v-if="userResults.length" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <RouterLink
              v-for="quiz in userResults"
              :key="quiz.id"
              :to="{ name: 'user-quiz', params: { username: searchedUsername, slug: quiz.slug } }"
              class="grid gap-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 p-6 shadow-[0_10px_24px_rgba(15,23,42,0.05)] dark:shadow-none transition hover:border-emerald-400 dark:hover:border-emerald-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 dark:focus-visible:ring-emerald-800"
            >
              <div class="flex items-start gap-3">
                <span class="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400" aria-hidden="true">
                  <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
                    <path d="M7 4.75h10" stroke-linecap="round" />
                    <path d="M7 9.75h10" stroke-linecap="round" />
                    <path d="M7 14.75h6" stroke-linecap="round" />
                    <path d="m15.5 17.5 2 2 3.5-4" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M5 4.75h.01M5 9.75h.01M5 14.75h.01" stroke-linecap="round" />
                    <path d="M4 3h16v18H4z" stroke-linejoin="round" opacity="0.28" />
                  </svg>
                </span>
                <h2 class="text-xl font-extrabold leading-snug text-slate-950 dark:text-white">{{ quiz.title }}</h2>
              </div>
              <p class="line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {{ quiz.description || t("participant.browse.defaultDescription") }}
              </p>
              <dl class="grid grid-cols-2 gap-2 text-sm">
                <div class="rounded-xl bg-slate-50 dark:bg-slate-800 p-3">
                  <dt class="text-xs font-bold text-slate-500 dark:text-slate-400">{{ t("participant.browse.questions") }}</dt>
                  <dd class="mt-1 font-extrabold text-slate-950 dark:text-white">{{ quiz.questionCount }}</dd>
                </div>
                <div class="rounded-xl bg-slate-50 dark:bg-slate-800 p-3">
                  <dt class="text-xs font-bold text-slate-500 dark:text-slate-400">{{ t("participant.browse.time") }}</dt>
                  <dd class="mt-1 font-extrabold text-slate-950 dark:text-white">{{ formatTimeLimit(quiz.timeLimit) }}</dd>
                </div>
              </dl>
              <div v-if="quiz.difficulty" class="flex items-center gap-2">
                <span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold" :class="difficultyClasses(quiz.difficulty)">
                  {{ quiz.difficulty }}
                </span>
                <span v-if="quiz.subject" class="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">{{ quiz.subject }}</span>
              </div>
              <div class="mt-auto inline-flex min-h-11 items-center justify-center gap-3 rounded-xl bg-emerald-600 px-5 font-bold text-white shadow-[0_8px_20px_rgba(5,150,105,0.18)]">
                {{ t("participant.browse.startQuiz") }}
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M5 12h14m0 0-5-5m5 5-5 5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
            </RouterLink>
          </div>

          <!-- No user results -->
          <div
            v-else
            class="grid min-h-40 place-items-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8 text-center"
          >
            <div class="grid max-w-sm gap-2">
              <h2 class="text-lg font-extrabold text-slate-950 dark:text-white">
                {{ t("participant.userQuizzes.notFound", { username: searchedUsername }) }}
              </h2>
            </div>
          </div>

          <!-- Divider -->
          <div class="flex items-center gap-4">
            <div class="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
            <span class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
              {{ t("participant.browse.headerEyebrow") }}
            </span>
            <div class="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
          </div>
        </div>
      </template>

      <!-- Search + Sort controls -->
      <div
        v-if="!isLoading && !pageError && quizzes.length"
        class="grid gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-end"
      >
        <label class="grid gap-2" for="public-quiz-search">
          <span class="text-sm font-extrabold text-slate-700 dark:text-slate-300">{{ t("participant.browse.searchLabel") }}</span>
          <span class="flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100 dark:focus-within:ring-emerald-900">
            <svg class="h-5 w-5 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m16.5 16.5 4 4" stroke-linecap="round" />
            </svg>
            <input
              id="public-quiz-search"
              v-model="searchTerm"
              class="min-w-0 flex-1 border-0 bg-transparent text-base font-semibold text-slate-900 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
              type="search"
              :placeholder="t('participant.browse.searchPlaceholder')"
            />
          </span>
        </label>

        <label class="grid gap-2">
          <span class="text-sm font-extrabold text-slate-700 dark:text-slate-300">{{ t("participant.browse.sortLabel") }}</span>
          <select
            v-model="sortKey"
            class="min-h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900 transition cursor-pointer"
          >
            <option value="">{{ t("participant.browse.sortDefault") }}</option>
            <option value="title-asc">{{ t("participant.browse.sortTitleAsc") }}</option>
            <option value="title-desc">{{ t("participant.browse.sortTitleDesc") }}</option>
            <option value="questions-desc">{{ t("participant.browse.sortQuestionsDesc") }}</option>
            <option value="questions-asc">{{ t("participant.browse.sortQuestionsAsc") }}</option>
          </select>
        </label>
      </div>

      <!-- Loading state -->
      <div
        v-if="isLoading"
        class="grid min-h-64 place-items-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
      >
        <div class="grid justify-items-center gap-4 text-center">
          <div class="h-12 w-12 animate-spin rounded-full border-4 border-emerald-100 dark:border-emerald-900 border-t-emerald-600" aria-hidden="true"></div>
          <p class="font-bold text-slate-700 dark:text-slate-300">{{ t("participant.browse.loading") }}</p>
        </div>
      </div>

      <!-- Error state -->
      <div
        v-else-if="pageError"
        class="grid gap-4 rounded-2xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 p-6"
      >
        <p class="font-bold text-red-700 dark:text-red-400">{{ pageError }}</p>
        <button
          class="w-fit rounded-xl border border-red-300 dark:border-red-700 bg-white dark:bg-slate-900 px-5 py-2.5 text-sm font-bold text-red-700 dark:text-red-400 transition hover:bg-red-50 dark:hover:bg-red-950 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-200 dark:focus-visible:ring-red-900"
          @click="loadPublicQuizzes"
        >
          {{ t("participant.browse.retry") }}
        </button>
      </div>

      <!-- Public quiz grid -->
      <div
        v-else-if="visibleQuizzes.length"
        class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        :aria-label="t('participant.browse.gridAria')"
      >
        <RouterLink
          v-for="quiz in visibleQuizzes"
          :key="quiz.id"
          :to="{ name: 'public-quiz', params: { slug: quiz.slug } }"
          class="grid gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-[0_10px_24px_rgba(15,23,42,0.05)] dark:shadow-none transition hover:border-emerald-400 dark:hover:border-emerald-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 dark:focus-visible:ring-emerald-800"
        >
          <div class="flex items-start gap-3">
            <span
              class="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400"
              aria-hidden="true"
            >
              <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
                <path d="M7 4.75h10" stroke-linecap="round" />
                <path d="M7 9.75h10" stroke-linecap="round" />
                <path d="M7 14.75h6" stroke-linecap="round" />
                <path d="m15.5 17.5 2 2 3.5-4" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M5 4.75h.01M5 9.75h.01M5 14.75h.01" stroke-linecap="round" />
                <path d="M4 3h16v18H4z" stroke-linejoin="round" opacity="0.28" />
              </svg>
            </span>
            <h2 class="text-xl font-extrabold leading-snug text-slate-950 dark:text-white">
              {{ quiz.title }}
            </h2>
          </div>

          <p class="line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            {{ quiz.description || t("participant.browse.defaultDescription") }}
          </p>

          <dl class="grid grid-cols-2 gap-2 text-sm">
            <div class="rounded-xl bg-slate-50 dark:bg-slate-800 p-3">
              <dt class="text-xs font-bold text-slate-500 dark:text-slate-400">{{ t("participant.browse.questions") }}</dt>
              <dd class="mt-1 font-extrabold text-slate-950 dark:text-white">{{ quiz.questionCount }}</dd>
            </div>
            <div class="rounded-xl bg-slate-50 dark:bg-slate-800 p-3">
              <dt class="text-xs font-bold text-slate-500 dark:text-slate-400">{{ t("participant.browse.time") }}</dt>
              <dd class="mt-1 font-extrabold text-slate-950 dark:text-white">{{ formatTimeLimit(quiz.timeLimit) }}</dd>
            </div>
          </dl>

          <div v-if="quiz.difficulty" class="flex items-center gap-2">
            <span
              class="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold"
              :class="difficultyClasses(quiz.difficulty)"
            >
              {{ quiz.difficulty }}
            </span>
            <span v-if="quiz.subject" class="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
              {{ quiz.subject }}
            </span>
          </div>

          <div class="mt-auto inline-flex min-h-11 items-center justify-center gap-3 rounded-xl bg-emerald-600 px-5 font-bold text-white shadow-[0_8px_20px_rgba(5,150,105,0.18)]">
            {{ t("participant.browse.startQuiz") }}
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M5 12h14m0 0-5-5m5 5-5 5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
        </RouterLink>
      </div>

      <!-- Empty state -->
      <div
        v-else
        class="grid min-h-64 place-items-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8 text-center"
      >
        <div class="grid max-w-md gap-3">
          <h2 class="text-2xl font-extrabold tracking-normal text-slate-950 dark:text-white">{{ emptyTitle }}</h2>
          <p class="text-slate-600 dark:text-slate-400">{{ emptyDescription }}</p>
        </div>
      </div>

      <!-- Load more -->
      <div v-if="hasMore" class="flex justify-center">
        <button
          class="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 text-sm font-bold text-slate-700 dark:text-slate-300 shadow-sm transition hover:border-emerald-300 dark:hover:border-emerald-700 hover:text-emerald-700 dark:hover:text-emerald-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 dark:focus-visible:ring-emerald-800"
          @click="loadMore"
        >
          {{ t("participant.browse.loadMore") }}
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M12 5v14m0 0-5-5m5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>

    </div>
  </section>
</template>
