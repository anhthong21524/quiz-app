<script setup lang="ts">
import { computed } from "vue";
import AppToolbar, { type ToolbarFilter } from "../AppToolbar.vue";

const props = defineProps<{
  searchQuery: string;
  selectedSubject: string;
  selectedDateRange: string;
  subjectOptions: string[];
  dateRangeOptions: string[];
}>();

const emit = defineEmits<{
  "update:searchQuery": [value: string];
  "update:selectedSubject": [value: string];
  "update:selectedDateRange": [value: string];
  clear: [];
}>();

const filters = computed<ToolbarFilter[]>(() => [
  { label: "Filter by subject", options: props.subjectOptions, value: props.selectedSubject },
  { label: "Filter by date range", options: props.dateRangeOptions, value: props.selectedDateRange },
]);

function onFiltersChange(updated: ToolbarFilter[]) {
  emit("update:selectedSubject", updated[0].value);
  emit("update:selectedDateRange", updated[1].value);
}
</script>

<template>
  <aside class="result-filter-card" aria-label="Quiz result filters">
    <div class="sidebar-card-header">
      <h2>Filter</h2>
      <button type="button" class="clear-filter-button" @click="emit('clear')">Clear all</button>
    </div>

    <AppToolbar
      stacked
      :search="searchQuery"
      search-placeholder="Search quizzes..."
      :filters="filters"
      @update:search="emit('update:searchQuery', $event)"
      @update:filters="onFiltersChange"
    />
  </aside>
</template>

<style scoped>
.result-filter-card {
  border: var(--surface-border);
  border-radius: 16px;
  padding: 18px;
  display: grid;
  gap: 14px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: var(--surface-shadow);
}

.sidebar-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.sidebar-card-header h2 {
  margin: 0;
  color: #182033;
  font-size: 1rem;
}

.clear-filter-button {
  border: 0;
  padding: 0;
  background: transparent;
  color: #10b981;
  font-size: 0.86rem;
  font-weight: 800;
  cursor: pointer;
}
</style>
