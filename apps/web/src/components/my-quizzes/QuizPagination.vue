<script setup lang="ts">
defineProps<{
  showingCopy: string;
}>();
</script>

<template>
  <footer class="quiz-pagination">
    <p>{{ showingCopy }}</p>

    <nav class="pagination-controls" aria-label="Quiz pagination">
      <button class="pagination-button" type="button" disabled aria-label="Previous page">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
          <path d="m15 6-6 6 6 6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <button class="pagination-button is-active" type="button" aria-label="Page 1">1</button>
      <button class="pagination-button" type="button" disabled aria-label="Next page">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
          <path d="m9 6 6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </nav>
  </footer>
</template>
