<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import QuizIconAvatar from "../components/my-quizzes/QuizIconAvatar.vue";
import QuizRowActions from "../components/my-quizzes/QuizRowActions.vue";
import QuizStatusBadge from "../components/my-quizzes/QuizStatusBadge.vue";
import { myQuizzes, type MyQuiz, type MyQuizStatus } from "../data/my-quizzes";

type ViewMode = "list" | "grid";

const router = useRouter();

const searchQuery = ref("");
const selectedStatus = ref<MyQuizStatus | "All status">("All status");
const selectedSubject = ref("All subjects");
const selectedSort = ref("last-updated");
const viewMode = ref<ViewMode>("list");

const statusOptions: Array<MyQuizStatus | "All status"> = [
  "All status",
  "Published",
  "In progress",
  "Draft"
];

const subjectOptions = computed(() => [
  "All subjects",
  ...Array.from(new Set(myQuizzes.map((quiz) => quiz.subject))).sort()
]);

const filteredQuizzes = computed(() => {
  const normalizedSearch = searchQuery.value.trim().toLowerCase();

  const matchingQuizzes = myQuizzes.filter((quiz) => {
    const matchesSearch =
      !normalizedSearch ||
      quiz.title.toLowerCase().includes(normalizedSearch) ||
      quiz.subject.toLowerCase().includes(normalizedSearch);
    const matchesStatus =
      selectedStatus.value === "All status" || quiz.status === selectedStatus.value;
    const matchesSubject =
      selectedSubject.value === "All subjects" || quiz.subject === selectedSubject.value;

    return matchesSearch && matchesStatus && matchesSubject;
  });

  return [...matchingQuizzes].sort((left, right) => {
    if (selectedSort.value === "title") {
      return left.title.localeCompare(right.title);
    }

    if (selectedSort.value === "questions") {
      return right.questions - left.questions;
    }

    return new Date(right.lastUpdated).getTime() - new Date(left.lastUpdated).getTime();
  });
});

const showingCopy = computed(() => {
  const quizCount = filteredQuizzes.value.length;

  if (!quizCount) {
    return "Showing 0 to 0 of 0 quizzes";
  }

  return `Showing 1 to ${quizCount} of ${quizCount} quizzes`;
});

function createQuiz() {
  router.push({ name: "create-quiz" });
}

function isContinueEditingQuiz(quiz: MyQuiz) {
  return quiz.id === "chemistry-basics";
}
</script>

<template>
  <section class="my-quizzes-page">
    <section class="quiz-manager-card" aria-labelledby="my-quizzes-list-title">
      <h2 id="my-quizzes-list-title" class="sr-only">My quizzes list</h2>

      <div class="quiz-toolbar">
        <label class="search-control">
          <span class="sr-only">Search quizzes</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <circle cx="11" cy="11" r="7" />
            <path d="m16.5 16.5 3.5 3.5" stroke-linecap="round" />
          </svg>
          <input v-model="searchQuery" type="search" placeholder="Search quizzes..." />
        </label>

        <div class="filter-group">
          <label class="select-control">
            <span class="sr-only">Filter by status</span>
            <select v-model="selectedStatus">
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
            <select v-model="selectedSubject">
              <option v-for="subject in subjectOptions" :key="subject" :value="subject">
                {{ subject }}
              </option>
            </select>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="m7 10 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </label>

          <label class="select-control sort-control">
            <span class="sr-only">Sort quizzes</span>
            <select v-model="selectedSort">
              <option value="last-updated">Sort by: Last updated</option>
              <option value="title">Sort by: Title</option>
              <option value="questions">Sort by: Questions</option>
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
            @click="viewMode = 'list'"
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
            @click="viewMode = 'grid'"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
              <path d="M5 5h5v5H5zM14 5h5v5h-5zM5 14h5v5H5zM14 14h5v5h-5z" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <template v-if="filteredQuizzes.length">
        <div v-if="viewMode === 'list'" class="quiz-table-shell">
          <table class="quiz-table">
            <thead>
              <tr>
                <th>Quiz title</th>
                <th>Subject</th>
                <th>Questions</th>
                <th>Status</th>
                <th>Last updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="quiz in filteredQuizzes"
                :key="quiz.id"
                :class="{ 'is-highlighted': isContinueEditingQuiz(quiz) }"
              >
                <td>
                  <div class="quiz-title-cell">
                    <QuizIconAvatar :icon="quiz.icon" />
                    <span>{{ quiz.title }}</span>
                  </div>
                </td>
                <td>{{ quiz.subject }}</td>
                <td>{{ quiz.questions }}</td>
                <td><QuizStatusBadge :status="quiz.status" /></td>
                <td>{{ quiz.lastUpdatedLabel }}</td>
                <td><QuizRowActions :title="quiz.title" /></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="viewMode === 'list'" class="quiz-card-list">
          <article
            v-for="quiz in filteredQuizzes"
            :key="`${quiz.id}-card`"
            class="quiz-mobile-card"
            :class="{ 'is-highlighted': isContinueEditingQuiz(quiz) }"
          >
            <div class="mobile-card-header">
              <div class="quiz-title-cell">
                <QuizIconAvatar :icon="quiz.icon" />
                <span>{{ quiz.title }}</span>
              </div>
              <QuizStatusBadge :status="quiz.status" />
            </div>

            <dl class="mobile-card-meta">
              <div>
                <dt>Subject</dt>
                <dd>{{ quiz.subject }}</dd>
              </div>
              <div>
                <dt>Questions</dt>
                <dd>{{ quiz.questions }}</dd>
              </div>
              <div>
                <dt>Last updated</dt>
                <dd>{{ quiz.lastUpdatedLabel }}</dd>
              </div>
            </dl>

            <QuizRowActions class="card-actions" :title="quiz.title" />
          </article>
        </div>

        <div v-else class="quiz-grid">
          <article
            v-for="quiz in filteredQuizzes"
            :key="`${quiz.id}-grid`"
            class="quiz-grid-card"
            :class="{ 'is-highlighted': isContinueEditingQuiz(quiz) }"
          >
            <div class="grid-card-topline">
              <QuizIconAvatar :icon="quiz.icon" />
              <QuizStatusBadge :status="quiz.status" />
            </div>

            <div class="grid-card-copy">
              <h3>{{ quiz.title }}</h3>
              <p>{{ quiz.subject }} &middot; {{ quiz.questions }} questions</p>
            </div>

            <div class="grid-card-footer">
              <span>{{ quiz.lastUpdatedLabel }}</span>
              <QuizRowActions class="card-actions" :title="quiz.title" />
            </div>
          </article>
        </div>

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

      <div v-else class="empty-state">
        <div class="empty-illustration" aria-hidden="true">
          <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 8h14l6 6v24a3 3 0 0 1-3 3H15a3 3 0 0 1-3-3V11a3 3 0 0 1 3-3Z" />
            <path d="M29 8v7h7" />
            <path d="M18 23h12M18 30h8" stroke-linecap="round" />
          </svg>
        </div>
        <h3>No quizzes yet</h3>
        <p>Create your first quiz to start building your question library.</p>
        <button class="new-quiz-button" type="button" @click="createQuiz">Create quiz</button>
      </div>
    </section>
  </section>
</template>

<style scoped>
.my-quizzes-page {
  display: grid;
}

.quiz-manager-card {
  border: 1px solid rgba(226, 223, 218, 0.92);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 10px 26px rgba(46, 35, 20, 0.06);
}

.new-quiz-button {
  min-height: 48px;
  border: 0;
  border-radius: 12px;
  padding: 0 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #10b981;
  color: #ffffff;
  box-shadow: 0 12px 22px rgba(16, 185, 129, 0.18);
  font-weight: 800;
  white-space: nowrap;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.new-quiz-button:hover {
  transform: translateY(-1px);
  background: #0ea873;
  box-shadow: 0 16px 26px rgba(16, 185, 129, 0.22);
}

.quiz-manager-card {
  overflow: hidden;
}

.quiz-toolbar {
  display: grid;
  grid-template-columns: minmax(240px, 1fr) minmax(0, auto) auto;
  align-items: center;
  gap: 16px;
  padding: 28px;
}

.search-control,
.select-control {
  min-height: 44px;
  border: 1px solid #dfe4ea;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #ffffff;
  color: #7a8595;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.search-control {
  max-width: 330px;
  padding: 0 14px;
}

.search-control:focus-within,
.select-control:focus-within {
  border-color: #10b981;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
}

.search-control svg,
.select-control svg {
  width: 19px;
  height: 19px;
  flex-shrink: 0;
}

.search-control input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: #283141;
}

.search-control input::placeholder {
  color: #7f8a9c;
}

.filter-group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.select-control {
  position: relative;
  min-width: 156px;
}

.select-control select {
  width: 100%;
  min-height: 44px;
  border: 0;
  outline: none;
  appearance: none;
  background: transparent;
  color: #283141;
  padding: 0 42px 0 16px;
  cursor: pointer;
}

.select-control svg {
  position: absolute;
  right: 14px;
  pointer-events: none;
}

.sort-control {
  min-width: 220px;
}

.view-toggle {
  justify-self: end;
  display: inline-flex;
  overflow: hidden;
  border: 1px solid #dfe4ea;
  border-radius: 10px;
  background: #ffffff;
}

.view-toggle-button {
  width: 52px;
  height: 44px;
  border: 0;
  display: grid;
  place-items: center;
  background: transparent;
  color: #7c8797;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.view-toggle-button + .view-toggle-button {
  border-left: 1px solid #edf0f2;
}

.view-toggle-button svg {
  width: 20px;
  height: 20px;
}

.view-toggle-button.is-active {
  background: #e9fbf2;
  color: #10b981;
  box-shadow: inset 0 0 0 1px #86e3bf;
}

.quiz-table-shell {
  width: 100%;
  overflow-x: auto;
  border-top: 1px solid #edf0f2;
}

.quiz-table {
  width: 100%;
  min-width: 1060px;
  border-collapse: collapse;
}

.quiz-table th,
.quiz-table td {
  padding: 14px 28px;
  border-bottom: 1px solid #edf0f2;
  text-align: left;
}

.quiz-table th {
  background: #fbfcfd;
  color: #8a93a3;
  font-size: 0.88rem;
  font-weight: 700;
}

.quiz-table td {
  color: #293246;
  font-size: 0.96rem;
}

.quiz-table tbody tr {
  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.quiz-table tbody tr:hover {
  background: #fbfdfb;
}

.quiz-table tbody tr.is-highlighted {
  background: #f2fbf6;
}

.quiz-title-cell {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
  color: #182033;
  font-weight: 800;
}

.quiz-card-list,
.quiz-grid {
  border-top: 1px solid #edf0f2;
}

.quiz-card-list {
  display: none;
  padding: 16px;
  gap: 14px;
}

.quiz-mobile-card,
.quiz-grid-card {
  border: 1px solid #edf0f2;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 8px 22px rgba(34, 24, 12, 0.04);
}

.quiz-mobile-card.is-highlighted,
.quiz-grid-card.is-highlighted {
  border-color: #c8f1dd;
  background: #f4fbf7;
}

.quiz-mobile-card {
  display: grid;
  gap: 16px;
  padding: 16px;
}

.mobile-card-header,
.grid-card-topline,
.grid-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.mobile-card-meta {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin: 0;
}

.mobile-card-meta div {
  min-width: 0;
}

.mobile-card-meta dt {
  color: #8a93a3;
  font-size: 0.8rem;
  font-weight: 700;
}

.mobile-card-meta dd {
  margin: 2px 0 0;
  color: #293246;
  font-size: 0.95rem;
  font-weight: 700;
}

.quiz-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  padding: 18px;
}

.quiz-grid-card {
  display: grid;
  gap: 18px;
  padding: 18px;
}

.grid-card-copy {
  display: grid;
  gap: 6px;
}

.grid-card-copy h3,
.grid-card-copy p,
.grid-card-footer span {
  margin: 0;
}

.grid-card-copy h3 {
  color: #182033;
  font-size: 1.05rem;
}

.grid-card-copy p,
.grid-card-footer span {
  color: #657286;
}

.grid-card-footer {
  align-items: flex-end;
}

.grid-card-footer span {
  font-size: 0.88rem;
}

.quiz-pagination {
  min-height: 74px;
  padding: 18px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.quiz-pagination p {
  margin: 0;
  color: #657286;
  font-size: 0.95rem;
}

.pagination-controls {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.pagination-button {
  min-width: 34px;
  height: 34px;
  border: 0;
  border-radius: 9px;
  display: inline-grid;
  place-items: center;
  background: #eef2f6;
  color: #93a0af;
  font-weight: 800;
}

.pagination-button svg {
  width: 17px;
  height: 17px;
}

.pagination-button.is-active {
  background: #10b981;
  color: #ffffff;
}

.pagination-button:disabled {
  cursor: not-allowed;
  opacity: 0.64;
}

.empty-state {
  margin: 0;
  min-height: 360px;
  border-top: 1px solid #edf0f2;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 12px;
  padding: 46px 20px;
  text-align: center;
}

.empty-illustration {
  width: 76px;
  height: 76px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background: #e8fbf2;
  color: #10b981;
}

.empty-illustration svg {
  width: 42px;
  height: 42px;
}

.empty-state h3,
.empty-state p {
  margin: 0;
}

.empty-state h3 {
  color: #182033;
  font-size: 1.25rem;
}

.empty-state p {
  max-width: 380px;
  color: #657286;
}

.empty-state .new-quiz-button {
  margin-top: 6px;
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

@media (max-width: 1120px) {
  .quiz-toolbar {
    grid-template-columns: 1fr auto;
  }

  .filter-group {
    grid-column: 1 / -1;
    order: 3;
  }

  .search-control {
    max-width: none;
  }

  .view-toggle {
    grid-column: 2;
  }

  .quiz-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 860px) {
  .new-quiz-button {
    width: 100%;
  }

  .quiz-toolbar {
    grid-template-columns: 1fr;
    padding: 18px;
  }

  .filter-group {
    display: grid;
    grid-column: auto;
    grid-template-columns: 1fr;
    order: initial;
  }

  .select-control,
  .sort-control {
    min-width: 0;
  }

  .view-toggle {
    justify-self: start;
    grid-column: auto;
  }

  .quiz-table-shell {
    display: none;
  }

  .quiz-card-list {
    display: grid;
  }

  .quiz-grid {
    grid-template-columns: 1fr;
    padding: 16px;
  }

  .quiz-pagination {
    align-items: flex-start;
    flex-direction: column;
    padding: 18px;
  }

  .pagination-controls {
    align-self: stretch;
    justify-content: flex-end;
  }
}

@media (max-width: 560px) {
  .mobile-card-header,
  .grid-card-topline,
  .grid-card-footer {
    align-items: flex-start;
    flex-direction: column;
  }

  .mobile-card-meta {
    grid-template-columns: 1fr;
  }

  .card-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
