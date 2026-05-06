<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Question, Quiz } from "@quiz-app/shared";
import { QuizStatus } from "@quiz-app/shared";
import AnswerOptionRow from "../../components/create-quiz/AnswerOptionRow.vue";
import CreateQuizStepper from "../../components/create-quiz/CreateQuizStepper.vue";
import QuestionNavigator from "../../components/create-quiz/QuestionNavigator.vue";
import FullPageErrorState from "../../components/feedback/FullPageErrorState.vue";
import EditorFormSkeleton from "../../components/loading/EditorFormSkeleton.vue";
import PageHeader from "../../components/PageHeader.vue";
import QuizEditorCard from "../../components/QuizEditorCard.vue";
import { useToast } from "../../composables/useToast";
import { useI18n } from "../../i18n";
import { useConfigurationStore } from "../../stores/configuration";
import { useQuizStore } from "../../stores/quizzes";
import type {
  CreateQuizQuestion,
  DifficultyLevel,
  QuestionOption,
  QuestionStatus
} from "../../components/create-quiz/types";

interface ConfigurationForm {
  title: string;
  description: string;
  subject: string;
  numberOfQuestions: number;
  difficulty: DifficultyLevel;
  timeLimitEnabled: boolean;
  timeLimitMinutes: number | null;
  isPrivate: boolean;
  allowSummary: boolean;
  allowReviewAnswers: boolean;
  allowRetake: boolean;
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
const { t } = useI18n();

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
const importFileInputRef = ref<HTMLInputElement | null>(null);
const originalDescription = ref("");
const validationErrors = reactive<ValidationErrors>({});

const configuration = reactive<ConfigurationForm>({
  title: t("createQuiz.defaults.title"),
  description: "",
  subject: configurationStore.primarySubjectDomain,
  numberOfQuestions: 1,
  difficulty: "Easy",
  timeLimitEnabled: false,
  timeLimitMinutes: null,
  isPrivate: false,
  allowSummary: true,
  allowReviewAnswers: true,
  allowRetake: true
});

const activeQuizAccessCode = ref<string | undefined>(undefined);
const accessCodeCopied = ref(false);
const skipNextLoad = ref(false);

const CONFIG_DRAFT_KEY = "quiz-create-config-draft";

const questions = ref<CreateQuizQuestion[]>([]);

const quizId = computed(() => route.params.id?.toString());
const isEditing = computed(() => Boolean(quizId.value));
const isPublished = computed(() => quizStore.activeQuiz?.status === QuizStatus.PUBLISHED);
const isReadOnly = computed(() => isEditing.value && isPublished.value);
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
const pageTitle = computed(() => {
  if (isReadOnly.value) return t("createQuiz.titles.view");
  return isEditing.value ? t("createQuiz.titles.edit") : t("createQuiz.titles.create");
});
const stepIntro = computed(() => {
  if (isReadOnly.value) {
    return currentStep.value === 1
      ? t("createQuiz.intros.readOnlyConfiguration")
      : t("createQuiz.intros.readOnlyQuestions");
  }
  if (currentStep.value === 1) {
    return isEditing.value
      ? t("createQuiz.intros.editConfiguration")
      : t("createQuiz.intros.createConfiguration");
  }
  return isEditing.value
    ? t("createQuiz.intros.editQuestions")
    : t("createQuiz.intros.createQuestions");
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
  configuration.title = t("createQuiz.defaults.title");
  configuration.description = "";
  configuration.subject = configurationStore.primarySubjectDomain;
  configuration.numberOfQuestions = 1;
  configuration.difficulty = "Easy";
  configuration.timeLimitEnabled = false;
  configuration.timeLimitMinutes = null;
  configuration.isPrivate = false;
  configuration.allowSummary = true;
  configuration.allowReviewAnswers = true;
  configuration.allowRetake = true;
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
  validationErrors.title = configuration.title.trim()
    ? undefined
    : t("createQuiz.validation.titleRequired");
  validationErrors.description =
    configuration.description.length <= 500
      ? undefined
      : t("createQuiz.validation.descriptionMax");
  validationErrors.subject = configuration.subject
    ? undefined
    : t("createQuiz.validation.subjectRequired");

  if (
    Number.isNaN(configuration.numberOfQuestions) ||
    configuration.numberOfQuestions < minQuestions ||
    configuration.numberOfQuestions > maxQuestions
  ) {
    validationErrors.numberOfQuestions = t("createQuiz.validation.questionCountRange");
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
        : t("createQuiz.validation.timeLimitRange");
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
  configuration.allowSummary = quiz.allowSummary ?? true;
  configuration.allowReviewAnswers = quiz.allowReviewAnswers ?? true;
  configuration.allowRetake = quiz.allowRetake ?? true;
  activeQuizAccessCode.value = quiz.accessCode;
  originalDescription.value = quiz.description;
  questions.value = quiz.questions.length
    ? quiz.questions.map(mapQuestionToDraft)
    : [createEmptyQuestion(0)];
  currentQuestionIndex.value = 0;
  currentStep.value = quiz.status === QuizStatus.PUBLISHED ? 1 : 2;
  resetValidationErrors();
  resetOptionDragState();
}

async function loadQuizForEditing(id: string) {
  try {
    const quiz = await quizStore.loadQuiz(id);
    if (!quiz) return;
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
        accessCode: configuration.isPrivate ? activeQuizAccessCode.value : undefined,
        allowSummary: configuration.allowSummary,
        allowReviewAnswers: configuration.allowReviewAnswers,
        allowRetake: configuration.allowRetake,
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
      isPrivate: configuration.isPrivate,
      allowSummary: configuration.allowSummary,
      allowReviewAnswers: configuration.allowReviewAnswers,
      allowRetake: configuration.allowRetake
    }, quizId.value);
    if (savedQuiz?.accessCode) {
      activeQuizAccessCode.value = savedQuiz.accessCode;
    }
    showToast(t("createQuiz.toasts.configurationSaved"));
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
  return t("createQuiz.validation.questionIncomplete");
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
      allowSummary: configuration.allowSummary,
      allowReviewAnswers: configuration.allowReviewAnswers,
      allowRetake: configuration.allowRetake,
      questions: questions.value.map(toQuestionPayload)
    }, quizId.value);
    if (savedQuiz?.accessCode) {
      activeQuizAccessCode.value = savedQuiz.accessCode;
    }

    showToast(isEditing.value ? t("createQuiz.toasts.quizUpdated") : t("createQuiz.toasts.quizSaved"));
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
  } else if (step === 2 && currentStep.value === 1) {
    if (isReadOnly.value) {
      currentStep.value = 2;
    } else {
      goToQuestionsStep();
    }
  }
}

function triggerImport() {
  importFileInputRef.value?.click();
}

function applyImportedQuiz(raw: unknown) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    showToast(t("createQuiz.import.invalidFormat"), "error");
    return;
  }

  const data = raw as Record<string, unknown>;

  if (typeof data.title !== "string" || !data.title.trim()) {
    showToast(t("createQuiz.import.missingTitle"), "error");
    return;
  }

  if (!Array.isArray(data.questions) || data.questions.length === 0) {
    showToast(t("createQuiz.import.missingQuestions"), "error");
    return;
  }

  const rawQuestions = (data.questions as unknown[]).slice(0, maxQuestions);
  const parsedQuestions: CreateQuizQuestion[] = [];

  for (let i = 0; i < rawQuestions.length; i++) {
    const q = rawQuestions[i];
    if (!q || typeof q !== "object" || Array.isArray(q)) continue;

    const qObj = q as Record<string, unknown>;
    if (typeof qObj.prompt !== "string" || !qObj.prompt.trim()) continue;
    if (!Array.isArray(qObj.options) || qObj.options.length < minimumOptionCount) continue;
    if (typeof qObj.correctOptionIndex !== "number") continue;

    const optionTexts = (qObj.options as unknown[])
      .filter((o): o is string => typeof o === "string")
      .slice(0, maxOptions);

    if (optionTexts.length < minimumOptionCount) continue;

    const correctIdx = Math.max(
      0,
      Math.min(Math.floor(qObj.correctOptionIndex as number), optionTexts.length - 1)
    );

    const draft: CreateQuizQuestion = {
      id: createId(`question-${i + 1}`),
      questionText: (qObj.prompt as string).trim(),
      options: optionTexts.map((text, idx) => createOption(idx, text, idx === correctIdx)),
      multipleCorrect: false,
      explanation: typeof qObj.explanation === "string" ? qObj.explanation.trim() : "",
      status: "empty"
    };

    draft.status = isQuestionComplete(draft) ? "completed" : getDraftStatus(draft);
    parsedQuestions.push(draft);
  }

  if (parsedQuestions.length === 0) {
    showToast(t("createQuiz.import.noValidQuestions"), "error");
    return;
  }

  configuration.title = (data.title as string).trim();

  if (typeof data.description === "string") {
    configuration.description = data.description.slice(0, 500);
  }
  if (typeof data.subject === "string" && data.subject.trim()) {
    configuration.subject = data.subject.trim();
  }
  if (data.difficulty === "Easy" || data.difficulty === "Medium" || data.difficulty === "Hard") {
    configuration.difficulty = data.difficulty;
  }
  if (data.timeLimit === null || data.timeLimit === undefined) {
    configuration.timeLimitEnabled = false;
    configuration.timeLimitMinutes = null;
  } else if (
    typeof data.timeLimit === "number" &&
    data.timeLimit >= 1 &&
    data.timeLimit <= maxTimeLimitMinutes
  ) {
    configuration.timeLimitEnabled = true;
    configuration.timeLimitMinutes = data.timeLimit;
  }
  if (typeof data.isPrivate === "boolean") configuration.isPrivate = data.isPrivate;
  if (typeof data.allowSummary === "boolean") configuration.allowSummary = data.allowSummary;
  if (typeof data.allowReviewAnswers === "boolean") configuration.allowReviewAnswers = data.allowReviewAnswers;
  if (typeof data.allowRetake === "boolean") configuration.allowRetake = data.allowRetake;

  configuration.numberOfQuestions = parsedQuestions.length;
  questions.value = parsedQuestions;

  showToast(t("createQuiz.import.success", { count: parsedQuestions.length }));
}

function handleImportFile(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = "";
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target?.result as string);
      applyImportedQuiz(parsed);
    } catch {
      showToast(t("createQuiz.import.invalidJson"), "error");
    }
  };
  reader.readAsText(file);
}

function exitFlow() {
  router.push({ name: "quizzes" });
}

function copyAccessCode() {
  if (!activeQuizAccessCode.value) return;
  navigator.clipboard?.writeText(activeQuizAccessCode.value);
  accessCodeCopied.value = true;
  setTimeout(() => { accessCodeCopied.value = false; }, 2000);
}

function difficultyLabel(value: DifficultyLevel) {
  if (value === "Easy") return t("createQuiz.difficulty.easy");
  if (value === "Medium") return t("createQuiz.difficulty.medium");
  return t("createQuiz.difficulty.hard");
}

function generateAccessCode(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(3)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

function togglePrivate() {
  const next = !configuration.isPrivate;
  configuration.isPrivate = next;
  if (next) {
    activeQuizAccessCode.value = generateAccessCode();
    configuration.allowSummary = false;
    configuration.allowReviewAnswers = false;
    configuration.allowRetake = false;
  } else {
    activeQuizAccessCode.value = undefined;
    configuration.allowSummary = true;
    configuration.allowReviewAnswers = true;
    configuration.allowRetake = true;
  }
}
</script>

<template>
  <FullPageErrorState
    v-if="loadError && isEditing"
    :message="loadError.userMessage"
    :retryable="loadError.isRetryable"
    :loading="quizStore.isLoading"
    :retry-label="t('createQuiz.readOnly.reloadQuiz')"
    :action-label="t('createQuiz.readOnly.backToMyQuizzes')"
    action-href="/quizzes"
    @retry="loadQuizForEditing(quizId!)"
  />

  <EditorFormSkeleton v-else-if="quizStore.isLoading && isEditing" />

  <section v-else class="w-full">
    <div class="mx-auto w-full max-w-[1180px] space-y-4">
      <div class="space-y-2">
        <PageHeader :title="pageTitle" :description="stepIntro" />

        <div>
          <CreateQuizStepper :current-step="currentStep" :all-clickable="true" @select="handleStepSelection" />
        </div>

      </div>

      <div class="grid">
      <div class="col-start-1 row-start-1 h-full" :class="currentStep !== 1 ? 'invisible pointer-events-none' : ''">
        <QuizEditorCard>
          <!-- Two-column layout on large screens -->
          <div class="grid gap-4 lg:grid-cols-[1fr_312px]">
              <!-- Left: Basic information — flex so description fills remaining height -->
              <section class="flex flex-col gap-3">
                <h2 class="text-base font-bold text-slate-900">{{ t("createQuiz.fields.basicInformation") }}</h2>

                <div class="flex flex-1 flex-col gap-3">
                  <!-- Quiz title -->
                  <div v-if="isReadOnly" class="space-y-1">
                    <span class="text-sm font-semibold text-slate-700">{{ t("createQuiz.fields.title") }}</span>
                    <p class="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-slate-900">{{ configuration.title }}</p>
                  </div>
                  <label v-else class="block space-y-1">
                    <span class="text-sm font-semibold text-slate-700">{{ t("createQuiz.fields.title") }}</span>
                    <input
                      v-model="configuration.title"
                      type="text"
                      :placeholder="t('createQuiz.fields.titlePlaceholder')"
                      class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-slate-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    />
                    <p v-if="validationErrors.title" class="text-sm font-medium text-red-500">{{ validationErrors.title }}</p>
                  </label>

                  <!-- Quiz description — flex-1 so it fills all remaining height -->
                  <div v-if="isReadOnly" class="flex flex-1 flex-col space-y-1">
                    <span class="text-sm font-semibold text-slate-700">{{ t("createQuiz.fields.description") }}</span>
                    <p class="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-slate-500 italic">
                      {{ configuration.description || t("createQuiz.fields.noDescription") }}
                    </p>
                  </div>
                  <label v-else class="flex flex-1 flex-col gap-1">
                    <div class="flex items-center justify-between gap-3">
                      <span class="text-sm font-semibold text-slate-700">{{ t("createQuiz.fields.description") }}</span>
                      <span class="text-xs text-slate-400">{{ configuration.description.length }} / 500</span>
                    </div>
                    <textarea
                      v-model="configuration.description"
                      maxlength="500"
                      :placeholder="t('createQuiz.fields.descriptionPlaceholder')"
                      class="min-h-0 flex-1 resize-none rounded-xl border border-gray-200 bg-white px-4 py-2 text-slate-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    ></textarea>
                    <p v-if="validationErrors.description" class="text-sm font-medium text-red-500">{{ validationErrors.description }}</p>
                  </label>

                  <!-- Subject / Domain -->
                  <div v-if="isReadOnly" class="space-y-1">
                    <span class="text-sm font-semibold text-slate-700">{{ t("createQuiz.fields.subject") }}</span>
                    <p class="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-slate-900">{{ configuration.subject }}</p>
                  </div>
                  <label v-else class="block space-y-1">
                    <span class="text-sm font-semibold text-slate-700">{{ t("createQuiz.fields.subject") }}</span>
                    <select
                      v-model="configuration.subject"
                      class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    >
                      <option disabled value="">{{ t("createQuiz.fields.subjectPlaceholder") }}</option>
                      <option v-for="subject in subjectOptions" :key="subject" :value="subject">{{ subject }}</option>
                    </select>
                    <p v-if="validationErrors.subject" class="text-sm font-medium text-red-500">{{ validationErrors.subject }}</p>
                  </label>
                </div>
              </section>

              <!-- Right: Quiz setup -->
              <section class="flex flex-col gap-2 border-t border-gray-100 pt-4 lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0">
                <h2 class="text-base font-bold text-slate-900">{{ t("createQuiz.fields.setup") }}</h2>

                  <!-- Number of questions -->
                  <div v-if="isReadOnly" class="space-y-1">
                    <span class="text-sm font-semibold text-slate-700">{{ t("createQuiz.fields.numberOfQuestions") }}</span>
                    <p class="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-slate-900">{{ configuration.numberOfQuestions }}</p>
                  </div>
                  <div v-else class="space-y-1">
                    <div class="flex items-center justify-between gap-3">
                      <span class="text-sm font-semibold text-slate-700">{{ t("createQuiz.fields.numberOfQuestions") }}</span>
                      <span class="text-xs text-slate-400">1 – 50</span>
                    </div>
                    <div class="flex h-9 overflow-hidden rounded-xl border border-gray-200 bg-white transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
                      <button
                        type="button"
                        class="flex w-9 shrink-0 items-center justify-center border-r border-gray-200 bg-gray-50 text-lg font-semibold text-slate-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
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
                        class="flex w-9 shrink-0 items-center justify-center border-l border-gray-200 bg-gray-50 text-lg font-semibold text-slate-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                        :disabled="configuration.numberOfQuestions >= maxQuestions"
                        @click="configuration.numberOfQuestions = Math.min(maxQuestions, configuration.numberOfQuestions + 1)"
                      >+</button>
                    </div>
                    <p v-if="validationErrors.numberOfQuestions" class="text-sm font-medium text-red-500">
                      {{ validationErrors.numberOfQuestions }}
                    </p>
                  </div>

                  <!-- Time limit -->
                  <div v-if="isReadOnly" class="space-y-1">
                    <span class="text-sm font-semibold text-slate-700">{{ t("createQuiz.fields.timeLimit") }}</span>
                    <p class="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-slate-900">
                      {{
                        configuration.timeLimitEnabled
                          ? `${configuration.timeLimitMinutes} ${t("createQuiz.fields.minutes")}`
                          : t("createQuiz.fields.unlimited")
                      }}
                    </p>
                  </div>
                  <div v-else class="space-y-1">
                    <span class="text-sm font-semibold text-slate-700">{{ t("createQuiz.fields.timeLimit") }}</span>
                    <div class="flex flex-wrap gap-x-4 gap-y-1.5">
                      <label class="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
                        <input type="radio" name="time-limit-mode" class="sr-only" :checked="!configuration.timeLimitEnabled" @change="setUnlimitedTimeLimit" />
                        <span
                          class="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border"
                          :class="!configuration.timeLimitEnabled ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-gray-300 bg-white text-transparent'"
                        >
                          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5" class="h-2.5 w-2.5">
                            <path d="m4 10 3 3 9-9" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                        </span>
                        <span>{{ t("createQuiz.fields.unlimited") }}</span>
                      </label>
                      <label class="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
                        <input type="radio" name="time-limit-mode" class="sr-only" :checked="configuration.timeLimitEnabled" @change="setTimedTimeLimit" />
                        <span
                          class="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border"
                          :class="configuration.timeLimitEnabled ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-gray-300 bg-white text-transparent'"
                        >
                          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5" class="h-2.5 w-2.5">
                            <path d="m4 10 3 3 9-9" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                        </span>
                        <span>{{ t("createQuiz.fields.setTimeLimit") }}</span>
                      </label>
                    </div>
                    <label
                      class="flex h-9 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100"
                      :class="!configuration.timeLimitEnabled ? 'pointer-events-none opacity-50' : ''"
                    >
                      <span class="sr-only">{{ t("createQuiz.fields.timeLimitMinutes") }}</span>
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
                      <span class="grid min-w-20 place-items-center border-l border-gray-200 bg-gray-50 px-3 text-xs font-medium text-slate-600">{{ t("createQuiz.fields.minutes") }}</span>
                    </label>
                    <p v-if="validationErrors.timeLimitMinutes" class="text-sm font-medium text-red-500">
                      {{ validationErrors.timeLimitMinutes }}
                    </p>
                  </div>

                  <!-- Difficulty -->
                  <div v-if="isReadOnly" class="space-y-1">
                    <span class="text-sm font-semibold text-slate-700">{{ t("createQuiz.fields.difficulty") }}</span>
                    <p class="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-slate-900">{{ difficultyLabel(configuration.difficulty) }}</p>
                  </div>
                  <div v-else class="space-y-1">
                    <span class="text-sm font-semibold text-slate-700">{{ t("createQuiz.fields.difficulty") }}</span>
                    <div class="grid grid-cols-3 gap-1.5">
                      <button
                        v-for="difficulty in difficultyOptions"
                        :key="difficulty"
                        type="button"
                        class="inline-flex min-h-9 items-center justify-center gap-1 rounded-xl border px-2 py-1 text-xs font-semibold leading-tight transition"
                        :class="configuration.difficulty === difficulty
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 bg-white text-slate-700 hover:border-emerald-200 hover:text-emerald-700'"
                        @click="configuration.difficulty = difficulty"
                      >
                        <span
                          class="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border"
                          :class="configuration.difficulty === difficulty ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-gray-300 bg-white text-transparent'"
                        >
                          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5" class="h-2.5 w-2.5">
                            <path d="m4 10 3 3 9-9" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                        </span>
                        <span class="whitespace-nowrap text-center">{{ difficultyLabel(difficulty) }}</span>
                      </button>
                    </div>
                  </div>

                  <!-- Access & behavior — Private quiz + Participant options merged -->
                  <div class="overflow-hidden rounded-xl border border-gray-200">
                    <!-- Private quiz row -->
                    <div class="bg-gray-50 px-3 py-2.5">
                      <div class="flex items-center justify-between gap-2">
                        <div class="min-w-0">
                          <p class="text-sm font-semibold text-slate-700">{{ t("createQuiz.fields.privateQuiz") }}</p>
                          <p class="text-xs text-slate-500">{{ t("createQuiz.fields.privateHint") }}</p>
                        </div>
                        <span
                          v-if="isReadOnly"
                          class="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold"
                          :class="configuration.isPrivate ? 'bg-amber-100 text-amber-700' : 'bg-gray-200 text-slate-500'"
                        >{{ configuration.isPrivate ? t("createQuiz.states.on") : t("createQuiz.states.off") }}</span>
                        <button
                          v-else
                          type="button"
                          role="switch"
                          :aria-checked="configuration.isPrivate"
                          class="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition"
                          :class="configuration.isPrivate ? 'bg-amber-500' : 'bg-gray-200'"
                          @click="togglePrivate"
                        >
                          <span class="inline-block h-4 w-4 rounded-full bg-white shadow-sm transition" :class="configuration.isPrivate ? 'translate-x-6' : 'translate-x-1'"></span>
                        </button>
                      </div>
                      <div
                        v-if="configuration.isPrivate && activeQuizAccessCode"
                        class="mt-2 flex flex-wrap items-center gap-2 text-xs"
                      >
                        <span class="text-xs font-bold text-amber-800">{{ t("createQuiz.fields.accessCode") }}</span>
                        <span class="font-mono text-sm font-extrabold tracking-[0.18em] text-amber-900">{{ activeQuizAccessCode }}</span>
                        <button
                          type="button"
                          class="inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-semibold transition sm:ml-auto"
                          :class="accessCodeCopied
                            ? 'bg-amber-200 text-amber-900 cursor-default'
                            : 'bg-amber-100 text-amber-700 hover:bg-amber-200 hover:text-amber-900'"
                          @click="copyAccessCode"
                        >
                          <svg v-if="!accessCodeCopied" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" class="h-3 w-3">
                            <rect x="7" y="7" width="9" height="11" rx="1.5" />
                            <path d="M13 7V5a1.5 1.5 0 0 0-1.5-1.5h-6A1.5 1.5 0 0 0 4 5v9A1.5 1.5 0 0 0 5.5 15.5H7" stroke-linecap="round" />
                          </svg>
                          <svg v-else viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" class="h-3 w-3">
                            <path d="m4 10 4 4 8-8" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                          <span>{{ accessCodeCopied ? t("common.copied") : t("common.copy") }}</span>
                        </button>
                      </div>
                    </div>

                    <!-- Participant option rows -->
                    <div class="divide-y divide-gray-100 border-t border-gray-200 bg-white">
                      <!-- Show summary -->
                      <div class="flex items-center justify-between gap-3 px-3 py-2">
                        <p class="min-w-0 flex-1 text-sm font-medium text-slate-700">{{ t("createQuiz.fields.showSummary") }}</p>
                        <span
                          v-if="isReadOnly"
                          class="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold"
                          :class="configuration.allowSummary ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-slate-500'"
                        >{{ configuration.allowSummary ? t("createQuiz.states.on") : t("createQuiz.states.off") }}</span>
                        <button
                          v-else
                          type="button"
                          role="switch"
                          :aria-checked="configuration.allowSummary"
                          class="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition"
                          :class="configuration.allowSummary ? 'bg-emerald-500' : 'bg-gray-200'"
                          @click="configuration.allowSummary = !configuration.allowSummary"
                        >
                          <span class="inline-block h-4 w-4 rounded-full bg-white shadow-sm transition" :class="configuration.allowSummary ? 'translate-x-6' : 'translate-x-1'"></span>
                        </button>
                      </div>
                      <!-- Allow answer review -->
                      <div class="flex items-center justify-between gap-3 px-3 py-2">
                        <p class="min-w-0 flex-1 text-sm font-medium text-slate-700">{{ t("createQuiz.fields.allowAnswerReview") }}</p>
                        <span
                          v-if="isReadOnly"
                          class="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold"
                          :class="configuration.allowReviewAnswers ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-slate-500'"
                        >{{ configuration.allowReviewAnswers ? t("createQuiz.states.on") : t("createQuiz.states.off") }}</span>
                        <button
                          v-else
                          type="button"
                          role="switch"
                          :aria-checked="configuration.allowReviewAnswers"
                          class="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition"
                          :class="configuration.allowReviewAnswers ? 'bg-emerald-500' : 'bg-gray-200'"
                          @click="configuration.allowReviewAnswers = !configuration.allowReviewAnswers"
                        >
                          <span class="inline-block h-4 w-4 rounded-full bg-white shadow-sm transition" :class="configuration.allowReviewAnswers ? 'translate-x-6' : 'translate-x-1'"></span>
                        </button>
                      </div>
                      <!-- Allow retake -->
                      <div class="flex items-center justify-between gap-3 px-3 py-2">
                        <p class="min-w-0 flex-1 text-sm font-medium text-slate-700">{{ t("createQuiz.fields.allowRetake") }}</p>
                        <span
                          v-if="isReadOnly"
                          class="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold"
                          :class="configuration.allowRetake ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-slate-500'"
                        >{{ configuration.allowRetake ? t("createQuiz.states.on") : t("createQuiz.states.off") }}</span>
                        <button
                          v-else
                          type="button"
                          role="switch"
                          :aria-checked="configuration.allowRetake"
                          class="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition"
                          :class="configuration.allowRetake ? 'bg-emerald-500' : 'bg-gray-200'"
                          @click="configuration.allowRetake = !configuration.allowRetake"
                        >
                          <span class="inline-block h-4 w-4 rounded-full bg-white shadow-sm transition" :class="configuration.allowRetake ? 'translate-x-6' : 'translate-x-1'"></span>
                        </button>
                      </div>
                    </div>
                  </div>
              </section>
            </div>

          <template #footer>
              <!-- Read-only footer -->
              <template v-if="isReadOnly">
                <div class="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" class="h-4 w-4 shrink-0">
                    <circle cx="10" cy="10" r="8" />
                    <path d="M10 6v4M10 14h.01" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  {{ t("createQuiz.readOnly.unpublishToEdit") }}
                </div>
                <button
                  type="button"
                  class="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 md:w-auto md:min-w-[180px]"
                  @click="currentStep = 2"
                >
                  <span>{{ t("createQuiz.readOnly.viewQuestions") }}</span>
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4">
                    <path d="M4 10h12M11 5l5 5-5 5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>
              </template>
              <!-- Editable footer -->
              <template v-else>
                <p class="text-sm text-emerald-700">
                  <span class="mr-1 inline-block rounded-lg bg-emerald-50 px-2 py-0.5 font-medium">{{ t("createQuiz.helper.tip") }}</span>
                  {{ isEditing ? t("createQuiz.helper.editTip") : t("createQuiz.helper.createTip") }}
                </p>
                <div class="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
                  <!-- Import JSON (new quiz only) -->
                  <template v-if="!isEditing">
                    <input
                      ref="importFileInputRef"
                      type="file"
                      accept=".json"
                      class="sr-only"
                      @change="handleImportFile"
                    />
                    <button
                      type="button"
                      class="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700 sm:w-auto"
                      @click="triggerImport"
                    >
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" class="h-4 w-4">
                        <path d="M10 3v10M6 9l4 4 4-4" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M3 15h14" stroke-linecap="round" />
                      </svg>
                      <span>{{ t("createQuiz.actions.importJson") }}</span>
                    </button>
                  </template>
                  <button
                    v-if="isEditing"
                    type="button"
                    class="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    :disabled="isSaving"
                    @click="saveConfigOnly"
                  >
                    <span>{{ isSaving ? t("createQuiz.actions.saving") : t("createQuiz.actions.saveConfiguration") }}</span>
                  </button>
                  <button
                    type="button"
                    class="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[180px]"
                    :disabled="isSaving"
                    @click="goToQuestionsStep"
                  >
                    <span>{{ isSaving ? t("createQuiz.actions.saving") : t("createQuiz.actions.saveContinue") }}</span>
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4">
                      <path d="M4 10h12M11 5l5 5-5 5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>
                </div>
              </template>
          </template>
        </QuizEditorCard>
      </div>

      <div class="col-start-1 row-start-1 h-full" :class="currentStep !== 2 ? 'invisible pointer-events-none' : ''">
        <QuizEditorCard>
          <div class="grid gap-4 lg:grid-cols-[1fr_312px]">

            <!-- Left: Question editor -->
            <section v-if="currentQuestion" class="flex flex-col gap-3">
              <h2 class="text-base font-bold text-slate-900">{{ t("createQuiz.fields.question") }}</h2>

              <!-- Question text -->
              <div v-if="isReadOnly" class="space-y-1.5">
                <p class="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-slate-900">{{ currentQuestion.questionText }}</p>
              </div>
              <label v-else class="block space-y-1.5">
                <textarea
                  :value="currentQuestion.questionText"
                  rows="3"
                  class="w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-2 text-slate-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  :placeholder="t('createQuiz.fields.questionPlaceholder')"
                  @input="updateQuestionText(($event.target as HTMLTextAreaElement).value)"
                ></textarea>
              </label>

              <section class="space-y-2">
                <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span class="text-sm font-semibold text-slate-700">{{ t("createQuiz.fields.answerOptions") }}</span>

                  <!-- Read-only: multiple correct indicator -->
                  <span v-if="isReadOnly && currentQuestion.multipleCorrect" class="text-xs text-slate-500">{{ t("createQuiz.fields.multipleCorrectAnswers") }}</span>

                  <!-- Editable: multiple correct toggle -->
                  <button
                    v-else-if="!isReadOnly"
                    type="button"
                    class="inline-flex items-center gap-2 self-start text-sm text-slate-500"
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
                    <span>{{ t("createQuiz.fields.multipleCorrectAnswers") }}</span>
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
                    :readonly="isReadOnly"
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
                  v-if="!isReadOnly"
                  type="button"
                  class="flex w-full items-center justify-center rounded-xl border border-dashed border-gray-300 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
                  :disabled="currentQuestion.options.length >= maxOptions"
                  @click="addOption"
                >
                  + {{ t("createQuiz.fields.addOption") }}
                </button>
              </section>

              <!-- Explanation -->
              <div v-if="isReadOnly" class="space-y-1.5">
                <span class="text-sm font-semibold text-slate-700">{{ t("createQuiz.fields.explanation") }}</span>
                <p
                  class="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm"
                  :class="currentQuestion.explanation ? 'text-slate-900' : 'italic text-slate-400'"
                >{{ currentQuestion.explanation || t("createQuiz.fields.noExplanation") }}</p>
              </div>
              <label v-else class="block space-y-1.5">
                <span class="text-sm font-semibold text-slate-700">{{ t("createQuiz.fields.explanation") }} <span class="font-normal text-slate-400">{{ t("createQuiz.fields.explanationOptional") }}</span></span>
                <textarea
                  :value="currentQuestion.explanation"
                  rows="2"
                  class="w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-2 text-slate-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  :placeholder="t('createQuiz.fields.explanationPlaceholder')"
                  @input="updateExplanation(($event.target as HTMLTextAreaElement).value)"
                ></textarea>
              </label>

              <p
                v-if="!isReadOnly && validationErrors.question"
                class="rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-sm font-medium text-red-600"
              >
                {{ validationErrors.question }}
              </p>
            </section>

            <!-- Right: Question navigator -->
            <section class="flex flex-col gap-3 border-t border-gray-100 pt-4 lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0">
              <h2 class="text-base font-bold text-slate-900">{{ t("createQuiz.fields.questions") }}</h2>
              <QuestionNavigator
                :questions="questions"
                :current-question-index="currentQuestionIndex"
                class="flex-1"
                @select="selectQuestion"
              />
              <button
                v-if="!isReadOnly"
                type="button"
                class="inline-flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
                :disabled="isSaving"
                :class="{ 'cursor-not-allowed opacity-75': isSaving }"
                @click="saveAndNext"
              >
                <span>{{
                  isSaving ? t("createQuiz.actions.saving") :
                  currentQuestionIndex < questions.length - 1 ? t("createQuiz.actions.nextQuestion") :
                  isEditing ? t("createQuiz.actions.updateQuiz") :
                  t("createQuiz.actions.saveQuiz")
                }}</span>
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4">
                  <path d="M4 10h12M11 5l5 5-5 5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </section>

          </div>
        </QuizEditorCard>
      </div>
      </div>
    </div>
  </section>
</template>
