<script setup lang="ts">
defineProps<{
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
</script>

<template>
  <aside class="result-filter-card" aria-label="Quiz result filters">
    <div class="sidebar-card-header">
      <h2>Filter</h2>
      <button type="button" class="clear-filter-button" @click="emit('clear')">Clear all</button>
    </div>

    <label class="filter-search">
      <span class="sr-only">Search quizzes</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
        <circle cx="11" cy="11" r="6" />
        <path d="m16 16 4 4" stroke-linecap="round" />
      </svg>
      <input
        :value="searchQuery"
        type="search"
        placeholder="Search quizzes..."
        @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
      />
    </label>

    <div class="filter-split">
      <label class="filter-select">
        <span class="sr-only">Subject</span>
        <select
          :value="selectedSubject"
          @change="emit('update:selectedSubject', ($event.target as HTMLSelectElement).value)"
        >
          <option v-for="subject in subjectOptions" :key="subject" :value="subject">
            {{ subject }}
          </option>
        </select>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <path d="m7 10 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </label>

      <label class="filter-select">
        <span class="sr-only">Date range</span>
        <select
          :value="selectedDateRange"
          @change="emit('update:selectedDateRange', ($event.target as HTMLSelectElement).value)"
        >
          <option v-for="range in dateRangeOptions" :key="range" :value="range">
            {{ range }}
          </option>
        </select>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <path d="M7 3.5V6M17 3.5V6M5 9h14M6.5 5h11A1.5 1.5 0 0 1 19 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 17.5v-11A1.5 1.5 0 0 1 6.5 5Z" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </label>
    </div>
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
}

.filter-search,
.filter-select {
  min-height: 44px;
  border: 1px solid #dfe4ea;
  border-radius: 10px;
  display: flex;
  align-items: center;
  background: #ffffff;
  color: #667287;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.filter-search:focus-within,
.filter-select:focus-within {
  border-color: #10b981;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
}

.filter-search {
  gap: 10px;
  padding: 0 12px;
}

.filter-search svg,
.filter-select svg {
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
}

.filter-search input,
.filter-select select {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #283141;
}

.filter-search input::placeholder {
  color: #7f8a9c;
}

.filter-select {
  position: relative;
}

.filter-select select {
  min-height: 42px;
  appearance: none;
  padding: 0 38px 0 12px;
  cursor: pointer;
}

.filter-select svg {
  position: absolute;
  right: 12px;
  pointer-events: none;
}

.filter-split {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 12px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 560px) {
  .filter-split {
    grid-template-columns: 1fr;
  }
}
</style>
