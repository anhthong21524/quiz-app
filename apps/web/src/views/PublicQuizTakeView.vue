<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuizAttemptStore } from "../stores/quizAttempt";

const route = useRoute();
const router = useRouter();
const attemptStore = useQuizAttemptStore();

const slug = computed(() => String(route.params.slug ?? ""));
const attempt = computed(() => attemptStore.currentAttempt);

function goBack() {
  router.push({ name: "public-quiz", params: { slug: slug.value } });
}
</script>

<template>
  <main class="min-h-screen bg-[#f7f4ef] px-5 py-8 text-[#111827]">
    <section
      class="mx-auto grid min-h-[calc(100vh-4rem)] max-w-2xl place-items-center text-center"
    >
      <div class="w-full rounded-3xl border border-[#e3e7ee] bg-white p-8 shadow-2xl shadow-slate-900/10">
        <div
          class="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" class="h-8 w-8" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M8 6h13M8 12h13M8 18h13" stroke-linecap="round" />
            <path d="m3 6 1 1 2-2M3 12l1 1 2-2M3 18l1 1 2-2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>

        <h1 class="text-3xl font-extrabold tracking-normal">Quiz attempt ready</h1>
        <p v-if="attempt" class="mt-3 text-base leading-7 text-slate-600">
          Thanks, {{ attempt.takerName }}. Your attempt has been created and the quiz-taking
          screen can be connected here next.
        </p>
        <p v-else class="mt-3 text-base leading-7 text-slate-600">
          Start from the public landing page so your quiz attempt can be prepared.
        </p>

        <button
          class="mt-8 inline-flex min-h-12 items-center justify-center rounded-2xl bg-emerald-600 px-6 font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
          type="button"
          @click="goBack"
        >
          Back to quiz landing
        </button>
      </div>
    </section>
  </main>
</template>
