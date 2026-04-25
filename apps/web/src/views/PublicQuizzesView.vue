<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import {
  getPublicQuizzes,
  type PublicQuizInfo
} from "../services/publicQuizApi";

const quizzes = ref<PublicQuizInfo[]>([]);
const searchTerm = ref("");
const isLoading = ref(true);
const pageError = ref("");
const defaultVisibleQuizCount = 6;

const normalizedSearchTerm = computed(() => searchTerm.value.trim().toLowerCase());

const quizCountLabel = computed(() =>
  quizzes.value.length === 1 ? "1 public quiz" : `${quizzes.value.length} public quizzes`
);

const filteredQuizzes = computed(() => {
  if (!normalizedSearchTerm.value) {
    return quizzes.value;
  }

  return quizzes.value.filter((quiz) => {
    const searchableText = [
      quiz.title,
      quiz.description,
      String(quiz.questionCount),
      formatTimeLimit(quiz.timeLimit)
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedSearchTerm.value);
  });
});

const visibleQuizzes = computed(() =>
  normalizedSearchTerm.value
    ? filteredQuizzes.value
    : filteredQuizzes.value.slice(0, defaultVisibleQuizCount)
);

const resultsSummary = computed(() => {
  if (normalizedSearchTerm.value) {
    const matchCount = filteredQuizzes.value.length;
    return matchCount === 1 ? "1 match" : `${matchCount} matches`;
  }

  const visibleCount = Math.min(defaultVisibleQuizCount, quizzes.value.length);
  return `Showing ${visibleCount} of ${quizzes.value.length}`;
});

const emptyTitle = computed(() =>
  normalizedSearchTerm.value ? "No quizzes match your search" : "No public quizzes yet"
);

const emptyDescription = computed(() =>
  normalizedSearchTerm.value
    ? "Try another title, topic, or question count."
    : "Published quizzes will appear here when they are available."
);

function formatTimeLimit(timeLimit: number | null) {
  return timeLimit ? `${timeLimit} min` : "Untimed";
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
  <section class="min-h-full bg-white text-slate-950">
    <div class="mx-auto grid w-full max-w-[1180px] gap-8 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div class="grid gap-4">
        <p class="text-sm font-extrabold uppercase tracking-[0.08em] text-emerald-600">
          Public quizzes
        </p>
        <div class="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div class="grid gap-3">
            <h1 class="text-4xl font-extrabold tracking-normal text-slate-950 sm:text-5xl">
              Choose a quiz to start
            </h1>
            <p class="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Browse available quizzes that are open to everyone. Pick one, enter your name,
              and begin.
            </p>
          </div>
          <span
            class="inline-flex min-h-11 w-fit items-center rounded-full bg-emerald-50 px-4 text-sm font-extrabold text-emerald-700"
          >
            {{ quizCountLabel }}
          </span>
        </div>
      </div>

      <div
        v-if="!isLoading && !pageError && quizzes.length"
        class="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"
      >
        <label class="grid gap-2" for="public-quiz-search">
          <span class="text-sm font-extrabold text-slate-700">Search quizzes</span>
          <span class="flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
            <svg class="h-5 w-5 shrink-0 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m16.5 16.5 4 4" stroke-linecap="round" />
            </svg>
            <input
              id="public-quiz-search"
              v-model="searchTerm"
              class="min-w-0 flex-1 border-0 bg-transparent text-base font-semibold text-slate-900 outline-none placeholder:text-slate-400"
              type="search"
              placeholder="Search by title, topic, or question count"
            />
          </span>
        </label>
        <p class="rounded-full bg-white px-4 py-3 text-sm font-extrabold text-slate-700 shadow-sm">
          {{ resultsSummary }}
        </p>
      </div>

      <div v-if="isLoading" class="grid min-h-64 place-items-center rounded-2xl border border-slate-200 bg-slate-50">
        <div class="grid justify-items-center gap-4 text-center">
          <div
            class="h-12 w-12 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600"
            aria-hidden="true"
          ></div>
          <p class="font-bold text-slate-700">Loading public quizzes...</p>
        </div>
      </div>

      <div v-else-if="pageError" class="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        <p class="font-bold">{{ pageError }}</p>
      </div>

      <div
        v-else-if="visibleQuizzes.length"
        class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        aria-label="Public quizzes"
      >
        <article
          v-for="quiz in visibleQuizzes"
          :key="quiz.id"
          class="grid min-h-72 gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
        >
          <div class="flex items-start gap-4">
            <span
              class="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600"
              aria-hidden="true"
            >
              <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
                <path d="M7 4.75h10" stroke-linecap="round" />
                <path d="M7 9.75h10" stroke-linecap="round" />
                <path d="M7 14.75h6" stroke-linecap="round" />
                <path d="m15.5 17.5 2 2 3.5-4" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M5 4.75h.01M5 9.75h.01M5 14.75h.01" stroke-linecap="round" />
                <path d="M4 3h16v18H4z" stroke-linejoin="round" opacity="0.28" />
              </svg>
            </span>
          </div>

          <div class="grid gap-3">
            <h2 class="text-2xl font-extrabold tracking-normal text-slate-950">
              {{ quiz.title }}
            </h2>
            <p class="line-clamp-3 text-sm leading-6 text-slate-600">
              {{ quiz.description || "A public Quiz App quiz ready to take." }}
            </p>
          </div>

          <dl class="grid grid-cols-2 gap-2 text-sm">
            <div class="rounded-xl bg-slate-50 p-3">
              <dt class="text-xs font-bold text-slate-500">Questions</dt>
              <dd class="mt-1 font-extrabold text-slate-950">{{ quiz.questionCount }}</dd>
            </div>
            <div class="rounded-xl bg-slate-50 p-3">
              <dt class="text-xs font-bold text-slate-500">Time</dt>
              <dd class="mt-1 font-extrabold text-slate-950">{{ formatTimeLimit(quiz.timeLimit) }}</dd>
            </div>
          </dl>

          <RouterLink
            class="mt-auto inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-emerald-600 px-5 font-bold text-white shadow-[0_12px_24px_rgba(5,150,105,0.18)] transition hover:-translate-y-0.5 hover:bg-emerald-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
            :to="{ name: 'public-quiz', params: { slug: quiz.slug } }"
          >
            Start quiz
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M5 12h14m0 0-5-5m5 5-5 5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </RouterLink>
        </article>
      </div>

      <div v-else class="grid min-h-64 place-items-center rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
        <div class="grid max-w-md gap-3">
          <h2 class="text-2xl font-extrabold tracking-normal text-slate-950">{{ emptyTitle }}</h2>
          <p class="text-slate-600">{{ emptyDescription }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
