<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import {
  getPublicQuizBySlug,
  type PublicQuizInfo,
  type PublicQuizQuestion
} from "../services/publicQuizApi";
import QuestionNavigator from "../components/create-quiz/QuestionNavigator.vue";
import type { CreateQuizQuestion } from "../components/create-quiz/types";
import { useQuizAttemptStore } from "../stores/quizAttempt";

type AnswerMap = Record<string, number>;

const route = useRoute();
const router = useRouter();
const attemptStore = useQuizAttemptStore();

const quiz = ref<PublicQuizInfo | null>(null);
const answers = ref<AnswerMap>({});
const currentQuestionIndex = ref(0);
const isLoading = ref(true);
const pageError = ref("");
const isSubmitted = ref(false);
const submittedAt = ref<number | null>(null);
const now = ref(Date.now());
const showLeaveQuizModal = ref(false);
const pendingNavigationPath = ref("");
const allowQuizNavigation = ref(false);

let timer: number | undefined;

const slug = computed(() => String(route.params.slug ?? ""));
const attempt = computed(() => attemptStore.currentAttempt);
const hasActiveAttempt = computed(
  () => Boolean(attempt.value) && attempt.value?.quizSlug === slug.value
);
const questions = computed(() => quiz.value?.questions ?? []);
const totalQuestions = computed(() => questions.value.length);
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value] ?? null);
const currentQuestionId = computed(() => getQuestionKey(currentQuestion.value, currentQuestionIndex.value));
const selectedOptionIndex = computed(() => answers.value[currentQuestionId.value]);
const answeredCount = computed(() =>
  questions.value.filter((question, index) => answers.value[getQuestionKey(question, index)] !== undefined).length
);
const navigatorQuestions = computed<CreateQuizQuestion[]>(() =>
  questions.value.map((question, index) => ({
    id: getQuestionKey(question, index),
    questionText: question.prompt,
    options: question.options.map((option, optionIndex) => ({
      id: `${getQuestionKey(question, index)}-option-${optionIndex}`,
      label: optionLabel(optionIndex),
      text: option,
      isCorrect: optionIndex === question.correctOptionIndex
    })),
    multipleCorrect: false,
    explanation: "",
    status: answers.value[getQuestionKey(question, index)] !== undefined ? "completed" : "empty"
  }))
);
const progressPercent = computed(() => {
  if (!totalQuestions.value) return 0;
  return Math.round(((currentQuestionIndex.value + 1) / totalQuestions.value) * 100);
});
const progressWidth = computed(() => `${progressPercent.value}%`);
const storageKey = computed(() =>
  attempt.value ? `quiz-app-public-answers-${attempt.value.attemptId}` : ""
);
const remainingSeconds = computed(() => {
  if (!attempt.value?.timeLimit) return null;
  const startedAt = new Date(attempt.value.startedAt).getTime();
  const durationSeconds = attempt.value.timeLimit * 60;
  const elapsedSeconds = Math.floor((now.value - startedAt) / 1000);
  return Math.max(durationSeconds - elapsedSeconds, 0);
});
const timeRemainingLabel = computed(() => {
  if (remainingSeconds.value === null) return "Untimed";
  const minutes = Math.floor(remainingSeconds.value / 60);
  const seconds = remainingSeconds.value % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
});
const isTimerWarning = computed(() =>
  remainingSeconds.value !== null && remainingSeconds.value <= 60
);
const shouldConfirmNavigation = computed(() =>
  Boolean(quiz.value) && !pageError.value && !isLoading.value && !isSubmitted.value
);
const timeTakenLabel = computed(() => {
  if (!attempt.value?.startedAt) return "-";
  const startedAt = new Date(attempt.value.startedAt).getTime();
  const endedAt = submittedAt.value ?? now.value;
  const elapsedSeconds = Math.max(Math.floor((endedAt - startedAt) / 1000), 0);
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
});

function getQuestionKey(question: PublicQuizQuestion | null, index: number) {
  return question?.id ?? `question-${index}`;
}

function optionLabel(index: number) {
  return String.fromCharCode(65 + index);
}

function loadSavedAnswers() {
  if (!storageKey.value) { answers.value = {}; return; }
  try {
    answers.value = JSON.parse(window.localStorage.getItem(storageKey.value) ?? "{}") as AnswerMap;
  } catch {
    answers.value = {};
  }
}

function saveAnswers() {
  if (!storageKey.value) return;
  window.localStorage.setItem(storageKey.value, JSON.stringify(answers.value));
}

function selectAnswer(optionIndex: number) {
  if (!currentQuestion.value || isSubmitted.value) return;
  answers.value = { ...answers.value, [currentQuestionId.value]: optionIndex };
}

function goToQuestion(index: number) {
  currentQuestionIndex.value = Math.min(Math.max(index, 0), totalQuestions.value - 1);
}

function goToPreviousQuestion() { goToQuestion(currentQuestionIndex.value - 1); }
function goToNextQuestion() { goToQuestion(currentQuestionIndex.value + 1); }

function submitQuiz() {
  isSubmitted.value = true;
  submittedAt.value = Date.now();
  saveAnswers();
}

function exitQuiz() {
  router.push({ name: "public-quiz", params: { slug: slug.value } });
}

function restartQuiz() {
  if (storageKey.value) window.localStorage.removeItem(storageKey.value);
  answers.value = {};
  currentQuestionIndex.value = 0;
  isSubmitted.value = false;
  submittedAt.value = null;
}

function goToPublicQuizzes() {
  router.push({ name: "public-quizzes" });
}

function handleBeforeUnload(event: BeforeUnloadEvent) {
  if (!shouldConfirmNavigation.value) return;
  event.preventDefault();
  event.returnValue = "";
}

function cancelLeaveQuiz() {
  showLeaveQuizModal.value = false;
  pendingNavigationPath.value = "";
}

function confirmLeaveQuiz() {
  const nextPath = pendingNavigationPath.value;
  allowQuizNavigation.value = true;
  showLeaveQuizModal.value = false;
  pendingNavigationPath.value = "";
  if (nextPath) void router.push(nextPath);
}

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
      return;
    }
    if (!hasActiveAttempt.value) {
      pageError.value = "Start from the quiz landing page so your attempt can be prepared.";
      return;
    }
    if (!questions.value.length) {
      pageError.value = "This quiz does not have any questions yet.";
      return;
    }
    loadSavedAnswers();
  } catch {
    pageError.value = "Something went wrong while loading this quiz. Please try again soon.";
  } finally {
    isLoading.value = false;
  }
}

watch(answers, saveAnswers, { deep: true });
watch(remainingSeconds, (seconds) => {
  if (seconds === 0 && !isSubmitted.value) submitQuiz();
});

onBeforeRouteLeave((to) => {
  if (allowQuizNavigation.value) return true;
  if (!shouldConfirmNavigation.value) return true;
  pendingNavigationPath.value = to.fullPath;
  showLeaveQuizModal.value = true;
  return false;
});

onMounted(() => {
  void loadQuiz();
  timer = window.setInterval(() => { now.value = Date.now(); }, 1000);
  window.addEventListener("beforeunload", handleBeforeUnload);
});

onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer);
  window.removeEventListener("beforeunload", handleBeforeUnload);
});
</script>

<template>
  <section class="relative isolate min-h-full overflow-hidden bg-[#fffdfa] text-slate-950">
    <div class="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      <div class="absolute left-0 top-24 hidden h-16 w-16 rounded-full bg-amber-100/80 blur-sm sm:block"></div>
      <div class="absolute bottom-40 left-8 hidden h-20 w-28 rotate-[-15deg] rounded-[50%] border-4 border-sky-100/80 sm:block"></div>
      <div class="absolute right-12 top-16 hidden text-6xl font-black text-slate-200/90 md:block">?</div>
      <div class="absolute bottom-32 right-8 hidden h-16 w-28 rotate-[12deg] rounded-2xl border-4 border-emerald-100/80 md:block"></div>
      <div class="absolute left-[23%] top-7 h-2 w-2 rotate-45 rounded-sm bg-emerald-300"></div>
      <div class="absolute left-[32%] top-14 h-2 w-2 rotate-45 bg-amber-400"></div>
      <div class="absolute right-[35%] top-10 h-2 w-2 rounded-full border border-amber-400"></div>
      <div class="absolute right-[24%] top-28 h-2 w-2 rounded-full border border-emerald-300"></div>
    </div>

    <div class="relative z-10 mx-auto grid min-h-[calc(100vh-10rem)] w-full max-w-[1180px] gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <header
        v-if="quiz && !pageError && !isLoading && !isSubmitted"
        class="flex min-h-24 flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-900/10 sm:px-8"
      >
        <div class="min-w-0">
          <p class="truncate text-xl font-extrabold text-slate-900">{{ quiz.title }}</p>
          <p class="mt-1 text-sm font-semibold text-slate-500">
            {{ totalQuestions || quiz.questionCount }} questions
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-4">
          <div class="flex items-center gap-3">
            <svg
              class="h-9 w-9 shrink-0 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="8.5" />
              <path d="M12 7v5l3 2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Time remaining</p>
              <p
                class="text-xl font-extrabold tabular-nums leading-tight transition-colors"
                :class="isTimerWarning ? 'text-red-600' : 'text-emerald-600'"
              >
                {{ timeRemainingLabel }}
              </p>
            </div>
          </div>

          <button
            class="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-extrabold text-slate-800 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            type="button"
            @click="exitQuiz"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true">
              <path d="M15 17l5-5-5-5M20 12H9" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M11 19H5V5h6" stroke-linecap="round" />
            </svg>
            Exit quiz
          </button>
        </div>
      </header>

        <!-- Loading -->
        <section
          v-if="isLoading"
          class="grid min-h-[36rem] place-items-center rounded-3xl bg-white shadow-xl shadow-slate-900/5"
        >
          <div class="grid justify-items-center gap-4 text-center">
            <div
              class="h-14 w-14 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600"
              aria-hidden="true"
            ></div>
            <p class="text-lg font-extrabold text-slate-700">Loading quiz…</p>
          </div>
        </section>

        <!-- Error -->
        <section
          v-else-if="pageError"
          class="grid min-h-[36rem] place-items-center rounded-3xl bg-white p-8 text-center shadow-xl shadow-slate-900/5"
        >
          <div class="max-w-xl">
            <div
              class="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-amber-50 text-amber-600"
              aria-hidden="true"
            >
              <svg class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M12 9v4M12 17h.01" stroke-linecap="round" />
                <path d="M10.3 4.3 2.8 17.2A2 2 0 0 0 4.5 20h15a2 2 0 0 0 1.7-2.8L13.7 4.3a2 2 0 0 0-3.4 0Z" stroke-linejoin="round" />
              </svg>
            </div>
            <h1 class="text-3xl font-extrabold tracking-normal">Quiz unavailable</h1>
            <p class="mt-3 text-base leading-7 text-slate-600">{{ pageError }}</p>
            <button
              class="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-600 px-6 font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
              type="button"
              @click="exitQuiz"
            >
              Back to quiz landing
            </button>
          </div>
        </section>

        <!-- Results -->
        <section
          v-else-if="quiz && isSubmitted"
          class="rounded-3xl border border-slate-200/80 bg-[#fffdfa]/90 px-4 py-10 text-center shadow-xl shadow-slate-900/5 sm:px-8 lg:px-12"
        >
          <div class="mx-auto grid max-w-3xl justify-items-center">
            <div
              class="relative grid h-24 w-24 place-items-center rounded-full bg-emerald-100 text-emerald-600 shadow-[0_0_0_18px_rgba(209,250,229,0.55)]"
              aria-hidden="true"
            >
              <svg class="h-11 w-11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="m5 13 4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <h1 class="mt-8 text-4xl font-extrabold tracking-normal text-slate-950 sm:text-5xl">
              Quiz submitted!
            </h1>
            <p class="mt-5 max-w-md text-base font-semibold leading-7 text-slate-500">
              Great job<span v-if="attempt?.takerName">, {{ attempt.takerName }}</span>! Your answers have been submitted successfully.
            </p>

            <section
              class="mt-8 w-full rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-xl shadow-slate-900/10 sm:p-8"
              aria-labelledby="submission-summary-title"
            >
              <h2 id="submission-summary-title" class="text-xl font-extrabold text-slate-900">Summary</h2>
              <div class="mt-7 grid gap-6 sm:grid-cols-3 sm:divide-x sm:divide-slate-200">
                <div class="grid justify-items-center gap-3 px-2 text-center">
                  <span class="grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                    <svg class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <path d="M8 6h13M8 12h13M8 18h13" stroke-linecap="round" />
                      <path d="M3 6h.01M3 12h.01M3 18h.01" stroke-linecap="round" stroke-width="3" />
                    </svg>
                  </span>
                  <p class="text-3xl font-extrabold text-emerald-600">{{ totalQuestions }}</p>
                  <p class="-mt-2 text-sm font-semibold text-slate-500">Questions</p>
                </div>

                <div class="grid justify-items-center gap-3 px-2 text-center">
                  <span class="grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                    <svg class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <circle cx="12" cy="12" r="8" />
                      <path d="M12 7v5l4 2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </span>
                  <p class="text-3xl font-extrabold text-emerald-600 tabular-nums">{{ timeTakenLabel }}</p>
                  <p class="-mt-2 text-sm font-semibold text-slate-500">Time taken</p>
                </div>

                <div class="grid justify-items-center gap-3 px-2 text-center">
                  <span class="grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                    <svg class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <circle cx="12" cy="12" r="8" />
                      <circle cx="12" cy="12" r="3" />
                      <path d="m15 9 4-4M19 5v4M19 5h-4" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </span>
                  <p class="text-3xl font-extrabold text-emerald-600">-</p>
                  <p class="-mt-2 text-sm font-semibold text-slate-500">Score</p>
                </div>
              </div>
            </section>

            <section class="mt-7 grid w-full grid-cols-[3.5rem_1fr] items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 text-left sm:p-6">
              <span class="grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600" aria-hidden="true">
                <svg class="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3 5 5.8v5.6c0 4.2 2.8 7.9 7 9.6 4.2-1.7 7-5.4 7-9.6V5.8L12 3Zm3.5 7.8-4.1 4.1a1 1 0 0 1-1.4 0l-1.8-1.8 1.4-1.4 1.1 1.1 3.4-3.4 1.4 1.4Z" />
                </svg>
              </span>
              <div>
                <h2 class="text-base font-extrabold text-slate-900">Your results will be available soon</h2>
                <p class="mt-1 text-sm font-semibold leading-6 text-slate-500">
                  Results are calculated after the quiz deadline. You can check your results from your dashboard.
                </p>
              </div>
            </section>

            <button
              class="mt-10 inline-flex min-h-14 w-full max-w-md items-center justify-center gap-3 rounded-xl bg-emerald-600 px-8 text-base font-extrabold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2"
              type="button"
              @click="goToPublicQuizzes"
            >
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" stroke-linejoin="round" />
              </svg>
              Back to quizzes
            </button>
          </div>
        </section>

        <!-- Active quiz -->
        <template v-else-if="quiz && currentQuestion">
          <!-- Progress bar -->
          <div class="mb-6 grid gap-2">
            <div class="flex items-center justify-between gap-4 text-sm font-bold text-slate-600">
              <span>Question {{ currentQuestionIndex + 1 }} of {{ totalQuestions }}</span>
              <span>{{ progressPercent }}% completed</span>
            </div>
            <div
              class="h-2.5 overflow-hidden rounded-full bg-slate-200"
              role="progressbar"
              :aria-valuenow="progressPercent"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                class="h-full rounded-full bg-emerald-600 transition-all duration-300"
                :style="{ width: progressWidth }"
              ></div>
            </div>
          </div>

          <!-- Two-column layout: question card + sidebar -->
          <div class="grid min-h-[34rem] items-stretch gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">

            <!-- Question card -->
            <article class="flex min-h-[34rem] flex-col rounded-3xl border border-white/80 bg-white p-6 shadow-xl shadow-slate-900/8 sm:p-8 lg:p-10">
              <p class="text-sm font-extrabold uppercase tracking-widest text-emerald-600">
                Question {{ currentQuestionIndex + 1 }}
              </p>
              <h2 class="mt-5 text-2xl font-extrabold leading-snug tracking-normal text-slate-900 sm:text-3xl">
                {{ currentQuestion.prompt }}
              </h2>
              <p class="mt-3 text-base text-slate-500">Choose the correct answer.</p>

              <!-- Answer options -->
              <div
                class="mt-8 grid gap-3"
                role="radiogroup"
                :aria-label="`Question ${currentQuestionIndex + 1} answers`"
              >
                <button
                  v-for="(option, optionIndex) in currentQuestion.options"
                  :key="`${currentQuestionId}-${optionIndex}`"
                  class="grid min-h-[4.5rem] w-full grid-cols-[2.5rem_1fr] items-center gap-3 rounded-xl border px-5 text-left transition focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-100"
                  :class="
                    selectedOptionIndex === optionIndex
                      ? 'border-emerald-500 bg-emerald-50 text-slate-950 shadow-[0_0_0_1px_rgba(5,150,105,0.35)]'
                      : 'border-gray-200 bg-white text-slate-800 hover:border-emerald-200 hover:bg-emerald-50/50'
                  "
                  type="button"
                  role="radio"
                  :aria-checked="selectedOptionIndex === optionIndex"
                  @click="selectAnswer(optionIndex)"
                >
                  <span
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition"
                    :class="
                      selectedOptionIndex === optionIndex
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-emerald-500 bg-white text-gray-700'
                    "
                    aria-hidden="true"
                  >
                    {{ optionLabel(optionIndex) }}
                  </span>
                  <span class="text-base font-semibold">{{ option }}</span>
                </button>
              </div>

              <!-- Navigation buttons -->
              <div class="mt-auto flex items-center justify-between gap-3 pt-10">
                <button
                  class="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-base font-extrabold text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  type="button"
                  :disabled="currentQuestionIndex === 0"
                  @click="goToPreviousQuestion"
                >
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path d="M19 12H5m0 0 5-5m-5 5 5 5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  Previous
                </button>

                <button
                  v-if="currentQuestionIndex < totalQuestions - 1"
                  class="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 text-base font-extrabold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
                  type="button"
                  @click="goToNextQuestion"
                >
                  Next
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path d="M5 12h14m0 0-5-5m5 5-5 5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>

                <button
                  v-else
                  class="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 text-base font-extrabold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
                  type="button"
                  @click="submitQuiz"
                >
                  Submit quiz
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path d="m5 13 4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>
              </div>
            </article>

            <QuestionNavigator
              :questions="navigatorQuestions"
              :current-question-index="currentQuestionIndex"
              class="min-h-[34rem] lg:top-[5.5rem]"
              @select="goToQuestion"
            />

          </div>
        </template>
    </div>

    <Teleport to="body">
      <div
        v-if="showLeaveQuizModal"
        class="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm"
        role="presentation"
        @click.self="cancelLeaveQuiz"
      >
        <section
          class="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-slate-950 shadow-2xl shadow-slate-950/20 sm:p-7"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="leave-quiz-title"
          aria-describedby="leave-quiz-description"
        >
          <div class="flex items-start gap-4">
            <span
              class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-50 text-amber-600"
              aria-hidden="true"
            >
              <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 9v4M12 17h.01" stroke-linecap="round" />
                <path d="M10.3 4.3 2.8 17.2A2 2 0 0 0 4.5 20h15a2 2 0 0 0 1.7-2.8L13.7 4.3a2 2 0 0 0-3.4 0Z" stroke-linejoin="round" />
              </svg>
            </span>
            <div class="min-w-0">
              <h2 id="leave-quiz-title" class="text-xl font-extrabold tracking-normal text-slate-950">
                Leave quiz?
              </h2>
              <p id="leave-quiz-description" class="mt-2 text-sm font-semibold leading-6 text-slate-600">
                Your quiz has not been submitted yet. If you leave now, your current attempt may not count.
              </p>
            </div>
          </div>

          <div class="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              class="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-extrabold text-slate-800 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              type="button"
              @click="cancelLeaveQuiz"
            >
              Stay here
            </button>
            <button
              class="inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-600 px-5 text-sm font-extrabold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2"
              type="button"
              @click="confirmLeaveQuiz"
            >
              Leave quiz
            </button>
          </div>
        </section>
      </div>
    </Teleport>
  </section>
</template>
