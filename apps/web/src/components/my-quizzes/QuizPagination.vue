<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  currentPage: number;
  totalPages: number;
  showingCopy: string;
}>();

const emit = defineEmits<{
  "update:currentPage": [page: number];
}>();

const pages = computed(() => {
  const total = props.totalPages;
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const cur = props.currentPage;
  const set = new Set<number | "…">([1, total, cur]);
  if (cur > 1) set.add(cur - 1);
  if (cur < total) set.add(cur + 1);

  const sorted = [...set] as (number | "…")[];
  const result: (number | "…")[] = [];
  let prev: number | null = null;
  for (const p of sorted.sort((a, b) => (a as number) - (b as number))) {
    if (prev !== null && (p as number) - prev > 1) result.push("…");
    result.push(p);
    prev = p as number;
  }
  return result;
});

function go(page: number) {
  if (page < 1 || page > props.totalPages || page === props.currentPage) return;
  emit("update:currentPage", page);
}
</script>

<template>
  <footer class="quiz-pagination">
    <p>{{ showingCopy }}</p>

    <nav class="pagination-controls" aria-label="Quiz pagination">
      <button
        class="pagination-button"
        type="button"
        :disabled="currentPage <= 1"
        aria-label="Previous page"
        @click="go(currentPage - 1)"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
          <path d="m15 6-6 6 6 6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <template v-for="p in pages" :key="p">
        <span v-if="p === '…'" class="pagination-ellipsis">…</span>
        <button
          v-else
          class="pagination-button"
          :class="{ 'is-active': p === currentPage }"
          type="button"
          :aria-label="`Page ${p}`"
          :aria-current="p === currentPage ? 'page' : undefined"
          @click="go(p as number)"
        >
          {{ p }}
        </button>
      </template>

      <button
        class="pagination-button"
        type="button"
        :disabled="currentPage >= totalPages"
        aria-label="Next page"
        @click="go(currentPage + 1)"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
          <path d="m9 6 6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </nav>
  </footer>
</template>
