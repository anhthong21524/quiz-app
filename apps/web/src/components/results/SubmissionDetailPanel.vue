<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { QuizSubmission } from "../../data/quiz-submissions";
import SubmissionAnswerReview from "./SubmissionAnswerReview.vue";

const props = defineProps<{
  submission: QuizSubmission;
}>();

const emit = defineEmits<{
  close: [];
}>();

const activeTab = ref<"answers" | "overview">("answers");

const correctRate = computed(() => `${props.submission.scorePercent}%`);
const submittedAtDate = computed(() => {
  const [monthDay, year] = props.submission.submittedAt.split(", ");

  return year ? `${monthDay}, ${year}` : props.submission.submittedAt;
});
const submittedAtTime = computed(() => props.submission.submittedAt.split(", ")[2] ?? "");

watch(
  () => props.submission.id,
  () => {
    activeTab.value = "answers";
  }
);
</script>

<template>
  <aside class="submission-detail-panel" aria-labelledby="submission-detail-title">
    <header class="detail-panel-header">
      <h2 id="submission-detail-title">Submission detail</h2>
      <button type="button" class="detail-close-button" aria-label="Close detail" @click="emit('close')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <path d="m7 7 10 10M17 7 7 17" stroke-linecap="round" />
        </svg>
      </button>
    </header>

    <div class="detail-panel-body">
      <section class="participant-block">
        <span class="submission-avatar" :class="`is-${submission.accent}`" aria-hidden="true">
          {{ submission.initials }}
        </span>
        <div class="participant-copy">
          <h3>{{ submission.participantName }}</h3>
          <p>{{ submission.email }}</p>
        </div>
        <span class="status-badge">{{ submission.status }}</span>
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

    <div class="detail-tabs" role="tablist" aria-label="Submission detail views">
      <button
        type="button"
        class="detail-tab"
        :class="{ 'is-active': activeTab === 'answers' }"
        :aria-selected="activeTab === 'answers'"
        role="tab"
        @click="activeTab = 'answers'"
      >
        Answers review
      </button>
      <button
        type="button"
        class="detail-tab"
        :class="{ 'is-active': activeTab === 'overview' }"
        :aria-selected="activeTab === 'overview'"
        role="tab"
        @click="activeTab = 'overview'"
      >
        Overview
      </button>
    </div>

    <div class="detail-tab-panel">
      <SubmissionAnswerReview v-if="activeTab === 'answers'" :answers="submission.answers" />

      <div v-else class="detail-overview">
        <article>
          <span>Correct answers</span>
          <strong>{{ submission.correctAnswers }} / {{ submission.totalQuestions }}</strong>
        </article>
        <article>
          <span>Status</span>
          <strong>{{ submission.status }}</strong>
        </article>
        <article>
          <span>Submitted at</span>
          <strong>{{ submission.submittedAt }}</strong>
        </article>
      </div>
    </div>

    <footer class="detail-panel-footer">
      <button type="button" class="close-detail-button" @click="emit('close')">Close detail</button>
    </footer>
  </aside>
</template>

<style scoped>
.submission-detail-panel {
  border: var(--surface-border);
  border-radius: 16px;
  display: flex;
  min-width: 0;
  min-height: 620px;
  flex-direction: column;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: var(--surface-shadow);
}

.detail-panel-header {
  min-height: 62px;
  padding: 0 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px solid #edf0f2;
}

.detail-panel-header h2 {
  margin: 0;
  color: #182033;
  font-size: 1rem;
}

.detail-close-button {
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 9px;
  display: grid;
  place-items: center;
  background: transparent;
  color: #182033;
}

.detail-close-button:hover {
  background: #eef9f4;
  color: #10b981;
}

.detail-close-button svg {
  width: 20px;
  height: 20px;
}

.detail-panel-body {
  padding: 20px 18px 14px;
  display: grid;
  gap: 22px;
}

.participant-block {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
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

.status-badge {
  min-height: 22px;
  border-radius: 999px;
  padding: 0 9px;
  display: inline-flex;
  align-items: center;
  background: #dff8ed;
  color: #0f9f65;
  font-size: 0.75rem;
  font-weight: 900;
  white-space: nowrap;
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
  min-height: 86px;
  padding: 13px 10px;
  display: grid;
  justify-items: center;
  align-content: center;
  gap: 4px;
  text-align: center;
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
}

.submission-stat-grid small:first-of-type {
  color: #10b981;
}

.detail-tabs {
  padding: 0 18px;
  display: flex;
  gap: 26px;
  border-bottom: 1px solid #edf0f2;
}

.detail-tab {
  min-height: 42px;
  border: 0;
  border-radius: 0;
  padding: 0;
  position: relative;
  background: transparent;
  color: #52617a;
  font-size: 0.82rem;
  font-weight: 900;
}

.detail-tab.is-active {
  color: #10b981;
}

.detail-tab.is-active::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 3px;
  background: #10b981;
}

.detail-tab-panel {
  padding: 0 18px;
}

.detail-overview {
  padding: 18px 0;
  display: grid;
  gap: 12px;
}

.detail-overview article {
  border: 1px solid #edf0f2;
  border-radius: 12px;
  padding: 14px;
  display: grid;
  gap: 3px;
}

.detail-overview span {
  color: #667287;
  font-size: 0.82rem;
  font-weight: 800;
}

.detail-overview strong {
  color: #182033;
}

.detail-panel-footer {
  margin-top: auto;
  padding: 18px;
  display: flex;
  justify-content: flex-end;
}

.close-detail-button {
  min-height: 38px;
  border: 1px solid #dfe4ea;
  border-radius: 9px;
  padding: 0 18px;
  background: #ffffff;
  color: #182033;
  font-weight: 800;
}

.close-detail-button:hover {
  border-color: #a7f3d0;
  background: #eef9f4;
  color: #10b981;
}

@media (max-width: 560px) {
  .participant-block,
  .submission-stat-grid {
    grid-template-columns: 1fr;
    justify-items: start;
  }

  .status-badge {
    justify-self: start;
  }

  .submission-stat-grid article {
    width: 100%;
    justify-items: start;
    text-align: left;
  }

  .submission-stat-grid article + article {
    border-top: 1px solid #dfe4ea;
    border-left: 0;
  }
}
</style>
