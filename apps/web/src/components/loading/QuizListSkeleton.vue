<script setup lang="ts">
import SkeletonBlock from "./SkeletonBlock.vue";

/**
 * Skeleton for the quiz list manager card.
 * Mirrors the exact layout of QuizToolbar + QuizTable (desktop)
 * and QuizCardList (mobile) so content replacement causes zero layout shift.
 *
 * count: number of skeleton rows / cards to render. Default 5 matches a
 * typical first page, which prevents the page from jumping when real rows load.
 */
withDefaults(defineProps<{ count?: number }>(), { count: 5 });
</script>

<template>
  <!-- Toolbar skeleton — mirrors .quiz-toolbar grid -->
  <div class="qls-toolbar" aria-hidden="true">
    <SkeletonBlock height="40px" rounded="md" class="qls-toolbar__search" />
    <div class="qls-toolbar__filters">
      <SkeletonBlock height="40px" width="156px" rounded="md" />
      <SkeletonBlock height="40px" width="156px" rounded="md" />
      <SkeletonBlock height="40px" width="220px" rounded="md" />
    </div>
    <SkeletonBlock height="40px" width="84px" rounded="md" class="qls-toolbar__toggle" />
  </div>

  <!-- Table skeleton — desktop only, hidden on mobile via CSS -->
  <div class="qls-table" aria-hidden="true" aria-label="Loading quizzes">
    <!-- Header row -->
    <div class="qls-table__header">
      <SkeletonBlock height="14px" width="200px" rounded="sm" />
      <SkeletonBlock height="14px" width="80px" rounded="sm" />
      <SkeletonBlock height="14px" width="70px" rounded="sm" />
      <SkeletonBlock height="14px" width="90px" rounded="sm" />
      <SkeletonBlock height="14px" width="60px" rounded="sm" />
    </div>

    <!-- Data rows -->
    <div
      v-for="i in count"
      :key="i"
      class="qls-table__row"
    >
      <!-- Icon + title -->
      <div class="qls-table__title-cell">
        <SkeletonBlock height="38px" width="38px" rounded="lg" />
        <div class="qls-table__title-text">
          <SkeletonBlock height="14px" :width="`${140 + (i % 3) * 40}px`" rounded="sm" />
          <SkeletonBlock height="12px" width="80px" rounded="sm" style="margin-top: 6px;" />
        </div>
      </div>
      <!-- Status badge -->
      <SkeletonBlock height="24px" width="88px" rounded="full" />
      <!-- Questions count -->
      <SkeletonBlock height="14px" width="48px" rounded="sm" />
      <!-- Last updated -->
      <SkeletonBlock height="14px" width="120px" rounded="sm" />
      <!-- Actions -->
      <SkeletonBlock height="32px" width="80px" rounded="md" />
    </div>
  </div>

  <!-- Card skeleton — mobile only, hidden on desktop via CSS -->
  <div class="qls-cards" aria-hidden="true">
    <div v-for="i in count" :key="i" class="qls-card">
      <div class="qls-card__header">
        <div class="qls-card__title-row">
          <SkeletonBlock height="36px" width="36px" rounded="lg" />
          <div class="qls-card__title-text">
            <SkeletonBlock height="14px" :width="`${130 + (i % 3) * 30}px`" rounded="sm" />
            <SkeletonBlock height="12px" width="70px" rounded="sm" style="margin-top: 5px;" />
          </div>
        </div>
        <SkeletonBlock height="24px" width="84px" rounded="full" />
      </div>
      <div class="qls-card__meta">
        <div v-for="col in 3" :key="col" class="qls-card__meta-item">
          <SkeletonBlock height="11px" width="48px" rounded="sm" />
          <SkeletonBlock height="14px" width="64px" rounded="sm" style="margin-top: 4px;" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── Toolbar ──────────────────────────────────────────────────────── */

.qls-toolbar {
  display: grid;
  grid-template-columns: minmax(240px, 1fr) minmax(0, auto) auto;
  align-items: center;
  gap: 14px;
  padding: 24px;
  border-bottom: 1px solid #edf0f2;
}

.qls-toolbar__filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

/* ── Table ────────────────────────────────────────────────────────── */

.qls-table {
  width: 100%;
  border-top: 1px solid #edf0f2;
}

.qls-table__header {
  display: grid;
  grid-template-columns: 1fr 120px 80px 160px 100px;
  gap: 12px;
  padding: 12px 24px;
  background: #fbfcfd;
  border-bottom: 1px solid #edf0f2;
}

.qls-table__row {
  display: grid;
  grid-template-columns: 1fr 120px 80px 160px 100px;
  gap: 12px;
  align-items: center;
  padding: 10px 24px;
  min-height: 56px;
  border-bottom: 1px solid #edf0f2;
}

.qls-table__title-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.qls-table__title-text {
  min-width: 0;
}

/* ── Cards ────────────────────────────────────────────────────────── */

.qls-cards {
  display: none;
  padding: 16px;
  gap: 14px;
  border-top: 1px solid #edf0f2;
}

.qls-card {
  display: grid;
  gap: 14px;
  padding: 16px;
  border: 1px solid #edf0f2;
  border-radius: 16px;
  background: #ffffff;
}

.qls-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.qls-card__title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.qls-card__title-text {
  min-width: 0;
}

.qls-card__meta {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.qls-card__meta-item {
  display: flex;
  flex-direction: column;
}

/* ── Responsive ───────────────────────────────────────────────────── */

@media (max-width: 1120px) {
  .qls-toolbar {
    grid-template-columns: 1fr auto;
  }

  .qls-toolbar__filters {
    grid-column: 1 / -1;
    order: 3;
  }
}

@media (max-width: 860px) {
  .qls-toolbar {
    grid-template-columns: 1fr;
    padding: 18px;
  }

  .qls-toolbar__filters {
    grid-column: auto;
    grid-template-columns: 1fr;
    order: initial;
    flex-direction: column;
    align-items: stretch;
  }

  .qls-toolbar__toggle {
    display: none;
  }

  .qls-table {
    display: none;
  }

  .qls-cards {
    display: grid;
  }
}

@media (max-width: 560px) {
  .qls-card__meta {
    grid-template-columns: 1fr;
  }
}
</style>
