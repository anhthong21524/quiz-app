<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  createQuizAttempt,
  getPublicQuizBySlug,
  type PublicQuizInfo
} from "../services/publicQuizApi";
import { useQuizAttemptStore } from "../stores/quizAttempt";

const route = useRoute();
const router = useRouter();
const attemptStore = useQuizAttemptStore();

const quiz = ref<PublicQuizInfo | null>(null);
const takerName = ref("");
const nameError = ref("");
const pageError = ref("");
const isLoading = ref(true);
const isStarting = ref(false);

const slug = computed(() => String(route.params.slug ?? ""));
const timeLimitLabel = computed(() =>
  quiz.value?.timeLimit ? `${quiz.value.timeLimit} Minutes` : "Unlimited"
);

async function loadQuiz() {
  isLoading.value = true;
  pageError.value = "";

  try {
    quiz.value = await getPublicQuizBySlug(slug.value);
    if (!quiz.value) {
      pageError.value = "We could not find this quiz. Please check the link and try again.";
      return;
    }

    if (!quiz.value.isPublished) {
      pageError.value = "This quiz is not available yet. Please contact the quiz creator.";
    }
  } catch {
    pageError.value = "Something went wrong while loading this quiz. Please try again soon.";
  } finally {
    isLoading.value = false;
  }
}

function validateName() {
  const trimmedName = takerName.value.trim();
  if (!trimmedName) {
    nameError.value = "Please enter your name before starting the quiz.";
    return null;
  }

  nameError.value = "";
  takerName.value = trimmedName;
  return trimmedName;
}

async function startQuiz() {
  if (!quiz.value || isStarting.value) {
    return;
  }

  const trimmedName = validateName();
  if (!trimmedName) {
    return;
  }

  isStarting.value = true;
  try {
    const attempt = await createQuizAttempt({
      quizId: quiz.value.id,
      takerName: trimmedName
    });

    attemptStore.setAttempt({
      attemptId: attempt.id,
      quizId: quiz.value.id,
      quizSlug: quiz.value.slug,
      takerName: trimmedName,
      startedAt: attempt.startedAt,
      timeLimit: quiz.value.timeLimit ?? attempt.timeLimit
    });

    router.push({ name: "public-quiz-take", params: { slug: quiz.value.slug } });
  } finally {
    isStarting.value = false;
  }
}

function exitQuiz() {
  router.push({ name: "login" });
}

onMounted(loadQuiz);
</script>

<template>
  <main class="min-h-screen overflow-hidden bg-[#f8f4ef] text-[#111827]">
    <header class="relative z-10 border-b border-slate-200/80 bg-white/95 px-5 py-5 shadow-sm">
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <RouterLink class="inline-flex items-center gap-4" :to="{ name: 'login' }">
          <span
            class="grid h-12 w-12 place-items-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" class="h-7 w-7" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M8 5h8" stroke-linecap="round" />
              <path d="M10 5v9a2 2 0 1 0 4 0V5" stroke-linecap="round" />
              <path d="M7 19h10" stroke-linecap="round" />
            </svg>
          </span>
          <span class="text-2xl font-extrabold tracking-normal sm:text-3xl">Quiz App</span>
        </RouterLink>

        <button
          class="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700 sm:px-5 sm:text-base"
          type="button"
          @click="exitQuiz"
        >
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path d="M15 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-3" stroke-linecap="round" />
            <path d="M10 12h11m0 0-3-3m3 3-3 3" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          Exit quiz
        </button>
      </div>
    </header>

    <section
      class="relative mx-auto grid min-h-[calc(100vh-5.5rem)] max-w-7xl grid-rows-[1fr_auto] px-5 py-6 sm:py-8 lg:px-8"
    >
      <div class="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
        <div class="absolute left-12 top-44 h-20 w-20 rounded-full bg-amber-200/70 shadow-2xl shadow-amber-200/50"></div>
        <div class="absolute left-20 top-72 h-28 w-40 rotate-[-10deg] rounded-2xl border border-amber-100 bg-white/60 shadow-xl shadow-slate-900/5"></div>
        <div class="absolute left-24 top-[21rem] h-2 w-28 rounded-full bg-amber-200/70"></div>
        <div class="absolute left-28 top-[23rem] h-2 w-24 rounded-full bg-amber-200/70"></div>
        <div class="absolute right-20 top-40 text-7xl font-black text-slate-300/70">?</div>
        <div class="absolute right-24 top-80 h-28 w-44 rotate-[12deg] rounded-2xl border border-slate-200 bg-white/70 shadow-xl shadow-slate-900/5"></div>
        <div class="absolute right-16 top-[28rem] h-4 w-48 rounded-full bg-emerald-100/80"></div>
        <div class="absolute left-8 top-72 h-36 w-36 rounded-full border-2 border-dashed border-slate-300/70"></div>
        <div class="absolute right-10 top-64 h-44 w-44 rounded-full border-2 border-dashed border-slate-300/70"></div>
        <div class="absolute left-14 top-28 h-3 w-3 rounded-full border-4 border-amber-200"></div>
        <div class="absolute right-36 top-36 h-3 w-3 rounded-full border-4 border-emerald-200"></div>
        <div class="absolute bottom-28 left-48 h-3 w-3 rotate-45 bg-emerald-200"></div>
        <div class="absolute bottom-24 right-48 h-3 w-3 rotate-45 bg-amber-200"></div>
      </div>

      <div class="relative z-10 grid place-items-center">
        <article
          class="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/10 sm:p-8 lg:p-10"
        >
          <div v-if="isLoading" class="grid min-h-[34rem] place-items-center text-center">
            <div>
              <div
                class="mx-auto mb-5 h-14 w-14 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600"
                aria-hidden="true"
              ></div>
              <p class="text-lg font-bold text-slate-700">Loading quiz...</p>
            </div>
          </div>

          <div v-else-if="pageError" class="grid min-h-[34rem] place-items-center text-center">
            <div class="max-w-md">
              <div
                class="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-amber-50 text-amber-600"
                aria-hidden="true"
              >
                <svg viewBox="0 0 24 24" class="h-8 w-8" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M12 9v4M12 17h.01" stroke-linecap="round" />
                  <path d="M10.3 4.3 2.8 17.2A2 2 0 0 0 4.5 20h15a2 2 0 0 0 1.7-2.8L13.7 4.3a2 2 0 0 0-3.4 0Z" stroke-linejoin="round" />
                </svg>
              </div>
              <h1 class="text-3xl font-extrabold tracking-normal">Quiz unavailable</h1>
              <p class="mt-3 text-base leading-7 text-slate-600">{{ pageError }}</p>
            </div>
          </div>

          <form v-else-if="quiz" class="grid gap-6" novalidate @submit.prevent="startQuiz">
            <div class="text-center">
              <div
                class="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-emerald-50 text-emerald-600"
                aria-hidden="true"
              >
                <svg viewBox="0 0 24 24" class="h-10 w-10" fill="currentColor">
                  <path d="M12 3 2.5 8l9.5 5 7-3.68V15h2V8L12 3Z" />
                  <path d="M6.5 12.05v3.2c0 1.83 2.46 3.25 5.5 3.25s5.5-1.42 5.5-3.25v-3.2L12 15l-5.5-2.95Z" />
                </svg>
              </div>
              <h1 class="text-3xl font-extrabold tracking-normal sm:text-4xl">{{ quiz.title }}</h1>
              <p class="mx-auto mt-4 max-w-xl text-lg leading-8 text-slate-600">
                {{ quiz.description }}
              </p>
            </div>

            <div class="grid gap-3 md:grid-cols-3">
              <div class="flex min-h-24 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">
                <span class="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600" aria-hidden="true">
                  <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke-linecap="round" />
                  </svg>
                </span>
                <div>
                  <p class="font-extrabold">{{ quiz.questionCount }} Questions</p>
                  <p class="text-sm font-medium text-slate-500">Multiple choice</p>
                </div>
              </div>

              <div class="flex min-h-24 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">
                <span class="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600" aria-hidden="true">
                  <svg viewBox="0 0 24 24" class="h-7 w-7" fill="none" stroke="currentColor" stroke-width="1.8">
                    <circle cx="12" cy="12" r="8.5" />
                    <path d="M12 7v5l3 2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>
                <div>
                  <p class="font-extrabold">{{ timeLimitLabel }}</p>
                  <p class="text-sm font-medium text-slate-500">Estimated time</p>
                </div>
              </div>

              <div class="flex min-h-24 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">
                <span class="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600" aria-hidden="true">
                  <svg viewBox="0 0 24 24" class="h-7 w-7" fill="none" stroke="currentColor" stroke-width="1.8">
                    <circle cx="12" cy="12" r="8.5" />
                    <circle cx="12" cy="12" r="3" />
                    <path d="m16 8 3-3M19 5h-3M19 5v3" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>
                <div>
                  <p class="font-extrabold">{{ quiz.questionType }}</p>
                  <p class="text-sm font-medium text-slate-500">One correct answer</p>
                </div>
              </div>
            </div>

            <section class="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 sm:p-6">
              <div class="flex gap-4">
                <span class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-600 text-white" aria-hidden="true">
                  <svg viewBox="0 0 24 24" class="h-6 w-6" fill="currentColor">
                    <path d="M12 2.5 5 5.6v5.7c0 4.25 2.92 8.23 7 9.2 4.08-.97 7-4.95 7-9.2V5.6l-7-3.1Zm3.9 7.85-4.55 4.55a1 1 0 0 1-1.42 0L8.1 13.07l1.42-1.42 1.12 1.12 3.84-3.84 1.42 1.42Z" />
                  </svg>
                </span>
                <div>
                  <h2 class="text-lg font-extrabold tracking-normal">Before you start</h2>
                  <ul class="mt-3 grid gap-2 text-sm leading-6 text-slate-600 sm:text-base">
                    <li>You need to provide your name.</li>
                    <li>The timer will start when you begin the quiz.</li>
                    <li>Your answers are saved automatically.</li>
                  </ul>
                </div>
              </div>
            </section>

            <div class="grid gap-3">
              <label class="text-lg font-extrabold" for="taker-name">
                Your name <span class="text-red-500">*</span>
              </label>
              <p class="text-sm font-medium text-slate-600">
                Please enter your name. It will be shown on your result.
              </p>
              <div
                class="flex min-h-16 items-center gap-3 rounded-2xl border bg-white px-4 transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100"
                :class="nameError ? 'border-red-300' : 'border-slate-300'"
              >
                <svg viewBox="0 0 24 24" class="h-6 w-6 shrink-0 text-slate-500" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4.5 21a7.5 7.5 0 0 1 15 0" stroke-linecap="round" />
                </svg>
                <input
                  id="taker-name"
                  v-model="takerName"
                  class="min-w-0 flex-1 border-0 bg-transparent text-base font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                  type="text"
                  autocomplete="name"
                  placeholder="Enter your full name"
                  :aria-invalid="nameError ? 'true' : 'false'"
                  aria-describedby="taker-name-error"
                  @blur="takerName.trim() ? validateName() : undefined"
                />
              </div>
              <p id="taker-name-error" class="min-h-6 text-sm font-bold text-red-600" aria-live="polite">
                {{ nameError }}
              </p>
            </div>

            <button
              class="inline-flex min-h-16 w-full items-center justify-center gap-4 rounded-2xl bg-emerald-600 px-6 text-xl font-extrabold text-white shadow-xl shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
              type="submit"
              :disabled="isStarting"
            >
              <span>{{ isStarting ? "Starting..." : "Start quiz" }}</span>
              <svg viewBox="0 0 24 24" class="h-7 w-7" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M5 12h14m0 0-5-5m5 5-5 5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </form>
        </article>
      </div>

      <div class="relative z-10 mx-auto mt-8 grid w-full max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="flex items-start gap-4 rounded-2xl bg-white/60 p-4 backdrop-blur">
          <span class="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600" aria-hidden="true">
            <svg viewBox="0 0 24 24" class="h-6 w-6" fill="currentColor"><path d="M12 2.5 5 5.6v5.7c0 4.25 2.92 8.23 7 9.2 4.08-.97 7-4.95 7-9.2V5.6l-7-3.1Zm3.5 7.85-4.2 4.2-2.05-2.05 1.25-1.25.8.8 2.95-2.95 1.25 1.25Z" /></svg>
          </span>
          <div>
            <h2 class="font-extrabold tracking-normal">Public Quiz</h2>
            <p class="mt-1 text-sm leading-6 text-slate-600">Anyone with the link can participate</p>
          </div>
        </div>

        <div class="flex items-start gap-4 rounded-2xl bg-white/60 p-4 backdrop-blur">
          <span class="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600" aria-hidden="true">
            <svg viewBox="0 0 24 24" class="h-6 w-6" fill="currentColor"><path d="M9.6 16.2 5.9 12.5l1.4-1.4 2.3 2.3 7.1-7.1 1.4 1.4-8.5 8.5Z" /></svg>
          </span>
          <div>
            <h2 class="font-extrabold tracking-normal">Fair & Secure</h2>
            <p class="mt-1 text-sm leading-6 text-slate-600">All submissions are recorded and reviewed</p>
          </div>
        </div>

        <div class="flex items-start gap-4 rounded-2xl bg-white/60 p-4 backdrop-blur">
          <span class="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600" aria-hidden="true">
            <svg viewBox="0 0 24 24" class="h-6 w-6" fill="currentColor"><path d="M19 18H7a5 5 0 0 1-.83-9.93A6.5 6.5 0 0 1 18.6 10.2 3.9 3.9 0 0 1 19 18Zm-6.1-6.6h-1.8v2H9l3 3 3-3h-2.1v-2Z" /></svg>
          </span>
          <div>
            <h2 class="font-extrabold tracking-normal text-emerald-700">Auto-save</h2>
            <p class="mt-1 text-sm leading-6 text-slate-600">Your progress is saved automatically</p>
          </div>
        </div>

        <div class="flex items-start gap-4 rounded-2xl bg-white/60 p-4 backdrop-blur">
          <span class="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600" aria-hidden="true">
            <svg viewBox="0 0 24 24" class="h-6 w-6" fill="currentColor"><path d="M5 20V9h4v11H5Zm5 0V4h4v16h-4Zm5 0v-7h4v7h-4Z" /></svg>
          </span>
          <div>
            <h2 class="font-extrabold tracking-normal">Instant Results</h2>
            <p class="mt-1 text-sm leading-6 text-slate-600">See your score and review answers at the end</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
