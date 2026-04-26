<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(defineProps<{
  currentPage: number;
  totalPages: number;
  showingCopy: string;
  ariaLabel?: string;
}>(), {
  ariaLabel: "Pagination",
});

const emit = defineEmits<{
  "update:currentPage": [page: number];
}>();

const pages = computed<(number | "...")[]>(() => {
  const total = props.totalPages;

  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const current = props.currentPage;
  const visiblePages = new Set<number>([1, total, current]);

  if (current > 1) {
    visiblePages.add(current - 1);
  }

  if (current < total) {
    visiblePages.add(current + 1);
  }

  const sortedPages = [...visiblePages].sort((left, right) => left - right);
  const result: (number | "...")[] = [];
  let previousPage: number | null = null;

  for (const page of sortedPages) {
    if (previousPage !== null && page - previousPage > 1) {
      result.push("...");
    }

    result.push(page);
    previousPage = page;
  }

  return result;
});

function goToPage(page: number) {
  if (page < 1 || page > props.totalPages || page === props.currentPage) {
    return;
  }

  emit("update:currentPage", page);
}
</script>

<template>
  <footer class="app-pagination">
    <p>{{ showingCopy }}</p>

    <nav class="pagination-controls" :aria-label="ariaLabel">
      <button
        type="button"
        class="pagination-button"
        aria-label="Previous page"
        :disabled="currentPage <= 1"
        @click="goToPage(currentPage - 1)"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true">
          <path d="m15 6-6 6 6 6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <template v-for="page in pages" :key="page">
        <span v-if="page === '...'" class="pagination-ellipsis">...</span>
        <button
          v-else
          type="button"
          class="pagination-button"
          :class="{ 'is-active': page === currentPage }"
          :aria-label="`Page ${page}`"
          :aria-current="page === currentPage ? 'page' : undefined"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </template>

      <button
        type="button"
        class="pagination-button"
        aria-label="Next page"
        :disabled="currentPage >= totalPages"
        @click="goToPage(currentPage + 1)"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true">
          <path d="m9 6 6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </nav>
  </footer>
</template>

<style scoped>
.app-pagination {
  min-height: 70px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.app-pagination p {
  margin: 0;
  color: #657286;
  font-size: 0.92rem;
}

.pagination-controls {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.pagination-button,
.pagination-ellipsis {
  min-width: 36px;
  height: 36px;
  border-radius: 10px;
  display: inline-grid;
  place-items: center;
}

.pagination-button {
  border: 1px solid #dfe4ea;
  background: #ffffff;
  color: #344159;
  font-weight: 900;
}

.pagination-button svg {
  width: 17px;
  height: 17px;
}

.pagination-button.is-active {
  border-color: #10b981;
  background: #10b981;
  color: #ffffff;
  box-shadow: 0 12px 20px rgba(16, 185, 129, 0.18);
}

.pagination-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.pagination-ellipsis {
  color: #7f8a9c;
  font-weight: 700;
}

@media (max-width: 720px) {
  .app-pagination {
    align-items: flex-start;
    flex-direction: column;
  }

  .pagination-controls {
    align-self: stretch;
    justify-content: flex-end;
  }
}
</style>
