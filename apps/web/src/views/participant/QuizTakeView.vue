<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import {
  getPublicQuizBySlug,
  submitQuizAttempt,
  type PublicQuizInfo,
  type PublicQuizQuestion
} from "../../services/publicQuizApi";
import QuestionNavigator from "../../components/create-quiz/QuestionNavigator.vue";
import type { CreateQuizQuestion } from "../../components/create-quiz/types";
import { useI18n } from "../../i18n";
import { useQuizAttemptStore } from "../../stores/quizAttempt";

type AnswerMap = Record<string, number>;

const route = useRoute();
const router = useRouter();
const attemptStore = useQuizAttemptStore();
const { t } = useI18n();

const quiz = ref<PublicQuizInfo | null>(null);
const answers = ref<AnswerMap>({});
const currentQuestionIndex = ref(0);
const isLoading = ref(true);
const pageError = ref("");
const isSubmitted = ref(false);
const isReviewMode = ref(false);
const submittedAt = ref<number | null>(null);
const score = ref<number | null>(null);
const totalQuestionsAtSubmit = ref<number | null>(null);
const now = ref(Date.now());
const showLeaveQuizModal = ref(false);
const showClearAnswersModal = ref(false);
const pendingNavigationPath = ref("");
const allowQuizNavigation = ref(false);

let timer: number | undefined;
let autoAdvanceTimer: number | undefined;

const slug = computed(() => String(route.params.slug ?? ""));
const attempt = computed(() => attemptStore.currentAttempt);
const hasActiveAttempt = computed(
  () => Boolean(attempt.value) && attempt.value?.quizSlug === slug.value
);
const questions = computed(() => quiz.value?.questions ?? []);
const totalQuestions = computed(() => questions.value.length);
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value] ?? null);
const currentQuestionExplanation = computed(() => currentQuestion.value?.explanation?.trim() ?? "");
const currentQuestionId = computed(() => getQuestionKey(currentQuestion.value, currentQuestionIndex.value));
const selectedOptionIndex = computed(() => answers.value[currentQuestionId.value]);
const answeredCount = computed(() =>
  questions.value.filter((question, index) => answers.value[getQuestionKey(question, index)] !== undefined).length
);
const unansweredCount = computed(() => Math.max(totalQuestions.value - answeredCount.value, 0));
const reviewStatuses = computed<Record<string, CreateQuizQuestion["reviewStatus"]>>(() => {
  if (!isReviewMode.value) return {};

  return questions.value.reduce<Record<string, CreateQuizQuestion["reviewStatus"]>>((statuses, question, index) => {
    const questionKey = getQuestionKey(question, index);
    statuses[questionKey] = answers.value[questionKey] === question.correctOptionIndex ? "correct" : "incorrect";
    return statuses;
  }, {});
});
const navigatorQuestions = computed<CreateQuizQuestion[]>(() =>
  questions.value.map((question, index) => {
    const questionKey = getQuestionKey(question, index);
    const selectedIndex = answers.value[questionKey];

    return {
      id: questionKey,
      questionText: question.prompt,
      options: question.options.map((option, optionIndex) => ({
        id: `${questionKey}-option-${optionIndex}`,
        label: optionLabel(optionIndex),
        text: option,
        isCorrect: optionIndex === question.correctOptionIndex
      })),
      multipleCorrect: false,
      explanation: question.explanation ?? "",
      status: selectedIndex !== undefined ? "completed" : "empty",
      reviewStatus: reviewStatuses.value[questionKey]
    };
  })
);
const answerProgressPercent = computed(() => {
  if (!totalQuestions.value) return 0;
  return Math.round((answeredCount.value / totalQuestions.value) * 100);
});
const showQuestionNavigator = computed(() => totalQuestions.value > 1);
const canSubmitQuiz = computed(() => unansweredCount.value === 0);
const storageKey = computed(() =>
  attempt.value ? `quiz-app-public-answers-${attempt.value.attemptId}` : ""
);
const remainingSeconds = computed(() => {
  if (!quiz.value?.timeLimit) return null;
  const startedAt = new Date(attempt.value?.startedAt ?? Date.now()).getTime();
  const durationSeconds = quiz.value.timeLimit * 60;
  const elapsedSeconds = Math.floor((now.value - startedAt) / 1000);
  return Math.max(durationSeconds - elapsedSeconds, 0);
});
const timeRemainingLabel = computed(() => {
  if (remainingSeconds.value === null) return t("participant.browse.untimed");
  const minutes = Math.floor(remainingSeconds.value / 60);
  const seconds = remainingSeconds.value % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
});
const isTimerWarning = computed(() =>
  remainingSeconds.value !== null && remainingSeconds.value <= 60
);
const shouldConfirmNavigation = computed(() =>
  Boolean(quiz.value) && !pageError.value && !isLoading.value && !isSubmitted.value && !isReviewMode.value
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
const submittedTotalQuestions = computed(() => totalQuestionsAtSubmit.value ?? totalQuestions.value);
const scorePercent = computed(() => {
  if (score.value === null || submittedTotalQuestions.value === 0) return null;
  return Math.round((score.value / submittedTotalQuestions.value) * 100);
});
const reviewProgressPercent = computed(() => {
  if (!totalQuestions.value) return 0;
  return Math.round(((currentQuestionIndex.value + 1) / totalQuestions.value) * 100);
});
const activeProgressPercent = computed(() =>
  isReviewMode.value ? reviewProgressPercent.value : answerProgressPercent.value
);
const activeProgressWidth = computed(() => `${activeProgressPercent.value}%`);
const resultTone = computed(() => {
  if (scorePercent.value === null) {
    return {
      label: t("participant.take.resultsTitleSaved"),
      title: t("participant.take.resultsTitleSaved"),
      message: t("participant.take.resultsMessageSaved"),
      panelClass: "border-slate-200 bg-slate-50/80",
      iconClass: "bg-slate-100 text-slate-600",
      textClass: "text-slate-700",
      scoreClass: "text-slate-700",
      badgeClass: "bg-slate-100 text-slate-700"
    };
  }

  if (scorePercent.value >= 80) {
    return {
      label: t("participant.take.resultsLabelExcellent"),
      title: t("participant.take.resultsTitleExcellent"),
      message: t("participant.take.resultsMessageExcellent"),
      panelClass: "border-emerald-200 bg-emerald-50/80",
      iconClass: "bg-emerald-100 text-emerald-600",
      textClass: "text-emerald-800",
      scoreClass: "text-emerald-600",
      badgeClass: "bg-emerald-100 text-emerald-700"
    };
  }

  if (scorePercent.value >= 60) {
    return {
      label: t("participant.take.resultsLabelGood"),
      title: t("participant.take.resultsTitleGood"),
      message: t("participant.take.resultsMessageGood"),
      panelClass: "border-sky-200 bg-sky-50/80",
      iconClass: "bg-sky-100 text-sky-600",
      textClass: "text-sky-800",
      scoreClass: "text-sky-600",
      badgeClass: "bg-sky-100 text-sky-700"
    };
  }

  return {
    label: t("participant.take.resultsLabelNeedsReview"),
    title: "",
    message: t("participant.take.resultsMessageNeedsReview"),
    panelClass: "border-amber-200 bg-amber-50/80",
    iconClass: "bg-amber-100 text-amber-600",
    textClass: "text-amber-800",
    scoreClass: "text-amber-600",
    badgeClass: "bg-amber-100 text-amber-700"
  };
});
function getQuestionKey(question: PublicQuizQuestion | null, index: number) {
  return question?.id ?? `question-${index}`;
}

function optionLabel(index: number) {
  return String.fromCharCode(65 + index);
}

function isOptionSelected(optionIndex: number) {
  return selectedOptionIndex.value === optionIndex;
}

function isCorrectOption(optionIndex: number) {
  return currentQuestion.value?.correctOptionIndex === optionIndex;
}

function getOptionButtonClasses(optionIndex: number) {
  if (isReviewMode.value) {
    if (isCorrectOption(optionIndex)) {
      return "border-emerald-500 bg-emerald-50 text-slate-950 shadow-[0_0_0_1px_rgba(5,150,105,0.28)]";
    }

    if (isOptionSelected(optionIndex)) {
      return "border-rose-400 bg-rose-50 text-slate-950 shadow-[0_0_0_1px_rgba(244,63,94,0.22)]";
    }

    return "border-gray-200 bg-white text-slate-500";
  }

  return isOptionSelected(optionIndex)
    ? "border-emerald-500 bg-emerald-50 text-slate-950 shadow-[0_0_0_1px_rgba(5,150,105,0.35)]"
    : "border-gray-200 bg-white text-slate-800 hover:border-emerald-200 hover:bg-emerald-50/50";
}

function getOptionLetterClasses(optionIndex: number) {
  if (isReviewMode.value) {
    if (isCorrectOption(optionIndex)) {
      return "border-emerald-600 bg-emerald-600 text-white";
    }

    if (isOptionSelected(optionIndex)) {
      return "border-rose-500 bg-rose-500 text-white";
    }

    return "border-slate-300 bg-white text-slate-500";
  }

  return isOptionSelected(optionIndex)
    ? "border-emerald-600 bg-emerald-600 text-white"
    : "border-emerald-500 bg-white text-gray-700";
}

function getReviewOptionLabel(optionIndex: number) {
  if (!isReviewMode.value) return "";

  if (isCorrectOption(optionIndex) && isOptionSelected(optionIndex)) {
    return t("participant.take.yourCorrectAnswer");
  }

  if (isCorrectOption(optionIndex)) {
    return t("participant.take.correctAnswer");
  }

  if (isOptionSelected(optionIndex)) {
    return t("participant.take.yourAnswer");
  }

  return "";
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
  if (!currentQuestion.value || isSubmitted.value || isReviewMode.value) return;
  answers.value = { ...answers.value, [currentQuestionId.value]: optionIndex };

  if (autoAdvanceTimer) window.clearTimeout(autoAdvanceTimer);
  if (currentQuestionIndex.value < totalQuestions.value - 1) {
    autoAdvanceTimer = window.setTimeout(() => {
      goToNextQuestion();
    }, 180);
  }
}

function goToQuestion(index: number) {
  currentQuestionIndex.value = Math.min(Math.max(index, 0), totalQuestions.value - 1);
}

function goToPreviousQuestion() { goToQuestion(currentQuestionIndex.value - 1); }
function goToNextQuestion() { goToQuestion(currentQuestionIndex.value + 1); }

async function submitQuiz(options: { force?: boolean } = {}) {
  if (isSubmitted.value || isReviewMode.value || (!options.force && !canSubmitQuiz.value)) return;

  isSubmitted.value = true;
  isReviewMode.value = false;
  submittedAt.value = Date.now();
  saveAnswers();

  const currentAttempt = attempt.value;
  if (!currentAttempt || !quiz.value) return;

  const timeTaken = Math.floor((Date.now() - new Date(currentAttempt.startedAt).getTime()) / 1000);
  const result = await submitQuizAttempt({
    quizId: currentAttempt.quizId,
    attemptId: currentAttempt.attemptId,
    answers: answers.value,
    timeTaken
  });

  if (result) {
    score.value = result.score;
    totalQuestionsAtSubmit.value = questions.value.length;
  }
}

function exitQuiz() {
  router.push({ name: "public-quiz", params: { slug: slug.value } });
}

function restartQuiz() {
  if (storageKey.value) window.localStorage.removeItem(storageKey.value);
  attemptStore.clearAttempt();
  allowQuizNavigation.value = true;
  answers.value = {};
  currentQuestionIndex.value = 0;
  isSubmitted.value = false;
  isReviewMode.value = false;
  submittedAt.value = null;
  score.value = null;
  totalQuestionsAtSubmit.value = null;
  router.push({ name: "public-quiz", params: { slug: slug.value } });
}

function goToPublicQuizzes() {
  router.push({ name: "public-quizzes" });
}

function reviewAnswers() {
  currentQuestionIndex.value = 0;
  isSubmitted.value = false;
  isReviewMode.value = true;
}

function returnToResults() {
  isReviewMode.value = false;
  isSubmitted.value = true;
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

function requestClearAnswers() {
  if (answeredCount.value === 0 || isSubmitted.value || isReviewMode.value) return;
  showClearAnswersModal.value = true;
}

function cancelClearAnswers() {
  showClearAnswersModal.value = false;
}

function confirmClearAnswers() {
  answers.value = {};
  if (storageKey.value) window.localStorage.removeItem(storageKey.value);
  showClearAnswersModal.value = false;
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
    quiz.value = await getPublicQuizBySlug(slug.value, attempt.value?.accessCode);
    if (!quiz.value) {
      pageError.value = t("participant.take.loadNotFound");
      return;
    }
    if (!quiz.value.isPublished) {
      pageError.value = t("participant.take.loadUnavailable");
      return;
    }
    if (!hasActiveAttempt.value) {
      pageError.value = t("participant.take.attemptExpired");
      return;
    }
    if (!questions.value.length) {
      pageError.value = t("participant.take.noQuestions");
      return;
    }
    loadSavedAnswers();
  } catch {
    pageError.value = t("participant.take.loadFailed");
  } finally {
    isLoading.value = false;
  }
}

watch(answers, saveAnswers, { deep: true });
watch(remainingSeconds, (seconds) => {
  if (seconds === 0 && !isSubmitted.value && !isReviewMode.value) submitQuiz({ force: true });
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
  if (autoAdvanceTimer) window.clearTimeout(autoAdvanceTimer);
  window.removeEventListener("beforeunload", handleBeforeUnload);
});
</script>

<template>
  <section class="min-h-full bg-[#fffdfa] text-slate-950 lg:h-full lg:overflow-hidden">
    <div
      class="mx-auto grid min-h-full w-full max-w-[1180px] grid-rows-[auto_auto_auto] gap-3 px-4 py-3 sm:px-6 lg:h-full lg:grid-rows-[auto_auto_minmax(0,1fr)] lg:px-8"
    >
      <header
        v-if="quiz && !pageError && !isLoading && !isSubmitted"
        class="flex min-h-16 flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg shadow-slate-900/8 sm:px-5"
      >
        <div class="min-w-0">
          <p class="truncate text-lg font-extrabold text-slate-900">{{ quiz.title }}</p>
          <p class="mt-1 text-sm font-semibold text-slate-500">
            {{
              isReviewMode
                ? t("participant.take.reviewMode")
                : t("participant.take.questionsCount", { count: totalQuestions || quiz.questionCount })
            }}
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-4">
          <div
            class="flex items-center gap-2 rounded-xl px-3 py-1.5"
            :class="isReviewMode || remainingSeconds === null ? 'bg-slate-50 text-slate-600' : 'bg-white'"
          >
            <svg
              v-if="!isReviewMode"
              class="h-8 w-8 shrink-0 text-slate-400"
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
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {{
                  isReviewMode
                    ? t("participant.take.score")
                    : remainingSeconds === null
                      ? t("participant.take.timeLimit")
                      : t("participant.take.timeRemaining")
                }}
              </p>
              <p
                class="tabular-nums leading-tight transition-colors"
                :class="[
                  isReviewMode || remainingSeconds === null ? 'text-sm font-extrabold text-slate-700' : 'text-lg font-extrabold',
                  !isReviewMode && isTimerWarning ? 'text-red-600' : 'text-emerald-600'
                ]"
              >
                {{ isReviewMode
                  ? `${score !== null ? score : "-"} / ${submittedTotalQuestions}`
                  : remainingSeconds === null ? t("participant.take.noTimeLimit") : timeRemainingLabel }}
              </p>
            </div>
          </div>

          <button
            class="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-800 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            type="button"
            @click="isReviewMode ? returnToResults() : exitQuiz()"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true">
              <path d="M15 17l5-5-5-5M20 12H9" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M11 19H5V5h6" stroke-linecap="round" />
            </svg>
            {{ isReviewMode ? t("participant.take.backToResults") : t("participant.take.exitQuiz") }}
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
            <p class="text-lg font-extrabold text-slate-700">{{ t("participant.take.loading") }}</p>
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
            <h1 class="text-3xl font-extrabold tracking-normal">{{ t("participant.landing.unavailableTitle") }}</h1>
            <p class="mt-3 text-base leading-7 text-slate-600">{{ pageError }}</p>
            <button
              class="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-600 px-6 font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
              type="button"
              @click="exitQuiz"
            >
              {{ t("participant.browse.startQuiz") }}
            </button>
          </div>
        </section>

        <!-- Results -->
        <section
          v-else-if="quiz && isSubmitted"
          class="overflow-hidden rounded-3xl border border-slate-200/80 bg-[#fffdfa]/90 px-4 py-3 text-center shadow-xl shadow-slate-900/5 sm:px-8 sm:py-3 lg:px-12"
        >
          <div class="mx-auto grid max-w-3xl justify-items-center">
            <div
              class="relative grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600 shadow-[0_0_0_9px_rgba(209,250,229,0.55)] sm:h-16 sm:w-16 sm:shadow-[0_0_0_11px_rgba(209,250,229,0.55)]"
              aria-hidden="true"
            >
              <svg class="h-8 w-8 sm:h-9 sm:w-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="m5 13 4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <h1 class="mt-4 text-4xl font-extrabold tracking-normal text-slate-950 sm:text-[2.65rem]">
              {{ t("participant.take.submitQuiz") }}
            </h1>
            <p class="mt-3 max-w-full whitespace-nowrap text-base font-semibold leading-6 text-slate-500 max-sm:whitespace-normal">
              {{ attempt?.takerName ? t("participant.take.submittedSuccessNamed", { name: attempt.takerName }) : t("participant.take.submittedSuccessAnonymous") }}
            </p>

            <section
              v-if="quiz.allowSummary"
              class="mt-5 w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-xl shadow-slate-900/10 sm:p-5"
              aria-labelledby="submission-summary-title"
            >
              <div class="flex flex-wrap items-center justify-between gap-3">
                <h2 id="submission-summary-title" class="text-xl font-extrabold text-slate-900">{{ t("participant.take.score") }}</h2>
                <span
                  class="inline-flex min-h-8 items-center rounded-full px-3 text-sm font-extrabold"
                  :class="resultTone.badgeClass"
                >
                  {{ resultTone.label }}
                </span>
              </div>
              <div class="mt-4 grid gap-4 sm:grid-cols-[1fr_1fr_1.25fr] sm:divide-x sm:divide-slate-200">
                <div class="grid justify-items-center gap-2 px-2 text-center">
                  <span class="grid h-12 w-12 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                    <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <path d="M8 6h13M8 12h13M8 18h13" stroke-linecap="round" />
                      <path d="M3 6h.01M3 12h.01M3 18h.01" stroke-linecap="round" stroke-width="3" />
                    </svg>
                  </span>
                  <p class="text-3xl font-extrabold leading-none text-emerald-600">{{ totalQuestions }}</p>
                  <p class="-mt-2 text-sm font-semibold text-slate-500">{{ t("participant.browse.questions") }}</p>
                </div>

                <div class="grid justify-items-center gap-2 px-2 text-center">
                  <span class="grid h-12 w-12 place-items-center rounded-full bg-sky-50 text-sky-600">
                    <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <circle cx="12" cy="12" r="8" />
                      <path d="M12 7v5l4 2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </span>
                  <p class="text-3xl font-extrabold leading-none text-sky-600 tabular-nums">{{ timeTakenLabel }}</p>
                  <p class="-mt-2 text-sm font-semibold text-slate-500">{{ t("results.detail.timeTaken") }}</p>
                </div>

                <div class="grid justify-items-center gap-2 px-2 text-center">
                  <span class="grid h-12 w-12 place-items-center rounded-full" :class="resultTone.iconClass">
                    <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <circle cx="12" cy="12" r="8" />
                      <circle cx="12" cy="12" r="3" />
                      <path d="m15 9 4-4M19 5v4M19 5h-4" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </span>
                  <p class="text-4xl font-extrabold leading-none tabular-nums" :class="resultTone.scoreClass">
                    {{ score !== null && totalQuestionsAtSubmit !== null ? `${score}/${totalQuestionsAtSubmit}` : '-' }}
                  </p>
                  <p class="-mt-2 text-sm font-semibold text-slate-500">
                    {{ t("participant.take.score") }}<span v-if="scorePercent !== null"> - {{ scorePercent }}%</span>
                  </p>
                </div>
              </div>
            </section>

            <section
              v-if="quiz.allowSummary"
              class="mt-4 grid w-full grid-cols-[2.75rem_1fr] items-center gap-3 rounded-2xl border p-3 text-left sm:p-4"
              :class="resultTone.panelClass"
            >
              <span class="grid h-11 w-11 place-items-center rounded-full" :class="resultTone.iconClass" aria-hidden="true">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3 5 5.8v5.6c0 4.2 2.8 7.9 7 9.6 4.2-1.7 7-5.4 7-9.6V5.8L12 3Zm3.5 7.8-4.1 4.1a1 1 0 0 1-1.4 0l-1.8-1.8 1.4-1.4 1.1 1.1 3.4-3.4 1.4 1.4Z" />
                </svg>
              </span>
              <div>
                <h2 v-if="resultTone.title" class="text-base font-extrabold text-slate-900">
                  {{ resultTone.title }}
                </h2>
                <p class="text-sm font-semibold leading-5" :class="resultTone.textClass">
                  <span v-if="score !== null">
                    {{ t("participant.take.resultsAnsweredSummary", { score, total: submittedTotalQuestions, message: resultTone.message }) }}
                  </span>
                  <span v-else>{{ resultTone.message }}</span>
                </p>
              </div>
            </section>

            <div
              class="mt-4 w-full gap-3"
              :class="[quiz.allowReviewAnswers || quiz.allowRetake ? 'grid' : 'flex justify-center',
                [quiz.allowReviewAnswers, quiz.allowRetake].filter(Boolean).length === 2 ? 'sm:grid-cols-3' :
                [quiz.allowReviewAnswers, quiz.allowRetake].filter(Boolean).length === 1 ? 'sm:grid-cols-2' :
                'sm:grid-cols-1']"
            >
              <button
                v-if="quiz.allowReviewAnswers"
                class="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-base font-extrabold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2"
                type="button"
                @click="reviewAnswers"
              >
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M9 11l2 2 4-4" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M7 4h10a2 2 0 0 1 2 2v14l-4-2-3 2-3-2-4 2V6a2 2 0 0 1 2-2Z" stroke-linejoin="round" />
                </svg>
                {{ t("participant.take.reviewAnswers") }}
              </button>

              <button
                v-if="quiz.allowRetake"
                class="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-base font-extrabold text-slate-800 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                type="button"
                @click="restartQuiz"
              >
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M4 12a8 8 0 1 0 2.3-5.7M4 4v6h6" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                {{ t("participant.take.retakeQuiz") }}
              </button>

              <button
                class="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-base font-extrabold text-slate-800 shadow-sm transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                type="button"
                @click="goToPublicQuizzes"
              >
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" stroke-linejoin="round" />
                </svg>
                {{ t("participant.take.backToQuizzes") }}
              </button>
            </div>
          </div>
        </section>

        <!-- Active quiz -->
        <template v-else-if="quiz && currentQuestion">
          <!-- Progress bar -->
          <div class="grid gap-2">
            <div class="flex items-center justify-between gap-4 text-xs font-bold text-slate-600 sm:text-sm">
              <span>{{
                t("participant.take.questionProgress", {
                  current: currentQuestionIndex + 1,
                  total: totalQuestions
                })
              }}</span>
              <span>
                {{ isReviewMode
                  ? t("participant.take.reviewProgress", {
                      score: score !== null ? score : "-",
                      total: submittedTotalQuestions
                    })
                  : t("participant.take.answeredProgress", {
                      answered: answeredCount,
                      total: totalQuestions
                    }) }}
              </span>
            </div>
            <div
              class="h-2 overflow-hidden rounded-full bg-slate-200"
              role="progressbar"
              :aria-valuenow="activeProgressPercent"
              aria-valuemin="0"
              aria-valuemax="100"
              :aria-label="isReviewMode
                ? t('participant.take.reviewProgressAria', {
                    current: currentQuestionIndex + 1,
                    total: totalQuestions
                  })
                : t('participant.take.answeredProgressAria', {
                    answered: answeredCount,
                    total: totalQuestions
                  })"
            >
              <div
                class="h-full rounded-full bg-emerald-600 transition-all duration-300"
                :style="{ width: activeProgressWidth }"
              ></div>
            </div>
          </div>

          <!-- Two-column layout: question card + sidebar -->
          <div
            class="grid items-stretch gap-3 overflow-visible lg:min-h-0 lg:overflow-hidden"
            :class="showQuestionNavigator ? 'lg:grid-cols-[minmax(0,1fr)_260px]' : 'mx-auto w-full max-w-4xl lg:grid-cols-1'"
          >

            <!-- Question card -->
            <article class="flex flex-col rounded-2xl border border-white/80 bg-white p-4 shadow-lg shadow-slate-900/8 sm:p-5 lg:min-h-0 lg:overflow-hidden lg:p-6">
              <p class="text-sm font-extrabold uppercase tracking-widest text-emerald-600">
                {{
                  isReviewMode
                    ? t("participant.take.reviewQuestion")
                    : t("createQuiz.fields.question")
                }}
                {{ currentQuestionIndex + 1 }}
              </p>
              <h2 class="mt-3 text-2xl font-extrabold leading-snug tracking-normal text-slate-900">
                {{ currentQuestion.prompt }}
              </h2>
              <p class="mt-2 text-sm text-slate-500 sm:text-base">
                {{ isReviewMode ? t("participant.take.compareAnswer") : t("participant.take.chooseCorrectAnswer") }}
              </p>

              <!-- Answer options -->
              <div
                class="mt-4 grid gap-2.5"
                role="radiogroup"
                :aria-label="t('participant.take.answersAria', { number: currentQuestionIndex + 1 })"
              >
                <button
                  v-for="(option, optionIndex) in currentQuestion.options"
                  :key="`${currentQuestionId}-${optionIndex}`"
                  class="grid min-h-14 w-full items-center gap-3 rounded-xl border px-4 text-left transition focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-100 disabled:cursor-default"
                  :class="[
                    isReviewMode ? 'grid-cols-[2.25rem_minmax(0,1fr)_auto]' : 'grid-cols-[2.25rem_1fr]',
                    getOptionButtonClasses(optionIndex)
                  ]"
                  type="button"
                  role="radio"
                  :disabled="isReviewMode"
                  :aria-checked="selectedOptionIndex === optionIndex"
                  :aria-label="t('participant.take.optionAria', { label: optionLabel(optionIndex), option })"
                  @click="selectAnswer(optionIndex)"
                >
                  <span
                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition"
                    :class="getOptionLetterClasses(optionIndex)"
                    aria-hidden="true"
                  >
                    {{ optionLabel(optionIndex) }}
                  </span>
                  <span class="text-base font-semibold">{{ option }}</span>
                  <span
                    v-if="getReviewOptionLabel(optionIndex)"
                    class="rounded-full px-3 py-1 text-xs font-extrabold"
                    :class="isCorrectOption(optionIndex) ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'"
                  >
                    {{ getReviewOptionLabel(optionIndex) }}
                  </span>
                </button>
              </div>

              <section
                v-if="isReviewMode && currentQuestionExplanation"
                class="mt-4 rounded-2xl border border-sky-200 bg-sky-50/70 p-4 text-left"
                :aria-label="t('participant.take.explanationAria')"
              >
                <div class="flex items-start gap-3">
                  <span class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sky-100 text-sky-700" aria-hidden="true">
                    <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 17v-5" stroke-linecap="round" />
                      <path d="M12 8h.01" stroke-linecap="round" stroke-width="3" />
                      <circle cx="12" cy="12" r="9" />
                    </svg>
                  </span>
                  <div class="min-w-0">
                    <h3 class="text-sm font-extrabold text-slate-900">{{ t("participant.take.explanationTitle") }}</h3>
                    <p class="mt-1 text-sm font-semibold leading-6 text-slate-600">
                      {{ currentQuestionExplanation }}
                    </p>
                  </div>
                </div>
              </section>

              <!-- Navigation buttons -->
              <div class="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
                <button
                  v-if="!isReviewMode"
                  class="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-base font-extrabold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:cursor-not-allowed disabled:text-slate-400 disabled:opacity-60 disabled:hover:border-slate-200 disabled:hover:bg-white sm:w-auto sm:justify-self-start"
                  type="button"
                  :disabled="answeredCount === 0"
                  :title="answeredCount === 0 ? t('participant.take.noAnswersToClear') : t('participant.take.clearAnswers')"
                  @click="requestClearAnswers"
                >
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  {{ t("participant.take.clearAnswers") }}
                </button>
                <div v-else class="hidden min-h-12 sm:block" aria-hidden="true"></div>

                <div class="grid min-w-0 grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-center">
                  <button
                    class="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-base font-extrabold text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-5"
                    type="button"
                    :disabled="currentQuestionIndex === 0"
                    @click="goToPreviousQuestion"
                  >
                    <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <path d="M19 12H5m0 0 5-5m-5 5 5 5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    {{ t("participant.take.previous") }}
                  </button>

                  <button
                    class="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 text-base font-extrabold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 disabled:opacity-60 disabled:hover:bg-white sm:w-auto sm:px-6"
                    type="button"
                    :disabled="currentQuestionIndex === totalQuestions - 1"
                    @click="goToNextQuestion"
                  >
                    {{ t("participant.take.next") }}
                    <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <path d="M5 12h14m0 0-5-5m5 5-5 5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>
                </div>

                <div v-if="!isReviewMode" class="flex min-w-0 justify-stretch sm:justify-end">
                  <button
                    class="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-7 text-base font-extrabold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none sm:w-auto"
                    type="button"
                    :disabled="!canSubmitQuiz"
                    :title="canSubmitQuiz
                      ? t('participant.take.submitQuiz')
                      : t(
                          unansweredCount === 1
                            ? 'participant.take.submitMoreOne'
                            : 'participant.take.submitMoreOther',
                          { count: unansweredCount }
                        )"
                    @click="submitQuiz()"
                  >
                    {{ t("participant.take.submitQuiz") }}
                    <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <path d="m5 13 4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>
                </div>
                <div v-else class="flex min-w-0 justify-stretch sm:justify-end">
                  <button
                    class="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-7 text-base font-extrabold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 sm:w-auto"
                    type="button"
                    @click="returnToResults"
                  >
                    {{ t("participant.take.doneReviewing") }}
                    <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <path d="m5 13 4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
              <p
                v-if="!isReviewMode && currentQuestionIndex === totalQuestions - 1 && !canSubmitQuiz"
                class="mt-3 text-right text-sm font-semibold text-slate-500"
              >
                {{
                  t(
                    unansweredCount === 1
                      ? "participant.take.submitMoreOne"
                      : "participant.take.submitMoreOther",
                    { count: unansweredCount }
                  )
                }}
              </p>
            </article>

            <QuestionNavigator
              v-if="showQuestionNavigator"
              :questions="navigatorQuestions"
              :current-question-index="currentQuestionIndex"
              :is-review-mode="isReviewMode"
              :review-statuses="reviewStatuses"
              class="self-stretch lg:h-full lg:min-h-0 lg:top-[5.5rem]"
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
                {{ t("participant.take.leaveQuizTitle") }}
              </h2>
              <p id="leave-quiz-description" class="mt-2 text-sm font-semibold leading-6 text-slate-600">
                {{ t("participant.take.leaveQuizDescription") }}
              </p>
            </div>
          </div>

          <div class="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              class="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-extrabold text-slate-800 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              type="button"
              @click="cancelLeaveQuiz"
            >
              {{ t("participant.take.stayHere") }}
            </button>
            <button
              class="inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-600 px-5 text-sm font-extrabold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2"
              type="button"
              @click="confirmLeaveQuiz"
            >
              {{ t("participant.take.leaveQuiz") }}
            </button>
          </div>
        </section>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="showClearAnswersModal"
        class="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm"
        role="presentation"
        @click.self="cancelClearAnswers"
      >
        <section
          class="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-slate-950 shadow-2xl shadow-slate-950/20 sm:p-7"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="clear-answers-title"
          aria-describedby="clear-answers-description"
        >
          <div class="flex items-start gap-4">
            <span
              class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-red-50 text-red-600"
              aria-hidden="true"
            >
              <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            <div class="min-w-0">
              <h2 id="clear-answers-title" class="text-xl font-extrabold tracking-normal text-slate-950">
                {{ t("participant.take.clearAnswersTitle") }}
              </h2>
              <p id="clear-answers-description" class="mt-2 text-sm font-semibold leading-6 text-slate-600">
                {{ t("participant.take.clearAnswersDescription") }}
              </p>
            </div>
          </div>

          <div class="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              class="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-extrabold text-slate-800 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              type="button"
              @click="cancelClearAnswers"
            >
              {{ t("participant.take.keepAnswers") }}
            </button>
            <button
              class="inline-flex min-h-12 items-center justify-center rounded-xl bg-red-600 px-5 text-sm font-extrabold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
              type="button"
              @click="confirmClearAnswers"
            >
              {{ t("participant.take.clearAnswers") }}
            </button>
          </div>
        </section>
      </div>
    </Teleport>

  </section>
</template>
