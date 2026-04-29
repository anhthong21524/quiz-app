<script setup lang="ts">
import { computed } from "vue";
import type { QuizSubmission } from "../../data/quiz-submissions";
import { useI18n } from "../../i18n";
import SubmissionAnswerReview from "./SubmissionAnswerReview.vue";

const props = defineProps<{
  submission: QuizSubmission;
}>();

const { t } = useI18n();

const correctRate = computed(() => `${props.submission.scorePercent}%`);

const scoreColor = computed(() => {
  const p = props.submission.scorePercent;
  if (p >= 80) return "score-high";
  if (p >= 60) return "score-mid";
  return "score-low";
});

const submittedAtDate = computed(() => {
  const parts = props.submission.submittedAt.split(", ");
  return parts.length >= 2 ? `${parts[0]}, ${parts[1]}` : props.submission.submittedAt;
});

const submittedAtTime = computed(() => {
  const parts = props.submission.submittedAt.split(", ");
  return parts[2] ?? "";
});

const correctCount = computed(() => props.submission.answers.filter(a => a.isCorrect).length);
const incorrectCount = computed(() => props.submission.answers.filter(a => !a.isCorrect).length);
</script>

<template>
  <aside class="submission-detail-panel" :aria-label="t('results.detail.submissionDetailAria')">

    <!-- Participant + stats header -->
    <div class="detail-header">
      <div class="participant-block">
        <span class="submission-avatar" :class="`is-${submission.accent}`" aria-hidden="true">
          {{ submission.initials }}
        </span>
        <div class="participant-copy">
          <h3>{{ submission.participantName }}</h3>
          <p v-if="submission.participantEmail">{{ submission.participantEmail }}</p>
        </div>
      </div>

      <div class="submission-stat-grid" role="list" :aria-label="t('results.detail.submissionStatsAria')">
        <div class="stat-item" role="listitem">
          <span class="stat-label">{{ t("results.detail.score") }}</span>
          <strong class="stat-value">{{ submission.score }} / {{ submission.totalScore }}</strong>
          <span class="stat-sub" :class="scoreColor">{{ correctRate }}</span>
        </div>
        <div class="stat-item" role="listitem">
          <span class="stat-label">{{ t("results.detail.timeTaken") }}</span>
          <strong class="stat-value">{{ submission.timeTaken }}</strong>
          <span class="stat-sub">mm:ss</span>
        </div>
        <div class="stat-item" role="listitem">
          <span class="stat-label">{{ t("results.detail.submittedAt") }}</span>
          <strong class="stat-value">{{ submittedAtDate }}</strong>
          <span class="stat-sub">{{ submittedAtTime }}</span>
        </div>
      </div>
    </div>

    <!-- Answers review -->
    <section class="answer-section" aria-labelledby="answer-review-title">
      <div class="answer-section-header">
        <h2 id="answer-review-title">{{ t("results.detail.answersReview") }}</h2>
        <div class="answer-tally">
          <span class="tally-correct">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
              <path d="m7.5 12 3 3 6-6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            {{ t("results.detail.correctCount", { count: correctCount }) }}
          </span>
          <span class="tally-sep" aria-hidden="true">·</span>
          <span class="tally-incorrect">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
              <path d="m8 8 8 8M16 8l-8 8" stroke-linecap="round" />
            </svg>
            {{ t("results.detail.incorrectCount", { count: incorrectCount }) }}
          </span>
        </div>
      </div>
      <SubmissionAnswerReview :answers="submission.answers" />
    </section>

  </aside>
</template>

<style scoped>
.submission-detail-panel {
  border: var(--surface-border);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: var(--surface-shadow);
}

/* Header */
.detail-header {
  padding: 14px 18px;
  display: grid;
  grid-template-columns: minmax(160px, 240px) minmax(0, 1fr);
  align-items: center;
  gap: 14px;
  border-bottom: 1px solid #edf0f2;
}

.participant-block {
  display: flex;
  align-items: center;
  gap: 11px;
  min-width: 0;
}

.submission-avatar {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-size: 0.9rem;
  font-weight: 900;
  flex-shrink: 0;
}

.submission-avatar.is-green  { background: #dff8ed; color: #0f9f65; }
.submission-avatar.is-red    { background: #ffe4e6; color: #e11d48; }
.submission-avatar.is-blue   { background: #e1efff; color: #2563eb; }
.submission-avatar.is-purple { background: #f1e7ff; color: #9333ea; }
.submission-avatar.is-orange { background: #fff2e8; color: #f97316; }

.participant-copy {
  min-width: 0;
  display: grid;
  gap: 2px;
}

.participant-copy h3,
.participant-copy p {
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.participant-copy h3 {
  color: #182033;
  font-size: 0.93rem;
  font-weight: 800;
}

.participant-copy p {
  color: #667287;
  font-size: 0.82rem;
}

/* Stat grid */
.submission-stat-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border: 1px solid #e5e9ef;
  border-radius: 10px;
  overflow: hidden;
}

.stat-item {
  min-width: 0;
  padding: 7px 12px;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.stat-item + .stat-item {
  border-left: 1px solid #e5e9ef;
}

.stat-label {
  color: #8896aa;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.stat-value {
  color: #182033;
  font-size: 0.97rem;
  font-weight: 800;
  white-space: nowrap;
}

.stat-sub {
  color: #8896aa;
  font-size: 0.72rem;
  font-weight: 700;
}

.stat-sub.score-high { color: #16a34a; }
.stat-sub.score-mid  { color: #d97706; }
.stat-sub.score-low  { color: #dc2626; }

/* Answers section */
.answer-section {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.answer-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 16px 8px 18px;
  border-bottom: 1px solid #edf0f2;
}

.answer-section-header h2 {
  margin: 0;
  color: #182033;
  font-size: 0.88rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.answer-tally {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  font-weight: 700;
}

.tally-correct {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  color: #16a34a;
}

.tally-incorrect {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  color: #dc2626;
}

.tally-correct svg,
.tally-incorrect svg {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
}

.tally-sep {
  color: #c8d0db;
}

/* Responsive */
@media (max-width: 900px) {
  .detail-header {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .submission-stat-grid {
    grid-template-columns: 1fr;
  }

  .stat-item + .stat-item {
    border-top: 1px solid #e5e9ef;
    border-left: none;
  }
}
</style>
