<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Question } from "@quiz-app/shared";
import QuizQuestionEditor from "../components/editor/QuizQuestionEditor.vue";
import EditorEmptyQuestions from "../components/editor/EditorEmptyQuestions.vue";
import FullPageErrorState from "../components/feedback/FullPageErrorState.vue";
import ActionErrorMessage from "../components/feedback/ActionErrorMessage.vue";
import EditorFormSkeleton from "../components/loading/EditorFormSkeleton.vue";
import LoadingButton from "../components/LoadingButton.vue";
import { useQuizStore } from "../stores/quizzes";

interface QuizFormState {
  title: string;
  description: string;
  questions: Question[];
}

const route = useRoute();
const router = useRouter();
const quizStore = useQuizStore();
const isSaving = ref(false);
const saveError = ref<string | null>(null);

// New quizzes start with an empty question list so UX-6 (EditorEmptyQuestions)
// is shown immediately, guiding the user to add their first question explicitly.
// Existing quizzes are populated from the API via populateForm().
const form = reactive<QuizFormState>({
  title: "",
  description: "",
  questions: []
});

const quizId = computed(() => route.params.id?.toString());
const isEditing = computed(() => Boolean(quizId.value));

// True when the store error is a blocking load failure (not recoverable inline)
const loadError = computed(() =>
  quizStore.error && !quizStore.isLoading ? quizStore.error : null
);

function createEmptyQuestion(): Question {
  return {
    prompt: "",
    options: ["", ""],
    correctOptionIndex: 0
  };
}

function populateForm() {
  if (!quizStore.activeQuiz) {
    return;
  }

  form.title = quizStore.activeQuiz.title;
  form.description = quizStore.activeQuiz.description;
  form.questions = quizStore.activeQuiz.questions.map((question) => ({
    ...question,
    options: [...question.options]
  }));
}

function resetForm() {
  form.title = "";
  form.description = "";
  // Start fresh with no questions so the EditorEmptyQuestions state appears.
  form.questions = [];
}

async function loadQuiz(id: string) {
  try {
    await quizStore.loadQuiz(id);
    populateForm();
  } catch {
    // error is stored in quizStore.error; loadError computed picks it up
  }
}

watch(
  quizId,
  async (id) => {
    saveError.value = null;
    if (!id) {
      quizStore.activeQuiz = null;
      quizStore.error = null;
      resetForm();
      return;
    }
    await loadQuiz(id);
  },
  { immediate: true }
);

function addQuestion() {
  form.questions.push(createEmptyQuestion());
}

function removeQuestion(index: number) {
  // Allow removing down to 0 — EditorEmptyQuestions will show instead.
  form.questions.splice(index, 1);
}

function updateQuestion(index: number, question: Question) {
  form.questions.splice(index, 1, question);
}

function addOption(index: number) {
  form.questions[index].options.push("");
}

function removeOption(questionIndex: number, optionIndex: number) {
  const question = form.questions[questionIndex];
  if (question.options.length <= 2) {
    return;
  }

  question.options.splice(optionIndex, 1);
  if (question.correctOptionIndex >= question.options.length) {
    question.correctOptionIndex = question.options.length - 1;
  }
}

async function submitQuiz() {
  // Client-side guard: a quiz with no questions cannot be saved.
  if (form.questions.length === 0) {
    saveError.value = "Add at least one question before saving your quiz.";
    return;
  }

  isSaving.value = true;
  saveError.value = null;
  try {
    const savedQuiz = await quizStore.saveQuiz(
      {
        title: form.title,
        description: form.description,
        questions: form.questions
      },
      quizId.value
    );

    await router.push({ name: "edit-quiz", params: { id: savedQuiz.id } });
  } catch (error) {
    // quizStore.error already holds the AppError; mirror userMessage locally
    // so this view's save error is independent of the store's load error.
    const appError = quizStore.error;
    saveError.value = appError?.userMessage ?? "We couldn't save your quiz. Please try again.";
  } finally {
    isSaving.value = false;
  }
}

async function retrySave() {
  await submitQuiz();
}
</script>

<template>
  <!-- Blocking load error: quiz could not be fetched at all -->
  <FullPageErrorState
    v-if="loadError && isEditing"
    :message="loadError.userMessage"
    :retryable="loadError.isRetryable"
    :loading="quizStore.isLoading"
    retry-label="Reload quiz"
    action-label="Back to My Quizzes"
    action-href="/quizzes"
    @retry="loadQuiz(quizId!)"
  />

  <!-- Skeleton during initial quiz fetch -->
  <EditorFormSkeleton v-else-if="quizStore.isLoading && isEditing" />

  <section v-else class="card stack" :aria-busy="isSaving">
    <div>
      <p class="eyebrow">Quiz Editor</p>
      <h1 class="section-title">
        {{ isEditing ? "Refine your quiz draft" : "Create a new quiz" }}
      </h1>
    </div>

    <form class="stack" @submit.prevent="submitQuiz">
      <label class="field">
        <span>Title</span>
        <input v-model="form.title" name="title" required placeholder="Frontend fundamentals" />
      </label>

      <label class="field">
        <span>Description</span>
        <textarea
          v-model="form.description"
          name="description"
          required
          rows="3"
          placeholder="A practical quiz for onboarding new developers."
        />
      </label>

      <section class="stack">
        <div class="actions" style="justify-content: space-between; align-items: center;">
          <h3 style="margin: 0;">
            Questions
            <span v-if="form.questions.length" style="font-size: 0.82rem; font-weight: 600; color: #8a93a3; margin-left: 8px;">
              {{ form.questions.length }}
            </span>
          </h3>
          <!-- Only show the "Add question" button when there's already at least one.
               When zero, the EditorEmptyQuestions CTA is the primary entry point. -->
          <button
            v-if="form.questions.length > 0"
            class="secondary"
            type="button"
            @click="addQuestion"
          >
            Add question
          </button>
        </div>

        <!-- UX-6: no questions yet — inline empty state with guided CTA -->
        <EditorEmptyQuestions
          v-if="form.questions.length === 0"
          @add-question="addQuestion"
        />

        <QuizQuestionEditor
          v-for="(question, questionIndex) in form.questions"
          :key="questionIndex"
          :model-value="question"
          :question-index="questionIndex"
          :can-remove="form.questions.length > 1"
          @update:model-value="updateQuestion(questionIndex, $event)"
          @add-option="addOption(questionIndex)"
          @remove-option="removeOption(questionIndex, $event)"
          @remove-question="removeQuestion(questionIndex)"
        />
      </section>

      <!-- Save action error (non-blocking) -->
      <ActionErrorMessage
        v-if="saveError"
        :message="saveError"
        :retryable="quizStore.error?.isRetryable ?? false"
        :loading="isSaving"
        retry-label="Save again"
        @retry="retrySave"
      />

      <div class="actions">
        <LoadingButton
          type="submit"
          variant="primary"
          :loading="isSaving"
          :loading-label="isEditing ? 'Updating…' : 'Creating…'"
        >
          {{ isEditing ? "Update quiz" : "Create quiz" }}
        </LoadingButton>
        <RouterLink class="secondary" :to="{ name: 'quizzes' }">Back to list</RouterLink>
      </div>
    </form>
  </section>
</template>
