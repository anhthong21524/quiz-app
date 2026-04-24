<script setup lang="ts">
import type { QuestionOption } from "./types";

const props = defineProps<{
  option: QuestionOption;
  canDelete: boolean;
}>();

const emit = defineEmits<{
  updateText: [value: string];
  toggleCorrect: [];
  delete: [];
}>();
</script>

<template>
  <div class="flex items-center gap-2.5">
    <button
      type="button"
      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition"
      :class="
        option.isCorrect
          ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
          : 'border-emerald-500 bg-white text-gray-700 hover:border-emerald-600'
      "
      :aria-pressed="option.isCorrect"
      @click="emit('toggleCorrect')"
    >
      <svg
        v-if="option.isCorrect"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        stroke-width="2.2"
        class="h-4 w-4"
      >
        <path d="m4 10 3 3 9-9" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <span v-else>{{ option.label }}</span>
    </button>

    <input
      :value="option.text"
      type="text"
      class="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
      :placeholder="`Option ${option.label}`"
      @input="emit('updateText', ($event.target as HTMLInputElement).value)"
    />

    <span class="hidden text-gray-300 md:inline-flex" aria-hidden="true">
      <svg viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5">
        <circle cx="6" cy="5" r="1.1" />
        <circle cx="6" cy="10" r="1.1" />
        <circle cx="6" cy="15" r="1.1" />
        <circle cx="14" cy="5" r="1.1" />
        <circle cx="14" cy="10" r="1.1" />
        <circle cx="14" cy="15" r="1.1" />
      </svg>
    </span>

    <button
      type="button"
      class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-transparent text-gray-400 transition hover:border-red-100 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
      :disabled="!canDelete"
      aria-label="Delete option"
      @click="emit('delete')"
    >
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" class="h-4 w-4">
        <path d="m5 5 10 10M15 5 5 15" stroke-linecap="round" />
      </svg>
    </button>
  </div>
</template>
