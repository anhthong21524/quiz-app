<script setup lang="ts">
import type { CreateQuizStep } from "./types";

interface StepDefinition {
  step: CreateQuizStep;
  label: string;
}

const props = defineProps<{
  currentStep: CreateQuizStep;
  allClickable?: boolean;
}>();

const emit = defineEmits<{
  select: [step: CreateQuizStep];
}>();

const steps: StepDefinition[] = [
  { step: 1, label: "Configuration" },
  { step: 2, label: "Questions" }
];

function isCompleted(step: CreateQuizStep) {
  return step < props.currentStep;
}

function isActive(step: CreateQuizStep) {
  return step === props.currentStep;
}

function isClickable(step: CreateQuizStep) {
  return props.allClickable || step < props.currentStep;
}
</script>

<template>
  <div class="flex items-center gap-3 overflow-x-auto py-1">
    <template v-for="(step, index) in steps" :key="step.step">
      <button
        type="button"
        class="flex items-center gap-3 rounded-xl pr-1 transition disabled:opacity-100"
        :class="isClickable(step.step) ? 'cursor-pointer' : 'cursor-default'"
        :disabled="!isClickable(step.step)"
        @click="emit('select', step.step)"
      >
        <span
          class="flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition-colors"
          :class="
            isCompleted(step.step)
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : isActive(step.step)
                ? 'border-emerald-600 bg-emerald-600 text-white shadow-[0_0_0_4px_rgba(16,185,129,0.12)]'
                : 'border-gray-200 bg-gray-100 text-gray-500'
          "
        >
          <svg
            v-if="isCompleted(step.step)"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            class="h-4 w-4"
          >
            <path d="m4 10 4 4 8-8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span v-else>{{ step.step }}</span>
        </span>

        <span
          class="whitespace-nowrap text-sm font-semibold transition-colors sm:text-base"
          :class="
            isActive(step.step)
              ? 'text-emerald-700'
              : isCompleted(step.step)
                ? 'text-gray-900'
                : 'text-gray-400'
          "
        >
          {{ step.label }}
        </span>
      </button>

      <div
        v-if="index < steps.length - 1"
        class="h-0.5 min-w-12 flex-1 rounded-full"
        :class="currentStep > step.step ? 'bg-emerald-500' : 'bg-gray-200'"
      ></div>
    </template>
  </div>
</template>
