<script setup lang="ts">
import { computed } from "vue";
import type { QuizSubmission } from "../../data/quiz-submissions";
import SubmissionAnswerReview from "./SubmissionAnswerReview.vue";

const props = defineProps<{
  submission: QuizSubmission;
}>();

const correctRate = computed(() => `${props.submission.scorePercent}%`);
const submittedAtDate = computed(() => {
  const [monthDay, year] = props.submission.submittedAt.split(", ");

  return year ? `${monthDay}, ${year}` : props.submission.submittedAt;
});
const submittedAtTime = computed(() => props.submission.submittedAt.split(", ")[2] ?? "");
</script>

<template>
  <aside class="submission-detail-panel" aria-label="Submission detail">
    <div class="detail-panel-body">
      <section class="participant-block">
        <span class="submission-avatar" :class="`is-${submission.accent}`" aria-hidden="true">
          {{ submission.initials }}
        </span>
        <div class="participant-copy">
          <h3>{{ submission.participantName }}</h3>
          <p>{{ submission.participantEmail }}</p>
        </div>
      </section>

      <section class="submission-stat-grid" aria-label="Submission stats">
        <article>
          <span>Score</span>
          <strong>{{ submission.score }} / {{ submission.totalScore }}</strong>
          <small>{{ correctRate }}</small>
        </article>
        <article>
          <span>Time taken</span>
          <strong>{{ submission.timeTaken }}</strong>
          <small>mm:ss</small>
        </article>
        <article>
          <span>Submitted at</span>
          <strong>{{ submittedAtDate }}</strong>
          <small>{{ submittedAtTime }}</small>
        </article>
      </section>
    </div>

    <section class="detail-answer-section" aria-labelledby="answer-review-title">
      <h2 id="answer-review-title">Answers review</h2>
      <SubmissionAnswerReview :answers="submission.answers" />
    </section>
  </aside>
</template>

<style scoped>
.submission-detail-panel {
  border: var(--surface-border);
  border-radius: 16px;
  position: relative;
  display: flex;
  min-width: 0;
  min-height: 0;
  flex-direction: column;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: var(--surface-shadow);
}

.detail-panel-body {
  padding: 14px 18px;
  display: grid;
  grid-template-columns: minmax(180px, 260px) minmax(0, 1fr);
  align-items: stretch;
  gap: 14px;
}

.participant-block {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 14px;
}

.submission-avatar {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  display: grid;
  place-items: center;
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
  font-size: 0.96rem;
}

.participant-copy p {
  color: #667287;
  font-size: 0.86rem;
}

.submission-stat-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border: 1px solid #dfe4ea;
  border-radius: 10px;
  overflow: hidden;
}

.submission-stat-grid article {
  min-width: 0;
  min-height: 50px;
  padding: 8px 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-align: left;
}

.submission-stat-grid article + article {
  border-left: 1px solid #dfe4ea;
}

.submission-stat-grid span,
.submission-stat-grid small {
  color: #667287;
  font-size: 0.76rem;
  font-weight: 700;
}

.submission-stat-grid strong {
  color: #182033;
  font-size: 1rem;
  white-space: nowrap;
}

.submission-stat-grid small:first-of-type {
  color: #10b981;
}

.detail-answer-section {
  border-top: 1px solid #edf0f2;
}

.detail-answer-section h2 {
  margin: 0;
  padding: 10px 18px 6px;
  color: #182033;
  font-size: 0.95rem;
  font-weight: 900;
}

@media (max-width: 900px) {
  .detail-panel-body {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .participant-block,
  .submission-stat-grid {
    grid-template-columns: 1fr;
    justify-items: start;
  }

  .submission-stat-grid article {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
    text-align: left;
  }

  .submission-stat-grid article + article {
    border-top: 1px solid #dfe4ea;
    border-left: 0;
  }
}
</style>
