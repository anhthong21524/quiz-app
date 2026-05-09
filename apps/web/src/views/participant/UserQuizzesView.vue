<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { useI18n } from "../../i18n";
import { getQuizzesByUsername, type PublicQuizInfo } from "../../services/publicQuizApi";

const { t } = useI18n();

const usernameInput = ref("");
const isSearching = ref(false);
const searchError = ref("");
const searchedUsername = ref("");
const results = ref<PublicQuizInfo[]>([]);
const hasSearched = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);

async function search() {
  const username = usernameInput.value.trim().toLowerCase();
  if (!username || isSearching.value) return;

  isSearching.value = true;
  searchError.value = "";
  hasSearched.value = false;

  try {
    results.value = await getQuizzesByUsername(username);
    searchedUsername.value = username;
    hasSearched.value = true;
  } catch {
    searchError.value = t("participant.userQuizzes.loadError");
  } finally {
    isSearching.value = false;
  }
}

function formatTimeLimit(timeLimit: number | null) {
  return timeLimit
    ? t("participant.browse.timeMinutes", { count: timeLimit })
    : t("participant.browse.untimed");
}

function difficultyClasses(difficulty: string | undefined) {
  switch (difficulty?.toLowerCase()) {
    case "easy":   return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400";
    case "medium": return "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
    case "hard":   return "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400";
    default:       return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
  }
}
</script>

<template>
  <section class="min-h-[calc(100vh-128px)] bg-white dark:bg-slate-950 text-slate-950 dark:text-white">
    <div class="mx-auto grid w-full max-w-[1180px] gap-8 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">

      <!-- Header -->
      <div class="grid gap-3 max-w-xl">
        <p class="text-sm font-extrabold uppercase tracking-[0.08em] text-emerald-600 dark:text-emerald-400">
          {{ t("participant.userQuizzes.eyebrow") }}
        </p>
        <h1 class="text-4xl font-extrabold tracking-normal text-slate-950 dark:text-white sm:text-5xl">
          {{ t("participant.userQuizzes.title") }}
        </h1>
        <p class="text-base leading-7 text-slate-600 dark:text-slate-400">
          {{ t("participant.userQuizzes.description") }}
        </p>
      </div>

      <!-- Search card -->
      <div class="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl shadow-slate-900/10">
        <form class="grid gap-4 sm:grid-cols-[1fr_auto]" @submit.prevent="search">
          <label class="grid gap-2" for="username-input">
            <span class="text-sm font-extrabold text-slate-700 dark:text-slate-300">
              {{ t("participant.userQuizzes.label") }}
            </span>
            <span
              class="flex min-h-14 items-center gap-3 rounded-xl border px-4 transition"
              :class="searchError
                ? 'border-red-400 bg-white dark:bg-slate-800 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-100 dark:focus-within:ring-red-900'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100 dark:focus-within:ring-emerald-900'"
            >
              <svg class="h-5 w-5 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke-linecap="round" />
              </svg>
              <input
                id="username-input"
                ref="inputRef"
                v-model="usernameInput"
                type="text"
                autocomplete="off"
                spellcheck="false"
                :placeholder="t('participant.userQuizzes.placeholder')"
                :disabled="isSearching"
                class="min-w-0 flex-1 border-0 bg-transparent text-base font-semibold text-slate-900 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-normal disabled:opacity-60"
                @input="searchError = ''"
              />
            </span>
            <p v-if="searchError" class="text-sm font-medium text-red-600 dark:text-red-400" aria-live="polite">
              {{ searchError }}
            </p>
          </label>

          <div class="flex items-end">
            <button
              type="submit"
              :disabled="!usernameInput.trim() || isSearching"
              class="inline-flex min-h-14 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 text-sm font-bold text-white shadow transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 dark:focus-visible:ring-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="isSearching" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke-opacity="0.25" />
                <path d="M12 3a9 9 0 0 1 9 9" stroke-linecap="round" />
              </svg>
              {{ isSearching ? t("participant.userQuizzes.searching") : t("participant.userQuizzes.search") }}
            </button>
          </div>
        </form>
      </div>

      <!-- Results -->
      <template v-if="hasSearched">

        <!-- Result header -->
        <div class="grid gap-1">
          <p class="text-sm font-extrabold uppercase tracking-[0.08em] text-emerald-600 dark:text-emerald-400">
            {{ t("participant.userQuizzes.resultEyebrow", { username: searchedUsername }) }}
          </p>
          <p class="text-slate-500 dark:text-slate-400 text-sm">
            {{ t("participant.userQuizzes.resultCount", { count: results.length }) }}
          </p>
        </div>

        <!-- Quiz grid -->
        <div
          v-if="results.length"
          class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          <RouterLink
            v-for="quiz in results"
            :key="quiz.id"
            :to="{ name: 'public-quiz', params: { slug: quiz.slug } }"
            class="grid gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-[0_10px_24px_rgba(15,23,42,0.05)] dark:shadow-none transition hover:border-emerald-400 dark:hover:border-emerald-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 dark:focus-visible:ring-emerald-800"
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
              <span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold" :class="difficultyClasses(quiz.difficulty)">
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

        <!-- No results -->
        <div
          v-else
          class="grid min-h-48 place-items-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8 text-center"
        >
          <div class="grid max-w-sm gap-3">
            <h2 class="text-xl font-extrabold text-slate-950 dark:text-white">
              {{ t("participant.userQuizzes.notFound", { username: searchedUsername }) }}
            </h2>
          </div>
        </div>

      </template>

      <!-- Escape hatch -->
      <p class="text-center text-sm text-slate-500 dark:text-slate-400">
        {{ t("participant.privateEntry.noCode") }}
        <RouterLink
          to="/quizzes"
          class="font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition"
        >
          {{ t("participant.userQuizzes.browsePublic") }}
        </RouterLink>
      </p>

    </div>
  </section>
</template>
