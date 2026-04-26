<script setup lang="ts">
import type { RecentSubmissionResult } from "../../data/quiz-results";

defineProps<{
  submissions: RecentSubmissionResult[];
}>();
</script>

<template>
  <section class="sidebar-card" aria-labelledby="recent-submissions-title">
    <div class="sidebar-card-header">
      <h2 id="recent-submissions-title">Recent submissions</h2>
      <button type="button">View all</button>
    </div>

    <ul class="submission-list">
      <li v-for="submission in submissions" :key="submission.id">
        <span class="submission-avatar" :class="`is-${submission.accent}`" aria-hidden="true">
          {{ submission.initials }}
        </span>
        <span class="submission-copy">
          <strong>{{ submission.studentName }}</strong>
          <span>{{ submission.quizTitle }}</span>
        </span>
        <time>{{ submission.submittedAt }}</time>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.sidebar-card {
  border: var(--surface-border);
  border-radius: 16px;
  padding: 18px;
  display: grid;
  gap: 18px;
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

.sidebar-card-header button {
  border: 0;
  padding: 0;
  background: transparent;
  color: #10b981;
  font-size: 0.86rem;
  font-weight: 800;
}

.submission-list {
  margin: 0;
  padding: 0;
  display: grid;
  gap: 14px;
  list-style: none;
}

.submission-list li {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
}

.submission-avatar {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  display: grid;
  place-items: center;
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

.submission-copy {
  min-width: 0;
  display: grid;
  gap: 1px;
}

.submission-copy strong,
.submission-copy span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.submission-copy strong {
  color: #182033;
  font-size: 0.9rem;
}

.submission-copy span,
.submission-list time {
  color: #657286;
  font-size: 0.84rem;
}

.submission-list time {
  text-align: right;
  white-space: nowrap;
}

@media (max-width: 560px) {
  .submission-list li {
    grid-template-columns: auto minmax(0, 1fr);
    align-items: start;
  }

  .submission-list time {
    grid-column: 2;
    text-align: left;
  }
}
</style>
