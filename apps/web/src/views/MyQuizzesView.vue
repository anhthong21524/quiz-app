<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { QuizStatus } from "@quiz-app/shared";
import { useQuizStore } from "../stores/quizzes";

const router = useRouter();
const quizStore = useQuizStore();

onMounted(async () => {
  await quizStore.loadQuizzes();
});

async function togglePublish(id: string, status: QuizStatus) {
  await quizStore.setQuizPublished(id, status !== QuizStatus.PUBLISHED);
}
</script>

<template>
  <section class="card stack">
    <div class="actions" style="justify-content: space-between; align-items: center;">
      <div>
        <p class="eyebrow">My Quizzes</p>
        <h2 class="section-title">Manage every quiz lifecycle stage.</h2>
      </div>
      <RouterLink class="primary" to="/editor">New quiz</RouterLink>
    </div>

    <p v-if="quizStore.error" class="error">{{ quizStore.error }}</p>
    <p v-if="quizStore.isLoading" class="hint">Loading quizzes...</p>

    <div v-if="quizStore.items.length" class="quiz-list">
      <article v-for="quiz in quizStore.items" :key="quiz.id" class="quiz-card">
        <div class="actions" style="justify-content: space-between;">
          <div class="stack" style="gap: 4px;">
            <h3 style="margin: 0;">{{ quiz.title }}</h3>
            <p style="margin: 0;">{{ quiz.description }}</p>
          </div>
          <span class="badge">{{ quiz.status }}</span>
        </div>

        <p class="hint" style="margin: 0;">
          {{ quiz.questions.length }} question{{ quiz.questions.length === 1 ? "" : "s" }}
        </p>

        <div class="actions">
          <button class="secondary" @click="router.push(`/editor/${quiz.id}`)">Edit</button>
          <button
            class="primary"
            @click="togglePublish(quiz.id!, quiz.status)"
          >
            {{ quiz.status === QuizStatus.PUBLISHED ? "Unpublish" : "Publish" }}
          </button>
        </div>
      </article>
    </div>

    <p v-else class="empty">No quizzes yet. Start by creating your first quiz.</p>
  </section>
</template>

