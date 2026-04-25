<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import AnswerOptionRow from "../components/create-quiz/AnswerOptionRow.vue";
import CreateQuizStepper from "../components/create-quiz/CreateQuizStepper.vue";
import QuestionNavigator from "../components/create-quiz/QuestionNavigator.vue";
import type {
  CreateQuizQuestion,
  DifficultyLevel,
  QuestionOption,
  QuestionStatus
} from "../components/create-quiz/types";

interface ConfigurationForm {
  title: string;
  subject: string;
  numberOfQuestions: number;
  difficulty: DifficultyLevel;
}

interface ValidationErrors {
  title?: string;
  subject?: string;
  numberOfQuestions?: string;
  question?: string;
}

const router = useRouter();

const subjectOptions = [
  "Mathematics",
  "Science",
  "History",
  "Geography",
  "English",
  "Programming"
];

const difficultyOptions: DifficultyLevel[] = ["Easy", "Medium", "Hard"];
const maxQuestions = 50;
const minQuestions = 1;
const maxOptions = 6;
const minimumOptionCount = 2;
const defaultOptionCount = 4;
const optionLabels = ["A", "B", "C", "D", "E", "F"];

const currentStep = ref<1 | 2>(1);
const currentQuestionIndex = ref(0);
const draggedOptionIndex = ref<number | null>(null);
const dragTargetOptionIndex = ref<number | null>(null);
const validationErrors = reactive<ValidationErrors>({});

const configuration = reactive<ConfigurationForm>({
  title: "Quiz 1",
  subject: "Science",
  numberOfQuestions: 1,
  difficulty: "Easy"
});

const questions = ref<CreateQuizQuestion[]>([]);

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);
const completedQuestions = computed(
  () => questions.value.filter((question) => question.status === "completed").length
);
const progressPercent = computed(() =>
  questions.value.length ? Math.round((completedQuestions.value / questions.value.length) * 100) : 0
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
  const correctAnswers = question.options.filter((option) => option.isCorrect);

  return (
    question.questionText.trim().length > 0 &&
    populatedOptions.length >= minimumOptionCount &&
    correctAnswers.length >= 1
  );
}

function validateConfiguration() {
  validationErrors.title = configuration.title.trim() ? undefined : "Quiz title is required.";
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

  return !validationErrors.title && !validationErrors.subject && !validationErrors.numberOfQuestions;
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

function goToQuestionsStep() {
  if (!validateConfiguration()) {
    return;
  }

  syncQuestionPlaceholders();
  currentQuestionIndex.value = 0;
  currentStep.value = 2;
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

function saveAndNext() {
  const question = currentQuestion.value;
  if (!question) {
    return;
  }

  if (!isQuestionComplete(question)) {
    validationErrors.question =
      "Add question text, at least two answer options, and at least one correct answer before continuing.";
    question.status = getDraftStatus(question);
    return;
  }

  question.status = "completed";
  validationErrors.question = undefined;

  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value += 1;
  }
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
  router.push({ name: "home" });
}
</script>

<template>
  <section class="w-full">
    <div class="mx-auto w-full max-w-[1180px] space-y-5">
      <div class="space-y-3">
        <div class="space-y-2">
          <h1 class="text-3xl font-extrabold text-slate-900 sm:text-4xl">Create new quiz</h1>
          <p class="max-w-2xl text-sm text-slate-500 sm:text-base">
            {{
              currentStep === 1
                ? "Set up the basic details for your quiz before adding questions."
                : "Write and organize your questions before saving the quiz."
            }}
          </p>
        </div>

        <div
          class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
          :class="currentStep === 1 ? 'pt-2' : ''"
        >
          <CreateQuizStepper :current-step="currentStep" @select="handleStepSelection" />

          <div
            v-if="currentStep === 2"
            class="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:w-auto"
          >
            <div class="w-full max-w-xs space-y-1.5">
              <p class="text-right text-sm font-medium text-slate-500">
                {{ completedQuestions }} / {{ questions.length }} questions completed
              </p>
              <div class="h-2 overflow-hidden rounded-full bg-gray-200">
                <div
                  class="h-full rounded-full bg-emerald-500 transition-all"
                  :style="{ width: `${progressPercent}%` }"
                ></div>
              </div>
            </div>

            <button
              type="button"
              class="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
              @click="exitFlow"
            >
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" class="h-4 w-4">
                <path d="M8 5 3 10l5 5M3 10h9M12 4h4a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-4" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span>Exit</span>
            </button>
          </div>
        </div>
      </div>

      <div v-if="currentStep === 1">
        <div class="rounded-[20px] border border-[rgba(226,223,218,0.92)] bg-white p-5 shadow-[0_10px_26px_rgba(46,35,20,0.06)]">
          <div class="space-y-5">
            <section class="space-y-3">
              <div class="space-y-1">
                <h2 class="text-xl font-bold text-slate-900">Basic information</h2>
              </div>

              <div class="space-y-3">
                <label class="block space-y-2">
                  <span class="text-sm font-semibold text-slate-700">Quiz title</span>
                  <input
                    v-model="configuration.title"
                    type="text"
                    placeholder="e.g. Mathematics Quiz #1"
                    class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-slate-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                  <p v-if="validationErrors.title" class="text-sm font-medium text-red-500">
                    {{ validationErrors.title }}
                  </p>
                </label>

                <label class="block space-y-2">
                  <span class="text-sm font-semibold text-slate-700">Subject / Domain</span>
                  <select
                    v-model="configuration.subject"
                    class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
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

            <section class="space-y-3 border-t border-gray-100 pt-5">
              <div class="space-y-1">
                <h2 class="text-xl font-bold text-slate-900">Quiz setup</h2>
              </div>

              <div class="space-y-3">
                <label class="block space-y-2">
                  <div class="flex items-center justify-between gap-3">
                    <span class="text-sm font-semibold text-slate-700">Number of questions</span>
                    <span class="text-sm text-slate-400">1 - 50</span>
                  </div>
                  <input
                    v-model.number="configuration.numberOfQuestions"
                    type="number"
                    :min="minQuestions"
                    :max="maxQuestions"
                    class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 sm:max-w-[14rem]"
                  />
                  <p v-if="validationErrors.numberOfQuestions" class="text-sm font-medium text-red-500">
                    {{ validationErrors.numberOfQuestions }}
                  </p>
                </label>

                <div class="space-y-2">
                  <span class="text-sm font-semibold text-slate-700">Difficulty level</span>
                  <div class="grid gap-3 sm:grid-cols-3">
                    <button
                      v-for="difficulty in difficultyOptions"
                      :key="difficulty"
                      type="button"
                      class="inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition"
                      :class="
                        configuration.difficulty === difficulty
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 bg-white text-slate-700 hover:border-emerald-200 hover:text-emerald-700'
                      "
                      @click="configuration.difficulty = difficulty"
                    >
                      <span
                        class="inline-flex h-5 w-5 items-center justify-center rounded-full border"
                        :class="
                          configuration.difficulty === difficulty
                            ? 'border-emerald-600 bg-emerald-600 text-white'
                            : 'border-gray-300 bg-white text-transparent'
                        "
                      >
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" class="h-3 w-3">
                          <path d="m4 10 3 3 9-9" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      </span>
                      <span>{{ difficulty }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <div class="rounded-xl bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800">
              You can change these settings later.
            </div>

            <button
              type="button"
              class="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 text-base font-bold text-white shadow-sm transition hover:bg-emerald-700"
              @click="goToQuestionsStep"
            >
              <span>Create questions</span>
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4">
                <path d="M4 10h12M11 5l5 5-5 5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div v-else class="space-y-4">
        <div class="items-stretch gap-5 xl:grid xl:grid-cols-[minmax(0,1.95fr)_260px]">
          <div class="rounded-[20px] border border-[rgba(226,223,218,0.92)] bg-white p-5 shadow-[0_10px_26px_rgba(46,35,20,0.06)]">
            <div v-if="currentQuestion" class="space-y-4">
              <label class="block space-y-2">
                <span class="text-sm font-semibold text-slate-700">Question</span>
                <textarea
                  :value="currentQuestion.questionText"
                  rows="3"
                  class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-slate-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  placeholder="Write your question here..."
                  @input="updateQuestionText(($event.target as HTMLTextAreaElement).value)"
                ></textarea>
              </label>

              <section class="space-y-3">
                <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span class="text-sm font-semibold text-slate-700">Answer options</span>

                  <button
                    type="button"
                    class="inline-flex items-center gap-3 text-sm text-slate-500"
                    :aria-pressed="currentQuestion.multipleCorrect"
                    @click="toggleMultipleCorrect"
                  >
                    <span
                      class="relative inline-flex h-7 w-12 items-center rounded-full transition"
                      :class="currentQuestion.multipleCorrect ? 'bg-emerald-500' : 'bg-gray-200'"
                    >
                      <span
                        class="inline-block h-5 w-5 rounded-full bg-white shadow-sm transition"
                        :class="currentQuestion.multipleCorrect ? 'translate-x-6' : 'translate-x-1'"
                      ></span>
                    </span>
                    <span>Multiple correct answers</span>
                  </button>
                </div>

                <div class="space-y-2.5">
                  <AnswerOptionRow
                    v-for="(option, optionIndex) in currentQuestion.options"
                    :key="option.id"
                    :option="option"
                    :can-delete="currentQuestion.options.length > minimumOptionCount"
                    :is-dragging="draggedOptionIndex === optionIndex"
                    :is-drag-target="dragTargetOptionIndex === optionIndex && draggedOptionIndex !== optionIndex"
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
                  class="flex w-full items-center justify-center rounded-xl border border-dashed border-gray-300 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
                  :disabled="currentQuestion.options.length >= maxOptions"
                  @click="addOption"
                >
                  + Add option
                </button>
              </section>

              <label class="block space-y-2">
                <span class="text-sm font-semibold text-slate-700">Explanation <span class="font-normal text-slate-400">(optional)</span></span>
                <textarea
                  :value="currentQuestion.explanation"
                  rows="2"
                  class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-slate-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  placeholder="Explain why the correct answer is right..."
                  @input="updateExplanation(($event.target as HTMLTextAreaElement).value)"
                ></textarea>
              </label>

              <div class="min-h-[4.5rem]">
                <p
                  v-if="validationErrors.question"
                  class="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                >
                  {{ validationErrors.question }}
                </p>
              </div>
            </div>
          </div>

          <div class="mt-5 flex h-full flex-col gap-5 xl:mt-0">
            <QuestionNavigator
              :questions="questions"
              :current-question-index="currentQuestionIndex"
              class="flex-1"
              @select="selectQuestion"
            />

            <button
              type="button"
              class="inline-flex h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
              @click="saveAndNext"
            >
              <span>Save</span>
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
