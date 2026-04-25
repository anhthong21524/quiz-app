<script setup lang="ts">
const emit = defineEmits<{
  create: [];
}>();
</script>

<template>
  <div class="empty-state">
    <div class="empty-illustration" aria-hidden="true">
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M15 8h14l6 6v24a3 3 0 0 1-3 3H15a3 3 0 0 1-3-3V11a3 3 0 0 1 3-3Z" />
        <path d="M29 8v7h7" />
        <path d="M18 23h12M18 30h8" stroke-linecap="round" />
      </svg>
    </div>
    <h3>No quizzes yet</h3>
    <p>Create your first quiz to start building your question library.</p>
    <button class="new-quiz-button" type="button" @click="emit('create')">Create quiz</button>
  </div>
</template>
