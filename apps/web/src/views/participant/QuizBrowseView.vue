<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { RouterLink } from "vue-router";
import {
  getPublicQuizzes,
  type PublicQuizInfo
} from "../../services/publicQuizApi";

const quizzes = ref<PublicQuizInfo[]>([]);
const searchTerm = ref("");
const sortKey = ref("");
const isLoading = ref(true);
const pageError = ref("");
const PAGE_SIZE = 6;
const visibleCount = ref(PAGE_SIZE);

const normalizedSearchTerm = computed(() => searchTerm.value.trim().toLowerCase());

const quizCountLabel = computed(() =>
  quizzes.value.length === 1 ? "1 public quiz" : `${quizzes.value.length} public quizzes`
);

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
    return n === 1 ? "1 match" : `${n} matches`;
  }
  const shown = Math.min(visibleCount.value, quizzes.value.length);
  return `Showing ${shown} of ${quizzes.value.length}`;
});

const emptyTitle = computed(() =>
  normalizedSearchTerm.value ? "No quizzes match your search" : "No public quizzes yet"
);

const emptyDescription = computed(() =>
  normalizedSearchTerm.value
    ? "Try another title, topic, or question count."
    : "Published quizzes will appear here when they are available."
);

watch(normalizedSearchTerm, () => {
  visibleCount.value = PAGE_SIZE;
});

function formatTimeLimit(timeLimit: number | null) {
  return timeLimit ? `${timeLimit} min` : "Untimed";
}

function loadMore() {
  visibleCount.value += PAGE_SIZE;
}

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
    pageError.value = "We could not load public quizzes. Please try again soon.";
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadPublicQuizzes);
</script>

<template>
  <section class="min-h-full bg-white dark:bg-slate-950 text-slate-950 dark:text-white">
    <div class="mx-auto grid w-full max-w-[1180px] gap-8 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">

      <!-- Header -->
      <div class="grid gap-4">
        <p class="text-sm font-extrabold uppercase tracking-[0.08em] text-emerald-600 dark:text-emerald-400">
          Public quizzes
        </p>
        <div class="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div class="grid gap-3">
            <h1 class="text-4xl font-extrabold tracking-normal text-slate-950 dark:text-white sm:text-5xl">
              Choose a quiz to start
            </h1>
            <p class="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
              Browse available quizzes that are open to everyone. Pick one, enter your name, and begin.
            </p>
          </div>
        </div>
      </div>

      <!-- Private quiz CTA -->
      <div class="flex items-center justify-between gap-4 rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 px-5 py-4">
        <div class="flex items-center gap-3">
          <span class="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-400" aria-hidden="true">
            <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.9">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke-linejoin="round" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke-linecap="round" />
            </svg>
          </span>
          <div>
            <p class="text-sm font-bold text-amber-900 dark:text-amber-300">Have a private quiz code?</p>
            <p class="text-xs text-amber-700 dark:text-amber-400">Enter your access code to unlock a private quiz.</p>
          </div>
        </div>
        <RouterLink
          :to="{ name: 'private-quiz-entry' }"
          class="shrink-0 inline-flex h-9 items-center gap-2 rounded-xl bg-amber-600 px-4 text-sm font-bold text-white shadow transition hover:bg-amber-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-200 dark:focus-visible:ring-amber-800"
        >
          Enter code
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M5 12h14m0 0-5-5m5 5-5 5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </RouterLink>
      </div>

      <!-- Search + Sort controls -->
      <div
        v-if="!isLoading && !pageError && quizzes.length"
        class="grid gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-end"
      >
        <label class="grid gap-2" for="public-quiz-search">
          <span class="text-sm font-extrabold text-slate-700 dark:text-slate-300">Search quizzes</span>
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
              placeholder="Search by title, topic, or question count"
            />
          </span>
        </label>

        <!-- Sort dropdown -->
        <label class="grid gap-2">
          <span class="text-sm font-extrabold text-slate-700 dark:text-slate-300">Sort by</span>
          <select
            v-model="sortKey"
            class="min-h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900 transition cursor-pointer"
          >
            <option value="">Default</option>
            <option value="title-asc">Title A → Z</option>
            <option value="title-desc">Title Z → A</option>
            <option value="questions-desc">Most questions</option>
            <option value="questions-asc">Fewest questions</option>
          </select>
        </label>

      </div>

      <!-- Loading state -->
      <div
        v-if="isLoading"
        class="grid min-h-64 place-items-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
      >
        <div class="grid justify-items-center gap-4 text-center">
          <div
            class="h-12 w-12 animate-spin rounded-full border-4 border-emerald-100 dark:border-emerald-900 border-t-emerald-600"
            aria-hidden="true"
          ></div>
          <p class="font-bold text-slate-700 dark:text-slate-300">Loading public quizzes...</p>
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
          Try again
        </button>
      </div>

      <!-- Quiz grid -->
      <div
        v-else-if="visibleQuizzes.length"
        class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        aria-label="Public quizzes"
      >
        <RouterLink
          v-for="quiz in visibleQuizzes"
          :key="quiz.id"
          :to="{ name: 'public-quiz', params: { slug: quiz.slug } }"
          class="grid gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-[0_10px_24px_rgba(15,23,42,0.05)] dark:shadow-none transition hover:border-emerald-400 dark:hover:border-emerald-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 dark:focus-visible:ring-emerald-800"
        >
          <!-- Icon + Title inline -->
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

          <!-- Description -->
          <p class="line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            {{ quiz.description || "A public Quiz App quiz ready to take." }}
          </p>

          <!-- Stats row -->
          <dl class="grid grid-cols-2 gap-2 text-sm">
            <div class="rounded-xl bg-slate-50 dark:bg-slate-800 p-3">
              <dt class="text-xs font-bold text-slate-500 dark:text-slate-400">Questions</dt>
              <dd class="mt-1 font-extrabold text-slate-950 dark:text-white">{{ quiz.questionCount }}</dd>
            </div>
            <div class="rounded-xl bg-slate-50 dark:bg-slate-800 p-3">
              <dt class="text-xs font-bold text-slate-500 dark:text-slate-400">Time</dt>
              <dd class="mt-1 font-extrabold text-slate-950 dark:text-white">{{ formatTimeLimit(quiz.timeLimit) }}</dd>
            </div>
          </dl>

          <!-- Difficulty badge -->
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

          <!-- Visual CTA (card itself is the link) -->
          <div
            class="mt-auto inline-flex min-h-11 items-center justify-center gap-3 rounded-xl bg-emerald-600 px-5 font-bold text-white shadow-[0_8px_20px_rgba(5,150,105,0.18)]"
          >
            Start quiz
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
          Load more
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M12 5v14m0 0-5-5m5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>

    </div>
  </section>
</template>
