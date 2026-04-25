<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Question } from "@quiz-app/shared";
import QuizQuestionEditor from "../components/editor/QuizQuestionEditor.vue";
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

const form = reactive<QuizFormState>({
  title: "",
  description: "",
  questions: [
    {
      prompt: "",
      options: ["", ""],
      correctOptionIndex: 0
    }
  ]
});

const quizId = computed(() => route.params.id?.toString());
const isEditing = computed(() => Boolean(quizId.value));

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
  form.questions = [createEmptyQuestion()];
}

watch(
  quizId,
  async (id) => {
    if (!id) {
      quizStore.activeQuiz = null;
      resetForm();
      return;
    }

    await quizStore.loadQuiz(id);
    populateForm();
  },
  { immediate: true }
);

watch(
  () => quizStore.error,
  (error) => {
    if (error && !quizId.value) {
      resetForm();
    }
  }
);

function addQuestion() {
  form.questions.push(createEmptyQuestion());
}

function removeQuestion(index: number) {
  if (form.questions.length === 1) {
    return;
  }

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
  isSaving.value = true;
  try {
    const savedQuiz = await quizStore.saveQuiz(
      {
        title: form.title,
        description: form.description,
        questions: form.questions
      },
      quizId.value
    );

    await router.push(`/editor/${savedQuiz.id}`);
  } finally {
    isSaving.value = false;
  }
}
</script>

<template>
  <section class="card stack">
    <div>
      <p class="eyebrow">Quiz Editor</p>
      <h1 class="section-title">
        {{ isEditing ? "Refine your quiz draft" : "Create a new quiz" }}
      </h1>
    </div>

    <p v-if="quizStore.error" class="error">{{ quizStore.error }}</p>

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
          <h3 style="margin: 0;">Questions</h3>
          <button class="secondary" type="button" @click="addQuestion">Add question</button>
        </div>

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

      <div class="actions">
        <button class="primary" type="submit" :disabled="isSaving">
          {{ isSaving ? "Saving..." : isEditing ? "Update quiz" : "Create quiz" }}
        </button>
        <RouterLink class="secondary" to="/quizzes">Back to list</RouterLink>
      </div>
    </form>
  </section>
</template>
