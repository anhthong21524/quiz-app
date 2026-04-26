<script setup lang="ts">
import type { MyQuizStatus } from "./types";
import type { ViewMode } from "./types";

defineProps<{
  searchQuery: string;
  selectedStatus: MyQuizStatus | "All status";
  selectedSubject: string;
  viewMode: ViewMode;
  statusOptions: Array<MyQuizStatus | "All status">;
  subjectOptions: string[];
}>();

const emit = defineEmits<{
  "update:searchQuery": [value: string];
  "update:selectedStatus": [value: MyQuizStatus | "All status"];
  "update:selectedSubject": [value: string];
  "update:viewMode": [value: ViewMode];
}>();
</script>

<template>
  <div class="quiz-toolbar">
    <label class="search-control">
      <span class="sr-only">Search quizzes</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <circle cx="11" cy="11" r="7" />
        <path d="m16.5 16.5 3.5 3.5" stroke-linecap="round" />
      </svg>
      <input
        :value="searchQuery"
        type="text"
        placeholder="Search quizzes..."
        @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
      />
      <button
        v-if="searchQuery"
        class="search-clear"
        type="button"
        aria-label="Clear search"
        @click="emit('update:searchQuery', '')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6 6 18M6 6l12 12" stroke-linecap="round" />
        </svg>
      </button>
    </label>

    <div class="filter-group">
      <label class="select-control">
        <span class="sr-only">Filter by status</span>
        <select
          :value="selectedStatus"
          @change="emit('update:selectedStatus', ($event.target as HTMLSelectElement).value as MyQuizStatus | 'All status')"
        >
          <option v-for="status in statusOptions" :key="status" :value="status">
            {{ status }}
          </option>
        </select>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="m7 10 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </label>

      <label class="select-control">
        <span class="sr-only">Filter by subject</span>
        <select
          :value="selectedSubject"
          @change="emit('update:selectedSubject', ($event.target as HTMLSelectElement).value)"
        >
          <option v-for="subject in subjectOptions" :key="subject" :value="subject">
            {{ subject }}
          </option>
        </select>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="m7 10 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </label>


    </div>

    <div class="view-toggle" role="group" aria-label="Choose quiz view">
      <button
        class="view-toggle-button"
        :class="{ 'is-active': viewMode === 'list' }"
        type="button"
        aria-label="List view"
        :aria-pressed="viewMode === 'list'"
        @click="emit('update:viewMode', 'list')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
          <path d="M8 6h12M8 12h12M8 18h12" stroke-linecap="round" />
          <path d="M4 6h.01M4 12h.01M4 18h.01" stroke-linecap="round" />
        </svg>
      </button>
      <button
        class="view-toggle-button"
        :class="{ 'is-active': viewMode === 'grid' }"
        type="button"
        aria-label="Grid view"
        :aria-pressed="viewMode === 'grid'"
        @click="emit('update:viewMode', 'grid')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
          <path d="M5 5h5v5H5zM14 5h5v5h-5zM5 14h5v5H5zM14 14h5v5h-5z" stroke-linejoin="round" />
        </svg>
      </button>
    </div>
  </div>
</template>
