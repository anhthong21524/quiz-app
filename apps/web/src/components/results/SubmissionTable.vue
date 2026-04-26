<script setup lang="ts">
import AppPagination from "../AppPagination.vue";
import AppTable from "../AppTable.vue";
import type { QuizSubmission } from "../../data/quiz-submissions";

defineProps<{
  submissions: QuizSubmission[];
  searchQuery: string;
  scoreFilter: string;
  dateFilter: string;
  selectedSubmissionId: string | null;
  currentPage: number;
  pageCount: number;
  showingStart: number;
  showingEnd: number;
  totalSubmissions: number;
  scoreOptions: string[];
  dateOptions: string[];
}>();

const emit = defineEmits<{
  "update:searchQuery": [value: string];
  "update:scoreFilter": [value: string];
  "update:dateFilter": [value: string];
  page: [page: number];
  select: [submission: QuizSubmission];
}>();

const columns = [
  { label: "#" },
  { label: "Participant" },
  { label: "Score" },
  { label: "Time taken" },
  { label: "Submitted at" },
];

function scoreClass(submission: QuizSubmission) {
  if (submission.scorePercent >= 80) {
    return "is-high";
  }

  if (submission.scorePercent < 70) {
    return "is-low";
  }

  return "is-medium";
}

function handlePageChange(page: number) {
  emit("page", page);
}
</script>

<template>
  <div class="submission-table-wrap">
    <div class="submission-toolbar">
      <label class="toolbar-search">
        <span class="sr-only">Search submissions</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <circle cx="11" cy="11" r="6" />
          <path d="m16 16 4 4" stroke-linecap="round" />
        </svg>
        <input
          :value="searchQuery"
          type="search"
          placeholder="Search by name or email..."
          @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
        />
      </label>

      <div class="toolbar-filters">
        <label class="toolbar-select">
          <span class="sr-only">Score</span>
          <select
            :value="scoreFilter"
            @change="emit('update:scoreFilter', ($event.target as HTMLSelectElement).value)"
          >
            <option v-for="option in scoreOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path d="m7 10 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </label>

        <label class="toolbar-select">
          <span class="sr-only">Date range</span>
          <select
            :value="dateFilter"
            @change="emit('update:dateFilter', ($event.target as HTMLSelectElement).value)"
          >
            <option v-for="option in dateOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path d="M7 3.5V6M17 3.5V6M5 9h14M6.5 5h11A1.5 1.5 0 0 1 19 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 17.5v-11A1.5 1.5 0 0 1 6.5 5Z" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </label>
      </div>
    </div>

    <AppTable v-if="submissions.length" :columns="columns" min-width="820px" first-column-variant="index">
      <tr
        v-for="(submission, index) in submissions"
        :key="submission.id"
        :class="{ 'is-selected': submission.id === selectedSubmissionId }"
        tabindex="0"
        role="button"
        :aria-label="`View ${submission.participantName} submission detail`"
        @click="emit('select', submission)"
        @keydown.enter.prevent="emit('select', submission)"
        @keydown.space.prevent="emit('select', submission)"
      >
        <td>{{ showingStart + index }}</td>
        <td>
          <div class="participant-cell">
            <span class="submission-avatar" :class="`is-${submission.accent}`" aria-hidden="true">
              {{ submission.initials }}
            </span>
            <span class="participant-copy">
              <strong>{{ submission.participantName }}</strong>
              <span>{{ submission.participantEmail }}</span>
            </span>
          </div>
        </td>
        <td>
          <span class="score-value">
            {{ submission.score }}/{{ submission.totalScore }} -
            <span class="score-percent" :class="scoreClass(submission)">
              {{ submission.scorePercent }}%
            </span>
          </span>
        </td>
        <td>{{ submission.timeTaken }}</td>
        <td>
          <time :datetime="submission.submittedAtIso">{{ submission.submittedAt }}</time>
        </td>
      </tr>
    </AppTable>

    <div v-else class="submissions-empty-state">
      <span aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M5 19V5M5 19h14M9 16v-5M13 16V8M17 16v-3" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
      <h3>No submissions match these filters</h3>
      <p>Adjust the search, score, or date filter to find participants.</p>
    </div>

    <AppPagination
      :current-page="currentPage"
      :total-pages="pageCount"
      :showing-copy="`Showing ${showingStart} to ${showingEnd} of ${totalSubmissions} submissions`"
      aria-label="Submission pagination"
      @update:current-page="handlePageChange"
    />
  </div>
</template>

<style scoped>
.submission-table-wrap {
  display: flex;
  flex-direction: column;
}

.submission-toolbar {
  min-height: 76px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  border-bottom: 1px solid #edf0f2;
}

.toolbar-search,
.toolbar-select {
  min-height: 40px;
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

.toolbar-search:focus-within,
.toolbar-select:focus-within {
  border-color: #10b981;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
}

.toolbar-search {
  width: min(100%, 300px);
  gap: 10px;
  padding: 0 12px;
}

.toolbar-search svg,
.toolbar-select svg {
  width: 17px;
  height: 17px;
  flex: 0 0 auto;
}

.toolbar-search input,
.toolbar-select select {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #283141;
}

.toolbar-search input::placeholder {
  color: #7f8a9c;
}

.toolbar-filters {
  display: grid;
  grid-template-columns: repeat(2, minmax(148px, 1fr));
  gap: 10px;
}

.toolbar-select {
  position: relative;
}

.toolbar-select select {
  min-height: 38px;
  appearance: none;
  padding: 0 38px 0 12px;
  cursor: pointer;
}

.toolbar-select svg {
  position: absolute;
  right: 12px;
  pointer-events: none;
}

.submission-table-wrap :deep(td) {
  color: #344159;
  font-size: 0.88rem;
}

.submission-table-wrap :deep(tbody tr) {
  cursor: pointer;
  outline: none;
  transition: background-color 0.2s ease;
}

.submission-table-wrap :deep(tbody tr:hover),
.submission-table-wrap :deep(tbody tr.is-selected) {
  background: #eefaf4;
}

.submission-table-wrap :deep(tbody tr:focus-visible) {
  box-shadow: inset 0 0 0 2px #10b981;
}

.sortable-heading {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.sortable-heading svg {
  width: 15px;
  height: 15px;
}

.participant-cell {
  min-width: 230px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.submission-avatar {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  font-size: 0.8rem;
  font-weight: 900;
}

.submission-avatar.is-green {
  background: #dff8ed;
  color: #0f9f65;
}

.submission-avatar.is-red {
  background: #ffe4e6;
  color: #e11d48;
}

.submission-avatar.is-blue {
  background: #e1efff;
  color: #2563eb;
}

.submission-avatar.is-purple {
  background: #f1e7ff;
  color: #9333ea;
}

.submission-avatar.is-orange {
  background: #fff2e8;
  color: #f97316;
}

.participant-copy {
  min-width: 0;
  display: grid;
  gap: 1px;
}

.participant-copy strong,
.participant-copy span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.participant-copy strong {
  color: #182033;
  font-size: 0.9rem;
}

.participant-copy span {
  color: #657286;
  font-size: 0.8rem;
}

.score-value {
  color: #182033;
  font-weight: 900;
  white-space: nowrap;
}

.score-percent {
  font-weight: 900;
}

.score-percent.is-high {
  color: #10b981;
}

.score-percent.is-medium {
  color: #f97316;
}

.score-percent.is-low {
  color: #ef4444;
}

.submissions-empty-state {
  min-height: 320px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 10px;
  padding: 40px 20px;
  border-bottom: 1px solid #edf0f2;
  text-align: center;
}

.submissions-empty-state span {
  width: 58px;
  height: 58px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: #e8fbf2;
  color: #10b981;
}

.submissions-empty-state svg {
  width: 30px;
  height: 30px;
}

.submissions-empty-state h3,
.submissions-empty-state p {
  margin: 0;
}

.submissions-empty-state h3 {
  color: #182033;
  font-size: 1.1rem;
}

.submissions-empty-state p {
  max-width: 360px;
  color: #657286;
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

@media (max-width: 900px) {
  .submission-toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .toolbar-search {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .toolbar-filters {
    grid-template-columns: 1fr;
  }
}
</style>
