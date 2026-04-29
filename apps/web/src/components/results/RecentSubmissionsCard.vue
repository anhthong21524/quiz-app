<script setup lang="ts">
import AppDateTime from "../AppDateTime.vue";
import type { RecentSubmissionResult } from "../../data/quiz-results";
import { useI18n } from "../../i18n";

defineProps<{
  submissions: RecentSubmissionResult[];
}>();

const { t } = useI18n();

function scoreClass(pct: number | null) {
  if (pct == null) return "";
  if (pct >= 80) return "score--high";
  if (pct < 70) return "score--low";
  return "score--mid";
}
</script>

<template>
  <section class="sidebar-card" aria-labelledby="recent-submissions-title">
    <div class="sidebar-card-header">
      <h2 id="recent-submissions-title">{{ t("results.overview.recentSubmissions") }}</h2>
      <RouterLink class="view-all-link" :to="{ name: 'results' }">{{ t("results.overview.viewAll") }}</RouterLink>
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
        <div class="submission-meta">
          <span
            v-if="submission.scorePercent != null"
            class="submission-score"
            :class="scoreClass(submission.scorePercent)"
          >{{ submission.scorePercent }}%</span>
          <AppDateTime :value="submission.submittedAtIso" />
        </div>
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
  align-content: start;
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

.submission-list {
  margin: 0;
  padding: 0;
  display: grid;
  gap: 14px;
  list-style: none;
}

.view-all-link {
  font-size: 0.82rem;
  font-weight: 700;
  color: #10b981;
  text-decoration: none;
  white-space: nowrap;
}

.view-all-link:hover {
  text-decoration: underline;
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

.submission-copy span {
  color: #657286;
  font-size: 0.84rem;
}

.submission-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
}

.submission-meta :deep(time),
.submission-list time {
  color: #657286;
  font-size: 0.82rem;
  white-space: nowrap;
}

.submission-score {
  font-size: 0.8rem;
  font-weight: 800;
  white-space: nowrap;
}

.submission-score.score--high { color: #10b981; }
.submission-score.score--low  { color: #f97316; }
.submission-score.score--mid  { color: #182033; }

@media (max-width: 560px) {
  .submission-list li {
    grid-template-columns: auto minmax(0, 1fr);
    align-items: start;
  }

  .submission-meta {
    grid-column: 2;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
  }
}
</style>
