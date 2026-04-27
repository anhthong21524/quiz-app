<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Question, Quiz } from "@quiz-app/shared";
import AnswerOptionRow from "../components/create-quiz/AnswerOptionRow.vue";
import CreateQuizStepper from "../components/create-quiz/CreateQuizStepper.vue";
import QuestionNavigator from "../components/create-quiz/QuestionNavigator.vue";
import FullPageErrorState from "../components/feedback/FullPageErrorState.vue";
import EditorFormSkeleton from "../components/loading/EditorFormSkeleton.vue";
import PageHeader from "../components/PageHeader.vue";
import { useToast } from "../composables/useToast";
import { useConfigurationStore } from "../stores/configuration";
import { useQuizStore } from "../stores/quizzes";
import type {
  CreateQuizQuestion,
  DifficultyLevel,
  QuestionOption,
  QuestionStatus
} from "../components/create-quiz/types";

interface ConfigurationForm {
  title: string;
  description: string;
  subject: string;
  numberOfQuestions: number;
  difficulty: DifficultyLevel;
  timeLimitEnabled: boolean;
  timeLimitMinutes: number | null;
  isPrivate: boolean;
}

interface ValidationErrors {
  title?: string;
  description?: string;
  subject?: string;
  numberOfQuestions?: string;
  timeLimitMinutes?: string;
  question?: string;
}

const router = useRouter();
const quizStore = useQuizStore();
const configurationStore = useConfigurationStore();
const { show: showToast } = useToast();

const difficultyOptions: DifficultyLevel[] = ["Easy", "Medium", "Hard"];
const maxQuestions = 50;
const minQuestions = 1;
const maxTimeLimitMinutes = 180;
const defaultTimeLimitMinutes = 30;
const maxOptions = 6;
const minimumOptionCount = 2;
const defaultOptionCount = 4;
const optionLabels = ["A", "B", "C", "D", "E", "F"];

const route = useRoute();
const currentStep = ref<1 | 2>(1);
const currentQuestionIndex = ref(0);
const draggedOptionIndex = ref<number | null>(null);
const dragTargetOptionIndex = ref<number | null>(null);
const isSaving = ref(false);
const originalDescription = ref("");
const validationErrors = reactive<ValidationErrors>({});

const configuration = reactive<ConfigurationForm>({
  title: "Quiz 1",
  description: "",
  subject: configurationStore.primarySubjectDomain,
  numberOfQuestions: 1,
  difficulty: "Easy",
  timeLimitEnabled: false,
  timeLimitMinutes: null,
  isPrivate: false
});

const activeQuizAccessCode = ref<string | undefined>(undefined);
const skipNextLoad = ref(false);

const CONFIG_DRAFT_KEY = "quiz-create-config-draft";

const questions = ref<CreateQuizQuestion[]>([]);

const quizId = computed(() => route.params.id?.toString());
const isEditing = computed(() => Boolean(quizId.value));
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);
const completedQuestions = computed(
  () => questions.value.filter((question) => question.status === "completed").length
);
const progressPercent = computed(() =>
  questions.value.length ? Math.round((completedQuestions.value / questions.value.length) * 100) : 0
);
const loadError = computed(() =>
  quizStore.error && !quizStore.isLoading ? quizStore.error : null
);
const pageTitle = computed(() => (isEditing.value ? "Edit quiz" : "Create new quiz"));
const stepIntro = computed(() => {
  if (currentStep.value === 1) {
    return isEditing.value
      ? "Review the quiz details before updating questions."
      : "Set up the basic details for your quiz before adding questions.";
  }

  return isEditing.value
    ? "Update and organize your questions before saving changes."
    : "Write and organize your questions before saving the quiz.";
});
const subjectOptions = computed(() => {
  const currentSubject = configuration.subject.trim();
  const configuredSubjects = configurationStore.subjectDomains;

  if (currentSubject && !configuredSubjects.includes(currentSubject)) {
    return [currentSubject, ...configuredSubjects];
  }

  return configuredSubjects;
});

function setDefaultSubjectIfNeeded() {
  if (!isEditing.value && !subjectOptions.value.includes(configuration.subject)) {
    configuration.subject = configurationStore.primarySubjectDomain;
  }
}

onMounted(async () => {
  await configurationStore.loadConfiguration();

  if (!isEditing.value) {
    const stored = sessionStorage.getItem(CONFIG_DRAFT_KEY);
    if (stored) {
      try {
        Object.assign(configuration, JSON.parse(stored));
      } catch {
        sessionStorage.removeItem(CONFIG_DRAFT_KEY);
      }
    }
  }

  setDefaultSubjectIfNeeded();
});

watch(
  () => ({ ...configuration }),
  (value) => {
    if (!isEditing.value) {
      sessionStorage.setItem(CONFIG_DRAFT_KEY, JSON.stringify(value));
    }
  }
);

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function createOption(index: number, text = "", isCorrect = false): QuestionOption {
  return {
    id: createId("option"),
    label: optionLabels[index] ?? String.fromCharCode(65 + index),
    text,
    isCorrect
  };
}

function relabelOptions(options: QuestionOption[]) {
  return options.map((option, index) => ({
    ...option,
    label: optionLabels[index] ?? String.fromCharCode(65 + index)
  }));
}

function createEmptyQuestion(index: number): CreateQuizQuestion {
  return {
    id: createId(`question-${index + 1}`),
    questionText: "",
    options: Array.from({ length: defaultOptionCount }, (_, optionIndex) => createOption(optionIndex)),
    multipleCorrect: false,
    explanation: "",
    status: "empty"
  };
}

function resetValidationErrors() {
  validationErrors.title = undefined;
  validationErrors.description = undefined;
  validationErrors.subject = undefined;
  validationErrors.numberOfQuestions = undefined;
  validationErrors.timeLimitMinutes = undefined;
  validationErrors.question = undefined;
}

function resetFlow() {
  configuration.title = "Quiz 1";
  configuration.description = "";
  configuration.subject = configurationStore.primarySubjectDomain;
  configuration.numberOfQuestions = 1;
  configuration.difficulty = "Easy";
  configuration.timeLimitEnabled = false;
  configuration.timeLimitMinutes = null;
  configuration.isPrivate = false;
  activeQuizAccessCode.value = undefined;
  questions.value = [];
  originalDescription.value = "";
  currentQuestionIndex.value = 0;
  currentStep.value = 1;
  resetValidationErrors();
  resetOptionDragState();
  sessionStorage.removeItem(CONFIG_DRAFT_KEY);
}

function getDraftStatus(question: CreateQuizQuestion): QuestionStatus {
  const hasQuestionText = question.questionText.trim().length > 0;
  const hasOptionText = question.options.some((option) => option.text.trim().length > 0);
  const hasExplanation = question.explanation.trim().length > 0;
  const hasCorrect = question.options.some((option) => option.isCorrect);

  if (!hasQuestionText && !hasOptionText && !hasExplanation && !hasCorrect) {
    return "empty";
  }

  return "in_progress";
}

function isQuestionComplete(question: CreateQuizQuestion) {
  const populatedOptions = question.options.filter((option) => option.text.trim().length > 0);
  const correctAnswers = question.options.filter(
    (option) => option.isCorrect && option.text.trim().length > 0
  );

  return (
    question.questionText.trim().length > 0 &&
    populatedOptions.length >= minimumOptionCount &&
    correctAnswers.length >= 1
  );
}

function validateConfiguration() {
  validationErrors.title = configuration.title.trim() ? undefined : "Quiz title is required.";
  validationErrors.description =
    configuration.description.length <= 500 ? undefined : "Description must be 500 characters or fewer.";
  validationErrors.subject = configuration.subject ? undefined : "Subject is required.";

  if (
    Number.isNaN(configuration.numberOfQuestions) ||
    configuration.numberOfQuestions < minQuestions ||
    configuration.numberOfQuestions > maxQuestions
  ) {
    validationErrors.numberOfQuestions = "Number of questions must be between 1 and 50.";
  } else {
    validationErrors.numberOfQuestions = undefined;
  }

  const timeLimitMinutes = configuration.timeLimitMinutes;
  if (configuration.timeLimitEnabled) {
    validationErrors.timeLimitMinutes =
      timeLimitMinutes !== null &&
      Number.isInteger(timeLimitMinutes) &&
      timeLimitMinutes >= 1 &&
      timeLimitMinutes <= maxTimeLimitMinutes
        ? undefined
        : "Time limit must be between 1 and 180 minutes.";
  } else {
    validationErrors.timeLimitMinutes = undefined;
  }

  return (
    !validationErrors.title &&
    !validationErrors.description &&
    !validationErrors.subject &&
    !validationErrors.numberOfQuestions &&
    !validationErrors.timeLimitMinutes
  );
}

function syncQuestionPlaceholders() {
  const nextQuestions = Array.from({ length: configuration.numberOfQuestions }, (_, index) => {
    const existingQuestion = questions.value[index];
    return existingQuestion
      ? {
          ...existingQuestion,
          options: relabelOptions(existingQuestion.options)
        }
      : createEmptyQuestion(index);
  });

  questions.value = nextQuestions;
  currentQuestionIndex.value = Math.min(currentQuestionIndex.value, nextQuestions.length - 1);
}

function mapQuestionToDraft(question: Question, index: number): CreateQuizQuestion {
  const options = question.options.map((option, optionIndex) =>
    createOption(optionIndex, option, optionIndex === question.correctOptionIndex)
  );

  while (options.length < minimumOptionCount) {
    options.push(createOption(options.length));
  }

  const draftQuestion: CreateQuizQuestion = {
    id: question.id ?? createId(`question-${index + 1}`),
    questionText: question.prompt,
    options: relabelOptions(options),
    multipleCorrect: false,
    explanation: question.explanation ?? "",
    status: "empty"
  };

  draftQuestion.status = isQuestionComplete(draftQuestion)
    ? "completed"
    : getDraftStatus(draftQuestion);

  return draftQuestion;
}

function populateEditFlow(quiz: Quiz) {
  configuration.title = quiz.title;
  configuration.description = quiz.description;
  configuration.subject = quiz.subject ?? "";
  configuration.numberOfQuestions = Math.min(
    maxQuestions,
    Math.max(minQuestions, quiz.questions.length || minQuestions)
  );
  configuration.difficulty = quiz.difficulty ?? "Easy";
  configuration.timeLimitEnabled = quiz.timeLimit !== null && quiz.timeLimit !== undefined;
  configuration.timeLimitMinutes = quiz.timeLimit ?? null;
  configuration.isPrivate = quiz.isPrivate ?? false;
  activeQuizAccessCode.value = quiz.accessCode;
  originalDescription.value = quiz.description;
  questions.value = quiz.questions.length
    ? quiz.questions.map(mapQuestionToDraft)
    : [createEmptyQuestion(0)];
  currentQuestionIndex.value = 0;
  currentStep.value = 2;
  resetValidationErrors();
  resetOptionDragState();
}

async function loadQuizForEditing(id: string) {
  try {
    const quiz = await quizStore.loadQuiz(id);
    populateEditFlow(quiz);
  } catch {
    // quizStore.error is shown by loadError.
  }
}

watch(
  quizId,
  async (id) => {
    if (!id) {
      quizStore.activeQuiz = null;
      quizStore.error = null;
      resetFlow();
      return;
    }

    if (skipNextLoad.value) {
      skipNextLoad.value = false;
      return;
    }

    await loadQuizForEditing(id);
  },
  { immediate: true }
);

async function goToQuestionsStep() {
  if (!validateConfiguration() || isSaving.value) {
    return;
  }

  if (!isEditing.value) {
    isSaving.value = true;
    try {
      const savedQuiz = await quizStore.saveQuiz({
        title: configuration.title.trim(),
        description: createQuizDescription(),
        subject: configuration.subject,
        difficulty: configuration.difficulty,
        timeLimit: configuration.timeLimitEnabled ? configuration.timeLimitMinutes : null,
        isPrivate: configuration.isPrivate,
        questions: []
      });
      if (savedQuiz?.accessCode) {
        activeQuizAccessCode.value = savedQuiz.accessCode;
      }
      sessionStorage.removeItem(CONFIG_DRAFT_KEY);
      skipNextLoad.value = true;
      await router.replace({ name: "edit-quiz-questions", params: { id: savedQuiz.id } });
    } catch {
      const message = quizStore.error?.userMessage ?? "Failed to save quiz. Please try again.";
      showToast(message, "error");
      isSaving.value = false;
      return;
    }
    isSaving.value = false;
  }

  syncQuestionPlaceholders();
  currentQuestionIndex.value = 0;
  currentStep.value = 2;
}

async function saveConfigOnly() {
  if (!validateConfiguration() || isSaving.value) {
    return;
  }

  isSaving.value = true;
  try {
    const savedQuiz = await quizStore.saveQuiz({
      title: configuration.title.trim(),
      description: createQuizDescription(),
      subject: configuration.subject,
      difficulty: configuration.difficulty,
      timeLimit: configuration.timeLimitEnabled ? configuration.timeLimitMinutes : null,
      isPrivate: configuration.isPrivate
    }, quizId.value);
    if (savedQuiz?.accessCode) {
      activeQuizAccessCode.value = savedQuiz.accessCode;
    }
    showToast("Configuration saved");
  } catch {
    const message = quizStore.error?.userMessage ?? "Failed to save configuration. Please try again.";
    showToast(message, "error");
  } finally {
    isSaving.value = false;
  }
}

function setUnlimitedTimeLimit() {
  configuration.timeLimitEnabled = false;
  configuration.timeLimitMinutes = null;
  validationErrors.timeLimitMinutes = undefined;
}

function setTimedTimeLimit() {
  configuration.timeLimitEnabled = true;
  configuration.timeLimitMinutes = configuration.timeLimitMinutes ?? defaultTimeLimitMinutes;
}

function markQuestionAsDraft(index: number) {
  const question = questions.value[index];
  if (!question) {
    return;
  }

  question.status = getDraftStatus(question);
  validationErrors.question = undefined;
}

function updateQuestionText(value: string) {
  if (!currentQuestion.value) {
    return;
  }

  currentQuestion.value.questionText = value;
  markQuestionAsDraft(currentQuestionIndex.value);
}

function updateExplanation(value: string) {
  if (!currentQuestion.value) {
    return;
  }

  currentQuestion.value.explanation = value;
  markQuestionAsDraft(currentQuestionIndex.value);
}

function updateOptionText(optionIndex: number, value: string) {
  const question = currentQuestion.value;
  if (!question) {
    return;
  }

  question.options[optionIndex].text = value;
  markQuestionAsDraft(currentQuestionIndex.value);
}

function toggleMultipleCorrect() {
  const question = currentQuestion.value;
  if (!question) {
    return;
  }

  question.multipleCorrect = !question.multipleCorrect;
  if (!question.multipleCorrect) {
    const firstCorrectIndex = question.options.findIndex((option) => option.isCorrect);
    question.options = question.options.map((option, index) => ({
      ...option,
      isCorrect: firstCorrectIndex >= 0 && index === firstCorrectIndex
    }));
  }
  markQuestionAsDraft(currentQuestionIndex.value);
}

function toggleCorrectOption(optionIndex: number) {
  const question = currentQuestion.value;
  if (!question) {
    return;
  }

  if (question.multipleCorrect) {
    question.options[optionIndex].isCorrect = !question.options[optionIndex].isCorrect;
  } else {
    question.options = question.options.map((option, index) => ({
      ...option,
      isCorrect: index === optionIndex
    }));
  }

  markQuestionAsDraft(currentQuestionIndex.value);
}

function addOption() {
  const question = currentQuestion.value;
  if (!question || question.options.length >= maxOptions) {
    return;
  }

  question.options.push(createOption(question.options.length));
  markQuestionAsDraft(currentQuestionIndex.value);
}

function deleteOption(optionIndex: number) {
  const question = currentQuestion.value;
  if (!question || question.options.length <= minimumOptionCount) {
    return;
  }

  question.options.splice(optionIndex, 1);
  question.options = relabelOptions(question.options);

  if (!question.multipleCorrect) {
    const firstCorrectIndex = question.options.findIndex((option) => option.isCorrect);
    question.options = question.options.map((option, index) => ({
      ...option,
      isCorrect: firstCorrectIndex >= 0 && index === firstCorrectIndex
    }));
  }

  markQuestionAsDraft(currentQuestionIndex.value);
}

function resetOptionDragState() {
  draggedOptionIndex.value = null;
  dragTargetOptionIndex.value = null;
}

function beginOptionDrag(optionIndex: number, event: DragEvent) {
  draggedOptionIndex.value = optionIndex;
  dragTargetOptionIndex.value = optionIndex;

  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", optionIndex.toString());
  }
}

function enterOptionDropTarget(optionIndex: number) {
  if (draggedOptionIndex.value === null) {
    return;
  }

  dragTargetOptionIndex.value = optionIndex;
}

function updateOptionDragOver(optionIndex: number, event: DragEvent) {
  if (draggedOptionIndex.value === null) {
    return;
  }

  dragTargetOptionIndex.value = optionIndex;
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "move";
  }
}

function reorderOptions(fromIndex: number, toIndex: number) {
  const question = currentQuestion.value;
  if (
    !question ||
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= question.options.length ||
    toIndex >= question.options.length
  ) {
    return;
  }

  const nextOptions = [...question.options];
  const [movedOption] = nextOptions.splice(fromIndex, 1);
  nextOptions.splice(toIndex, 0, movedOption);
  question.options = relabelOptions(nextOptions);
  markQuestionAsDraft(currentQuestionIndex.value);
}

function dropOption(optionIndex: number, event: DragEvent) {
  const transferIndex = event.dataTransfer?.getData("text/plain");
  const parsedIndex = transferIndex ? Number(transferIndex) : Number.NaN;
  const fromIndex = draggedOptionIndex.value ?? (Number.isInteger(parsedIndex) ? parsedIndex : null);

  if (fromIndex !== null) {
    reorderOptions(fromIndex, optionIndex);
  }

  resetOptionDragState();
}

function selectQuestion(index: number) {
  currentQuestionIndex.value = index;
  validationErrors.question = undefined;
  resetOptionDragState();
}

function getQuestionValidationMessage() {
  return "Add question text, at least two answer options, and at least one correct answer before continuing.";
}

function validateCurrentQuestion() {
  const question = currentQuestion.value;
  if (!question) {
    return false;
  }

  if (!isQuestionComplete(question)) {
    validationErrors.question = getQuestionValidationMessage();
    question.status = getDraftStatus(question);
    return false;
  }

  question.status = "completed";
  validationErrors.question = undefined;
  return true;
}

function validateAllQuestions() {
  const firstIncompleteIndex = questions.value.findIndex((question) => !isQuestionComplete(question));

  if (firstIncompleteIndex >= 0) {
    questions.value[firstIncompleteIndex].status = getDraftStatus(questions.value[firstIncompleteIndex]);
    currentQuestionIndex.value = firstIncompleteIndex;
    validationErrors.question = getQuestionValidationMessage();
    return false;
  }

  questions.value = questions.value.map((question) => ({
    ...question,
    status: "completed"
  }));

  return true;
}

function createQuizDescription() {
  const description = configuration.description.trim();

  if (description) {
    return description;
  }

  if (isEditing.value && originalDescription.value.trim()) {
    return originalDescription.value.trim();
  }

  return `${configuration.subject} quiz (${configuration.difficulty} difficulty).`;
}

function toQuestionPayload(question: CreateQuizQuestion): Question {
  const populatedOptions = question.options.filter((option) => option.text.trim().length > 0);
  const firstCorrectOption = populatedOptions.find((option) => option.isCorrect);

  return {
    prompt: question.questionText.trim(),
    options: populatedOptions.map((option) => option.text.trim()),
    correctOptionIndex: Math.max(
      0,
      populatedOptions.findIndex((option) => option.id === firstCorrectOption?.id)
    ),
    explanation: question.explanation.trim()
  };
}

async function submitQuiz() {
  if (!validateAllQuestions() || isSaving.value) {
    return;
  }

  isSaving.value = true;
  try {
    const savedQuiz = await quizStore.saveQuiz({
      title: configuration.title.trim(),
      description: createQuizDescription(),
      subject: configuration.subject,
      difficulty: configuration.difficulty,
      timeLimit: configuration.timeLimitEnabled ? configuration.timeLimitMinutes : null,
      isPrivate: configuration.isPrivate,
      questions: questions.value.map(toQuestionPayload)
    }, quizId.value);
    if (savedQuiz?.accessCode) {
      activeQuizAccessCode.value = savedQuiz.accessCode;
    }

    showToast(isEditing.value ? "Quiz updated successfully" : "Quiz saved successfully");
    await router.push({ name: "quizzes" });
  } catch {
    const message = quizStore.error?.userMessage ?? "Failed to save quiz. Please try again.";
    validationErrors.question = message;
    showToast(message, "error");
  } finally {
    isSaving.value = false;
  }
}

async function saveAndNext() {
  if (isEditing.value) {
    await submitQuiz();
    return;
  }

  if (!validateCurrentQuestion()) {
    return;
  }

  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value += 1;
    return;
  }

  await submitQuiz();
}

function goBackToConfiguration() {
  currentStep.value = 1;
  validationErrors.question = undefined;
}

function handleStepSelection(step: 1 | 2) {
  if (step === 1 && currentStep.value === 2) {
    goBackToConfiguration();
  }
}

function exitFlow() {
  router.push({ name: "quizzes" });
}

function copyAccessCode() {
  if (activeQuizAccessCode.value) {
    navigator.clipboard?.writeText(activeQuizAccessCode.value);
  }
}
</script>

<template>
  <FullPageErrorState
    v-if="loadError && isEditing"
    :message="loadError.userMessage"
    :retryable="loadError.isRetryable"
    :loading="quizStore.isLoading"
    retry-label="Reload quiz"
    action-label="Back to My Quizzes"
    action-href="/quizzes"
    @retry="loadQuizForEditing(quizId!)"
  />

  <EditorFormSkeleton v-else-if="quizStore.isLoading && isEditing" />

  <section v-else class="w-full">
    <div class="mx-auto w-full max-w-[1180px] space-y-4">
      <div class="space-y-2">
        <PageHeader :title="pageTitle" :description="stepIntro" />

        <div
          class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
          :class="currentStep === 1 ? 'pt-1' : ''"
        >
          <CreateQuizStepper :current-step="currentStep" @select="handleStepSelection" />

          <button
            v-if="currentStep === 2"
            type="button"
            class="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-700"
            @click="goBackToConfiguration"
          >
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4">
              <path d="M12 5 7 10l5 5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            Back to configuration
          </button>
        </div>
      </div>

      <div v-if="currentStep === 1">
        <div class="rounded-[20px] border border-[rgba(226,223,218,0.92)] bg-white p-5 shadow-[0_10px_26px_rgba(46,35,20,0.06)]">
          <div class="space-y-4">
            <!-- Two-column layout on large screens -->
            <div class="grid gap-5 lg:grid-cols-[1fr_320px]">
              <!-- Left: Basic information -->
              <section class="space-y-3">
                <h2 class="text-base font-bold text-slate-900">Basic information</h2>

                <div class="space-y-3">
                  <label class="block space-y-1.5">
                    <span class="text-sm font-semibold text-slate-700">Quiz title</span>
                    <input
                      v-model="configuration.title"
                      type="text"
                      placeholder="e.g. Mathematics Quiz #1"
                      class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-slate-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    />
                    <p v-if="validationErrors.title" class="text-sm font-medium text-red-500">
                      {{ validationErrors.title }}
                    </p>
                  </label>

                  <label class="block space-y-1.5">
                    <div class="flex items-center justify-between gap-3">
                      <span class="text-sm font-semibold text-slate-700">Quiz description</span>
                      <span class="text-xs text-slate-400">{{ configuration.description.length }} / 500</span>
                    </div>
                    <textarea
                      v-model="configuration.description"
                      rows="2"
                      maxlength="500"
                      placeholder="Describe what learners will practice in this quiz."
                      class="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-2 text-slate-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    ></textarea>
                    <p v-if="validationErrors.description" class="text-sm font-medium text-red-500">
                      {{ validationErrors.description }}
                    </p>
                  </label>

                  <label class="block space-y-1.5">
                    <span class="text-sm font-semibold text-slate-700">Subject / Domain</span>
                    <select
                      v-model="configuration.subject"
                      class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    >
                      <option disabled value="">Select a subject</option>
                      <option v-for="subject in subjectOptions" :key="subject" :value="subject">
                        {{ subject }}
                      </option>
                    </select>
                    <p v-if="validationErrors.subject" class="text-sm font-medium text-red-500">
                      {{ validationErrors.subject }}
                    </p>
                  </label>
                </div>
              </section>

              <!-- Right: Quiz setup -->
              <section class="space-y-3 border-t border-gray-100 pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
                <h2 class="text-base font-bold text-slate-900">Quiz setup</h2>

                <div class="space-y-3">
                  <div class="space-y-1.5">
                    <div class="flex items-center justify-between gap-3">
                      <span class="text-sm font-semibold text-slate-700">Number of questions</span>
                      <span class="text-xs text-slate-400">1 – 50</span>
                    </div>
                    <div class="flex h-10 overflow-hidden rounded-xl border border-gray-200 bg-white transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
                      <button
                        type="button"
                        class="flex w-10 shrink-0 items-center justify-center border-r border-gray-200 bg-gray-50 text-lg font-semibold text-slate-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                        :disabled="configuration.numberOfQuestions <= minQuestions"
                        @click="configuration.numberOfQuestions = Math.max(minQuestions, configuration.numberOfQuestions - 1)"
                      >−</button>
                      <input
                        v-model.number="configuration.numberOfQuestions"
                        type="number"
                        :min="minQuestions"
                        :max="maxQuestions"
                        class="min-w-0 flex-1 border-0 bg-white px-2 text-center text-sm font-semibold text-slate-900 outline-none"
                      />
                      <button
                        type="button"
                        class="flex w-10 shrink-0 items-center justify-center border-l border-gray-200 bg-gray-50 text-lg font-semibold text-slate-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                        :disabled="configuration.numberOfQuestions >= maxQuestions"
                        @click="configuration.numberOfQuestions = Math.min(maxQuestions, configuration.numberOfQuestions + 1)"
                      >+</button>
                    </div>
                    <p v-if="validationErrors.numberOfQuestions" class="text-sm font-medium text-red-500">
                      {{ validationErrors.numberOfQuestions }}
                    </p>
                  </div>

                  <div class="space-y-1.5">
                    <span class="text-sm font-semibold text-slate-700">Time limit</span>
                    <div class="flex flex-col gap-2">
                      <div class="flex flex-wrap gap-x-4 gap-y-2">
                        <label class="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
                          <input
                            type="radio"
                            name="time-limit-mode"
                            class="sr-only"
                            :checked="!configuration.timeLimitEnabled"
                            @change="setUnlimitedTimeLimit"
                          />
                          <span
                            class="inline-flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border"
                            :class="
                              !configuration.timeLimitEnabled
                                ? 'border-emerald-600 bg-emerald-600 text-white'
                                : 'border-gray-300 bg-white text-transparent'
                            "
                          >
                            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5" class="h-2.5 w-2.5">
                              <path d="m4 10 3 3 9-9" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                          </span>
                          <span>Unlimited</span>
                        </label>

                        <label class="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
                          <input
                            type="radio"
                            name="time-limit-mode"
                            class="sr-only"
                            :checked="configuration.timeLimitEnabled"
                            @change="setTimedTimeLimit"
                          />
                          <span
                            class="inline-flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border"
                            :class="
                              configuration.timeLimitEnabled
                                ? 'border-emerald-600 bg-emerald-600 text-white'
                                : 'border-gray-300 bg-white text-transparent'
                            "
                          >
                            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5" class="h-2.5 w-2.5">
                              <path d="m4 10 3 3 9-9" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                          </span>
                          <span>Set time limit</span>
                        </label>
                      </div>

                      <div class="space-y-1">
                        <label
                          class="flex h-10 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100"
                          :class="!configuration.timeLimitEnabled ? 'pointer-events-none opacity-50' : ''"
                        >
                          <span class="sr-only">Time limit minutes</span>
                          <input
                            v-model.number="configuration.timeLimitMinutes"
                            type="number"
                            min="1"
                            :max="maxTimeLimitMinutes"
                            :placeholder="String(defaultTimeLimitMinutes)"
                            class="min-w-0 flex-1 border-0 bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-gray-400"
                            @click="setTimedTimeLimit"
                            @focus="setTimedTimeLimit"
                          />
                          <span class="grid min-w-20 place-items-center border-l border-gray-200 bg-gray-50 px-3 text-xs font-medium text-slate-600">
                            minutes
                          </span>
                        </label>
                        <p class="text-xs text-slate-400">1 – 180 minutes</p>
                      </div>
                    </div>
                    <p v-if="validationErrors.timeLimitMinutes" class="text-sm font-medium text-red-500">
                      {{ validationErrors.timeLimitMinutes }}
                    </p>
                  </div>

                  <div class="space-y-1.5">
                    <span class="text-sm font-semibold text-slate-700">Difficulty level</span>
                    <div class="grid grid-cols-3 gap-2">
                      <button
                        v-for="difficulty in difficultyOptions"
                        :key="difficulty"
                        type="button"
                        class="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border px-3 text-sm font-semibold transition"
                        :class="
                          configuration.difficulty === difficulty
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-gray-200 bg-white text-slate-700 hover:border-emerald-200 hover:text-emerald-700'
                        "
                        @click="configuration.difficulty = difficulty"
                      >
                        <span
                          class="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border"
                          :class="
                            configuration.difficulty === difficulty
                              ? 'border-emerald-600 bg-emerald-600 text-white'
                              : 'border-gray-300 bg-white text-transparent'
                          "
                        >
                          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5" class="h-2.5 w-2.5">
                            <path d="m4 10 3 3 9-9" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                        </span>
                        <span>{{ difficulty }}</span>
                      </button>
                    </div>
                  </div>

                  <!-- Private quiz toggle -->
                  <div class="rounded-xl border border-gray-200 bg-gray-50 p-3">
                    <div class="flex items-center justify-between gap-3">
                      <div>
                        <span class="text-sm font-semibold text-slate-700">Private quiz</span>
                        <p class="text-xs text-slate-500 mt-0.5">Hidden from public list. Requires an access code.</p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        :aria-checked="configuration.isPrivate"
                        class="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition"
                        :class="configuration.isPrivate ? 'bg-amber-500' : 'bg-gray-200'"
                        @click="configuration.isPrivate = !configuration.isPrivate"
                      >
                        <span
                          class="inline-block h-4 w-4 rounded-full bg-white shadow-sm transition"
                          :class="configuration.isPrivate ? 'translate-x-6' : 'translate-x-1'"
                        ></span>
                      </button>
                    </div>

                    <!-- Fixed-height info row — always rendered so the box never shifts -->
                    <div class="mt-2 flex h-5 items-center gap-2">
                      <template v-if="configuration.isPrivate">
                        <template v-if="activeQuizAccessCode">
                          <span class="text-xs font-bold text-amber-800">Code:</span>
                          <span class="font-mono text-sm font-extrabold tracking-[0.18em] text-amber-900">{{ activeQuizAccessCode }}</span>
                          <button
                            type="button"
                            class="ml-auto text-xs font-semibold text-amber-700 underline underline-offset-2 hover:text-amber-900"
                            @click="copyAccessCode"
                          >Copy</button>
                        </template>
                        <span v-else class="text-xs text-amber-700">Code generated when you save.</span>
                      </template>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <!-- Footer row: hint + CTA -->
            <div class="flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p class="text-sm text-emerald-700">
                <span class="mr-1 inline-block rounded-lg bg-emerald-50 px-2 py-0.5 font-medium">Tip</span>
                {{ isEditing ? "Save configuration to apply changes without editing questions." : "Settings are saved automatically when you proceed." }}
              </p>
              <div class="flex items-center gap-2">
                <button
                  v-if="isEditing"
                  type="button"
                  class="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="isSaving"
                  @click="saveConfigOnly"
                >
                  <span>{{ isSaving ? "Saving..." : "Save configuration" }}</span>
                </button>
                <button
                  type="button"
                  class="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-[180px]"
                  :disabled="isSaving"
                  @click="goToQuestionsStep"
                >
                  <span>{{ isSaving ? "Saving..." : isEditing ? "Edit questions" : "Create questions" }}</span>
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4">
                    <path d="M4 10h12M11 5l5 5-5 5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else>
        <div class="items-stretch gap-4 xl:grid xl:grid-cols-[minmax(0,1.95fr)_252px]">
          <div class="rounded-[20px] border border-[rgba(226,223,218,0.92)] bg-white p-4 shadow-[0_10px_26px_rgba(46,35,20,0.06)]">
            <div v-if="currentQuestion" class="space-y-3">
              <label class="block space-y-1.5">
                <span class="text-sm font-semibold text-slate-700">Question</span>
                <textarea
                  :value="currentQuestion.questionText"
                  rows="2"
                  class="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-2 text-slate-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  placeholder="Write your question here..."
                  @input="updateQuestionText(($event.target as HTMLTextAreaElement).value)"
                ></textarea>
              </label>

              <section class="space-y-2">
                <div class="flex items-center justify-between gap-2">
                  <span class="text-sm font-semibold text-slate-700">Answer options</span>

                  <button
                    type="button"
                    class="inline-flex items-center gap-2 text-sm text-slate-500"
                    :aria-pressed="currentQuestion.multipleCorrect"
                    @click="toggleMultipleCorrect"
                  >
                    <span
                      class="relative inline-flex h-6 w-11 items-center rounded-full transition"
                      :class="currentQuestion.multipleCorrect ? 'bg-emerald-500' : 'bg-gray-200'"
                    >
                      <span
                        class="inline-block h-4 w-4 rounded-full bg-white shadow-sm transition"
                        :class="currentQuestion.multipleCorrect ? 'translate-x-6' : 'translate-x-1'"
                      ></span>
                    </span>
                    <span>Multiple correct answers</span>
                  </button>
                </div>

                <div class="space-y-2">
                  <AnswerOptionRow
                    v-for="(option, optionIndex) in currentQuestion.options"
                    :key="option.id"
                    :option="option"
                    :can-delete="currentQuestion.options.length > minimumOptionCount"
                    :is-dragging="draggedOptionIndex === optionIndex"
                    :is-drag-target="dragTargetOptionIndex === optionIndex && draggedOptionIndex !== optionIndex"
                    :allow-multiple="currentQuestion.multipleCorrect"
                    @update-text="updateOptionText(optionIndex, $event)"
                    @toggle-correct="toggleCorrectOption(optionIndex)"
                    @delete="deleteOption(optionIndex)"
                    @drag-start="beginOptionDrag(optionIndex, $event)"
                    @drag-enter="enterOptionDropTarget(optionIndex)"
                    @drag-over="updateOptionDragOver(optionIndex, $event)"
                    @drop="dropOption(optionIndex, $event)"
                    @drag-end="resetOptionDragState"
                  />
                </div>

                <button
                  type="button"
                  class="flex w-full items-center justify-center rounded-xl border border-dashed border-gray-300 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
                  :disabled="currentQuestion.options.length >= maxOptions"
                  @click="addOption"
                >
                  + Add option
                </button>
              </section>

              <label class="block space-y-1.5">
                <span class="text-sm font-semibold text-slate-700">Explanation <span class="font-normal text-slate-400">(optional)</span></span>
                <textarea
                  :value="currentQuestion.explanation"
                  rows="1"
                  class="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-2 text-slate-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  placeholder="Explain why the correct answer is right..."
                  @input="updateExplanation(($event.target as HTMLTextAreaElement).value)"
                ></textarea>
              </label>

              <p
                v-if="validationErrors.question"
                class="rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-sm font-medium text-red-600"
              >
                {{ validationErrors.question }}
              </p>
            </div>
          </div>

          <div class="mt-4 flex h-full flex-col gap-3 xl:mt-0">
            <QuestionNavigator
              :questions="questions"
              :current-question-index="currentQuestionIndex"
              class="flex-1"
              @select="selectQuestion"
            />

            <button
              type="button"
              class="inline-flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
              :disabled="isSaving"
              :class="{ 'cursor-not-allowed opacity-75': isSaving }"
              @click="saveAndNext"
            >
              <span>{{
                isSaving ? "Saving..." :
                isEditing ? "Update quiz" :
                currentQuestionIndex < questions.length - 1 ? "Next question" :
                "Save quiz"
              }}</span>
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4">
                <path d="M4 10h12M11 5l5 5-5 5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
