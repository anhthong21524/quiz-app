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

const usesCompactLayout = computed(() => props.questions.length >= 41);

function getButtonClasses(status: CreateQuizQuestion["status"], isActive: boolean) {
  if (isActive) {
    return "border-emerald-600 bg-emerald-600 text-white shadow-sm";
  }

  if (status === "completed") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "in_progress") {
    return "border-orange-200 bg-orange-50 text-orange-700";
  }

  return "border-gray-200 bg-white text-gray-700 hover:border-gray-300";
}
</script>

<template>
  <aside class="flex h-full flex-col rounded-[20px] border border-[rgba(226,223,218,0.92)] bg-white p-4 shadow-[0_10px_26px_rgba(46,35,20,0.06)] xl:sticky xl:top-6">
    <div class="space-y-1">
      <h2 class="text-xl font-bold text-gray-900">Questions</h2>
      <p class="text-sm text-gray-500">{{ completedCount }} / {{ questions.length }} completed</p>
    </div>

    <div class="mt-4 flex flex-1 flex-col space-y-4">
      <div
        class="grid"
        :class="
          usesCompactLayout
            ? 'grid-cols-5 gap-2'
            : 'grid-cols-4 gap-2.5 sm:grid-cols-5 lg:grid-cols-4'
        "
      >
        <button
          v-for="(question, index) in questions"
          :key="question.id"
          type="button"
          class="relative flex items-center justify-center rounded-xl border font-semibold transition"
          :class="[
            usesCompactLayout ? 'h-9 text-[13px]' : 'h-11 text-sm',
            getButtonClasses(question.status, currentQuestionIndex === index)
          ]"
          @click="emit('select', index)"
        >
          <span>{{ index + 1 }}</span>
          <span
            v-if="question.status === 'completed' && currentQuestionIndex !== index"
            class="absolute inline-flex items-center justify-center rounded-full bg-emerald-600 text-white"
            :class="usesCompactLayout ? 'bottom-0.5 right-0.5 h-3.5 w-3.5' : 'bottom-1 right-1 h-4 w-4'"
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              :class="usesCompactLayout ? 'h-2 w-2' : 'h-2.5 w-2.5'"
            >
              <path d="m4 10 3 3 9-9" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
        </button>
      </div>

      <div class="mt-auto">
        <slot />
      </div>
    </div>
  </aside>
</template>
