<script setup lang="ts">
import type { Question } from "@quiz-app/shared";

const props = defineProps<{
  modelValue: Question;
  questionIndex: number;
  canRemove: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [question: Question];
  "add-option": [];
  "remove-option": [optionIndex: number];
  "remove-question": [];
}>();

function updateQuestion(update: Partial<Question>) {
  emit("update:modelValue", {
    ...props.modelValue,
    ...update
  });
}

function updateOption(optionIndex: number, value: string) {
  const options = [...props.modelValue.options];
  options[optionIndex] = value;
  updateQuestion({ options });
}

function updateCorrectOptionIndex(value: number) {
  updateQuestion({ correctOptionIndex: value });
}
</script>

<template>
  <article class="question-card stack">
    <label class="field">
      <span>Prompt</span>
      <input
        :value="modelValue.prompt"
        :name="`question-${questionIndex}-prompt`"
        required
        placeholder="What does composable mean in Vue?"
        @input="updateQuestion({ prompt: ($event.target as HTMLInputElement).value })"
      />
    </label>

    <div class="stack">
      <label
        v-for="(option, optionIndex) in modelValue.options"
        :key="optionIndex"
        class="field"
      >
        <span>Option {{ optionIndex + 1 }}</span>
        <div class="actions option-actions">
          <input
            :value="option"
            :name="`question-${questionIndex}-option-${optionIndex}`"
            required
            placeholder="Answer option"
            @input="updateOption(optionIndex, ($event.target as HTMLInputElement).value)"
          />
          <button
            class="danger"
            type="button"
            :disabled="modelValue.options.length <= 2"
            @click="emit('remove-option', optionIndex)"
          >
            Remove
          </button>
        </div>
      </label>
    </div>

    <div class="actions question-actions">
      <button class="secondary" type="button" @click="emit('add-option')">
        Add option
      </button>
      <label class="field correct-option-field">
        <span>Correct option</span>
        <input
          :value="modelValue.correctOptionIndex"
          type="number"
          min="0"
          :max="modelValue.options.length - 1"
          @input="updateCorrectOptionIndex(Number(($event.target as HTMLInputElement).value))"
        />
      </label>
      <button
        class="danger"
        type="button"
        :disabled="!canRemove"
        @click="emit('remove-question')"
      >
        Remove question
      </button>
    </div>
  </article>
</template>

<style scoped>
.option-actions {
  align-items: center;
}

.option-actions input {
  min-width: 180px;
  flex: 1;
}

.question-actions {
  align-items: end;
}

.correct-option-field {
  min-width: 180px;
}

.danger:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

@media (max-width: 640px) {
  .option-actions,
  .question-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .correct-option-field {
    min-width: 0;
  }
}
</style>
