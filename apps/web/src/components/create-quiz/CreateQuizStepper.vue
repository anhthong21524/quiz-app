<script setup lang="ts">
import type { CreateQuizStep } from "./types";

interface StepDefinition {
  step: CreateQuizStep;
  label: string;
}

const props = defineProps<{
  currentStep: CreateQuizStep;
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
  return step < props.currentStep;
}
</script>

<template>
  <div class="flex items-center gap-4 overflow-x-auto py-1">
    <template v-for="(step, index) in steps" :key="step.step">
      <button
        type="button"
        class="flex items-center gap-3"
        :class="isClickable(step.step) ? 'cursor-pointer' : 'cursor-default'"
        :disabled="!isClickable(step.step)"
        @click="emit('select', step.step)"
      >
        <span
          class="flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold transition-colors"
          :class="
            isCompleted(step.step)
              ? 'border-emerald-600 bg-emerald-600 text-white'
              : isActive(step.step)
                ? 'border-emerald-600 bg-emerald-600 text-white'
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
          class="whitespace-nowrap text-base font-semibold"
          :class="
            isCompleted(step.step) || isActive(step.step) ? 'text-gray-900' : 'text-gray-400'
          "
        >
          {{ step.label }}
        </span>
      </button>

      <div
        v-if="index < steps.length - 1"
        class="h-px min-w-16 flex-1 rounded-full"
        :class="currentStep > step.step ? 'bg-emerald-500' : 'bg-gray-200'"
      ></div>
    </template>
  </div>
</template>
