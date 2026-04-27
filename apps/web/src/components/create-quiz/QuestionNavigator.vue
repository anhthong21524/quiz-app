<script setup lang="ts">
import { computed } from "vue";
import type { CreateQuizQuestion } from "./types";

const props = defineProps<{
  questions: CreateQuizQuestion[];
  currentQuestionIndex: number;
}>();

const emit = defineEmits<{
  select: [index: number];
}>();

const completedCount = computed(
  () => props.questions.filter((question) => question.status === "completed").length
);

const completionPercentage = computed(() => {
  if (props.questions.length === 0) {
    return 0;
  }

  return Math.round((completedCount.value / props.questions.length) * 100);
});

const usesCompactLayout = computed(() => props.questions.length >= 41);

function getButtonClasses(status: CreateQuizQuestion["status"], isActive: boolean) {
  if (isActive) {
    return "border-emerald-600 bg-emerald-600 text-white shadow-[0_8px_18px_rgba(5,150,105,0.22)]";
  }

  if (status === "completed") {
    return "border-emerald-300 bg-emerald-50 text-emerald-800 hover:border-emerald-400 hover:bg-emerald-100";
  }

  if (status === "in_progress") {
    return "border-orange-200 bg-orange-50 text-orange-700";
  }

  return "border-gray-200 bg-white text-gray-700 hover:border-gray-300";
}

function getStatusLabel(status: CreateQuizQuestion["status"]) {
  if (status === "completed") {
    return "completed";
  }

  if (status === "in_progress") {
    return "in progress";
  }

  return "empty";
}
</script>

<template>
  <aside class="flex h-full flex-col rounded-[20px] border border-[rgba(226,223,218,0.92)] bg-white p-4 shadow-[0_10px_26px_rgba(46,35,20,0.06)] xl:sticky xl:top-6">
    <div class="flex items-start justify-between gap-3">
      <div>
        <h2 class="text-base font-bold text-gray-900">Questions</h2>
        <p class="mt-0.5 text-xs text-gray-500">{{ completedCount }} of {{ questions.length }} complete</p>
      </div>
      <span class="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
        {{ completionPercentage }}%
      </span>
    </div>

    <div class="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
      <div
        class="h-full rounded-full bg-emerald-500 transition-all duration-300"
        :style="{ width: `${completionPercentage}%` }"
      ></div>
    </div>

    <div class="mt-4 flex flex-1 flex-col space-y-3">
      <div
        class="grid"
        :class="
          usesCompactLayout
            ? 'grid-cols-5 gap-1.5'
            : 'grid-cols-4 gap-2 sm:grid-cols-5 lg:grid-cols-4'
        "
      >
        <button
          v-for="(question, index) in questions"
          :key="question.id"
          type="button"
          class="relative flex items-center justify-center overflow-hidden rounded-xl border font-semibold transition focus:outline-none focus:ring-4 focus:ring-emerald-100"
          :class="[
            usesCompactLayout ? 'h-9 text-[13px]' : 'h-10 text-sm',
            getButtonClasses(question.status, currentQuestionIndex === index)
          ]"
          :aria-label="`Question ${index + 1}: ${getStatusLabel(question.status)}${currentQuestionIndex === index ? ', selected' : ''}`"
          :title="`Question ${index + 1}: ${getStatusLabel(question.status)}`"
          @click="emit('select', index)"
        >
          <span class="relative z-10 inline-flex items-center justify-center gap-1">
            <span>{{ index + 1 }}</span>
            <svg
              v-if="question.status === 'completed' && currentQuestionIndex !== index"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              stroke-width="2.4"
              class="text-emerald-600"
              :class="usesCompactLayout ? 'h-2.5 w-2.5' : 'h-3 w-3'"
            >
              <path d="m4 10 3 3 9-9" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
        </button>
      </div>

      <div class="mt-auto space-y-3">
        <div v-if="completedCount < questions.length" class="rounded-xl bg-slate-50 px-3 py-2.5 text-xs text-slate-500">
          <span class="font-semibold text-slate-600">{{ questions.length - completedCount }}</span>
          {{ questions.length - completedCount === 1 ? "question" : "questions" }} left to complete.
        </div>
        <div v-else class="rounded-xl bg-emerald-50 px-3 py-2.5 text-xs font-medium text-emerald-700">
          All questions complete - ready to save!
        </div>
        <slot />
      </div>
    </div>
  </aside>
</template>
