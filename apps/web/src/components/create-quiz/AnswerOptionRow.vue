<script setup lang="ts">
import { useI18n } from "../../i18n";
import type { QuestionOption } from "./types";

const props = defineProps<{
  option: QuestionOption;
  canDelete: boolean;
  isDragging?: boolean;
  isDragTarget?: boolean;
  allowMultiple?: boolean;
  readonly?: boolean;
}>();

const emit = defineEmits<{
  updateText: [value: string];
  toggleCorrect: [];
  delete: [];
  dragStart: [event: DragEvent];
  dragEnter: [];
  dragOver: [event: DragEvent];
  drop: [event: DragEvent];
  dragEnd: [];
}>();

const { t } = useI18n();
</script>

<template>
  <div v-if="readonly" class="flex items-center gap-2.5 rounded-xl">
    <div
      class="flex h-9 w-9 shrink-0 items-center justify-center border text-sm font-semibold"
      :class="[
        allowMultiple ? 'rounded-lg' : 'rounded-full',
        option.isCorrect
          ? 'border-emerald-600 bg-emerald-600 text-white'
          : 'border-gray-200 bg-white text-gray-600'
      ]"
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
    </div>
    <span
      class="min-w-0 flex-1 rounded-xl border px-4 py-2 text-sm"
      :class="
        option.isCorrect
          ? 'border-emerald-200 bg-emerald-50 font-medium text-emerald-800'
          : 'border-gray-200 bg-gray-50 text-gray-700'
      "
    >{{ option.text }}</span>
  </div>

  <div
    v-else
    class="flex items-center gap-2.5 rounded-xl transition"
    :class="[
      isDragging ? 'opacity-50' : '',
      isDragTarget ? 'bg-emerald-50 ring-2 ring-emerald-200' : ''
    ]"
    @dragenter.prevent="emit('dragEnter')"
    @dragover.prevent="emit('dragOver', $event)"
    @drop.prevent="emit('drop', $event)"
  >
    <button
      type="button"
      class="flex h-9 w-9 shrink-0 items-center justify-center border text-sm font-semibold transition"
      :class="[
        allowMultiple ? 'rounded-lg' : 'rounded-full',
        option.isCorrect
          ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
          : 'border-emerald-500 bg-white text-gray-700 hover:border-emerald-600'
      ]"
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
      class="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
      :placeholder="`${t('createQuiz.fields.addOption')} ${option.label}`"
      @input="emit('updateText', ($event.target as HTMLInputElement).value)"
    />

    <button
      type="button"
      draggable="true"
      class="hidden h-8 w-7 shrink-0 cursor-grab items-center justify-center rounded-lg text-gray-300 transition hover:bg-gray-50 hover:text-gray-500 active:cursor-grabbing md:inline-flex"
      :aria-label="`${t('settings.configuration.dragToReorder')} ${option.label}`"
      @dragstart="emit('dragStart', $event)"
      @dragend="emit('dragEnd')"
    >
      <svg viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5">
        <circle cx="6" cy="5" r="1.1" />
        <circle cx="6" cy="10" r="1.1" />
        <circle cx="6" cy="15" r="1.1" />
        <circle cx="14" cy="5" r="1.1" />
        <circle cx="14" cy="10" r="1.1" />
        <circle cx="14" cy="15" r="1.1" />
      </svg>
    </button>

    <button
      type="button"
      class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-transparent text-gray-400 transition hover:border-red-100 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
      :disabled="!canDelete"
      :aria-label="t('settings.configuration.remove')"
      @click="emit('delete')"
    >
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" class="h-4 w-4">
        <path d="m5 5 10 10M15 5 5 15" stroke-linecap="round" />
      </svg>
    </button>
  </div>
</template>
