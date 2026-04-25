<script setup lang="ts">
/**
 * QuizStatsBar — dashboard activity strip for the My Quizzes page.
 *
 * Three internal states driven by props (no separate loading component needed):
 *
 *   loading === true          → skeleton shimmer (shown during initial load)
 *   total === 0 && !loading   → UX-5 welcome/empty-dashboard state
 *   total > 0  && !loading    → live stat pills (total, published, drafts)
 *
 * Kept as a pure display component: all data comes in via props so the
 * parent (MyQuizzesView) owns the data and this component stays testable.
 */
withDefaults(
  defineProps<{
    total: number;
    published: number;
    drafts: number;
    loading?: boolean;
  }>(),
  { loading: false }
);
</script>

<template>
  <!-- ── Loading: skeleton shimmer ───────────────────────── -->
  <div
    v-if="loading"
    class="stats-bar stats-bar--skeleton"
    aria-busy="true"
    aria-label="Loading dashboard stats"
  >
    <div class="sb-skel sb-skel--wide" />
    <div class="sb-skel sb-skel--pill" />
    <div class="sb-skel sb-skel--pill" />
    <div class="sb-skel sb-skel--pill" />
  </div>

  <!-- ── Empty: no quizzes yet (UX-5 dashboard empty state) ─ -->
  <div
    v-else-if="total === 0"
    class="stats-bar stats-bar--welcome"
    role="status"
    aria-live="polite"
  >
    <div class="welcome-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path
          d="M12 2l2.4 4.9 5.4.8-3.9 3.8 1 5.3-4.9-2.6-4.9 2.6 1-5.3L4.2 7.7l5.4-.8L12 2Z"
          stroke-linejoin="round"
        />
      </svg>
    </div>
    <div class="welcome-copy">
      <p class="welcome-title">Welcome to your quiz dashboard</p>
      <p class="welcome-hint">
        Your stats — total quizzes, published count, and recent activity — will appear here once
        you create your first quiz.
      </p>
    </div>
  </div>

  <!-- ── Active: quiz stats ───────────────────────────────── -->
  <div
    v-else
    class="stats-bar stats-bar--active"
    role="region"
    aria-label="Quiz dashboard stats"
  >
    <p class="stats-label">Overview</p>

    <dl class="stats-pills">
      <div class="stats-pill">
        <dt class="stats-pill__label">Total</dt>
        <dd class="stats-pill__value">{{ total }}</dd>
      </div>

      <div class="stats-pill stats-pill--green">
        <dt class="stats-pill__label">Published</dt>
        <dd class="stats-pill__value">{{ published }}</dd>
      </div>

      <div class="stats-pill stats-pill--amber">
        <dt class="stats-pill__label">Drafts</dt>
        <dd class="stats-pill__value">{{ drafts }}</dd>
      </div>
    </dl>
  </div>
</template>

<style scoped>
/* ── Shared shell ──────────────────────────────────────────── */
.stats-bar {
  border: var(--surface-border, 1px solid rgba(226, 223, 218, 0.92));
  border-radius: var(--surface-radius, 20px);
  background: rgba(255, 255, 255, 0.98);
  box-shadow: var(--surface-shadow, 0 10px 26px rgba(46, 35, 20, 0.06));
  padding: 16px 24px;
}

/* ── Skeleton ──────────────────────────────────────────────── */
.stats-bar--skeleton {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 60px;
}

.sb-skel {
  border-radius: 8px;
  background: linear-gradient(90deg, #f0f2f5 25%, #e4e8ed 50%, #f0f2f5 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease infinite;
  flex-shrink: 0;
}

.sb-skel--wide {
  height: 16px;
  flex: 1;
  max-width: 200px;
}

.sb-skel--pill {
  height: 36px;
  width: 88px;
  border-radius: 20px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Welcome / empty dashboard (UX-5) ─────────────────────── */
.stats-bar--welcome {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 60px;
}

.welcome-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: #fef9e7;
  color: #d97706;
  flex-shrink: 0;
}

.welcome-icon svg {
  width: 22px;
  height: 22px;
}

.welcome-copy {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.welcome-title {
  margin: 0;
  color: #182033;
  font-size: 0.95rem;
  font-weight: 700;
}

.welcome-hint {
  margin: 0;
  color: #657286;
  font-size: 0.86rem;
  line-height: 1.5;
}

/* ── Active stats ──────────────────────────────────────────── */
.stats-bar--active {
  display: flex;
  align-items: center;
  gap: 20px;
  min-height: 60px;
  flex-wrap: wrap;
}

.stats-label {
  margin: 0;
  color: #8a93a3;
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  flex-shrink: 0;
}

.stats-pills {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin: 0;
  padding: 0;
}

.stats-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 14px;
  border-radius: 20px;
  background: #f4f6f8;
  border: 1px solid #edf0f2;
}

.stats-pill--green {
  background: #e8fbf2;
  border-color: #c3f0d8;
}

.stats-pill--amber {
  background: #fffbeb;
  border-color: #fde68a;
}

.stats-pill__label {
  font-size: 0.82rem;
  font-weight: 600;
  color: #8a93a3;
}

.stats-pill--green .stats-pill__label {
  color: #059669;
}

.stats-pill--amber .stats-pill__label {
  color: #b45309;
}

.stats-pill__value {
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
  color: #182033;
  line-height: 1;
}

.stats-pill--green .stats-pill__value {
  color: #065f46;
}

.stats-pill--amber .stats-pill__value {
  color: #92400e;
}

/* ── Responsive ────────────────────────────────────────────── */
@media (max-width: 560px) {
  .stats-bar {
    padding: 14px 18px;
  }

  .stats-bar--welcome {
    align-items: flex-start;
  }

  .welcome-hint {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sb-skel {
    animation: none;
  }
}
</style>
