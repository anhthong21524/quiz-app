<script setup lang="ts">
import { computed, onMounted } from "vue";
import { RouterLink } from "vue-router";
import { QuizStatus, type Quiz } from "@quiz-app/shared";
import AppTable from "../components/AppTable.vue";
import StatCard from "../components/StatCard.vue";
import QuizIconAvatar from "../components/my-quizzes/QuizIconAvatar.vue";
import QuizStatusBadge from "../components/my-quizzes/QuizStatusBadge.vue";
import type { MyQuizIcon, MyQuizStatus } from "../components/my-quizzes/types";
import { useQuizStore } from "../stores/quizzes";

const quizStore = useQuizStore();
const RECENT_QUIZZES_LIMIT = 5;

onMounted(async () => {
  if (!quizStore.items.length && !quizStore.isLoading) {
    await quizStore.loadQuizzes();
  }
});

// ── Icon helper (mirrors MyQuizzesView) ───────────────────────
function getQuizIcon(subject?: string): MyQuizIcon {
  const s = subject?.trim().toLowerCase() ?? "";
  if (s.includes("math")) return "mathematics";
  if (s.includes("science") || s.includes("chem")) return "science";
  if (s.includes("geo")) return "geography";
  if (s.includes("english") || s.includes("grammar")) return "english";
  if (s.includes("physics")) return "physics";
  if (s.includes("history")) return "history";
  return "knowledge";
}

function mapStatus(status: QuizStatus): MyQuizStatus {
  if (status === QuizStatus.PUBLISHED) return "Published";
  if (status === QuizStatus.IN_PROGRESS) return "In progress";
  return "Unpublished";
}

function formatDateTime(value?: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

// ── Hero: last in-progress quiz (or most recently updated) ───
const heroQuiz = computed<Quiz | null>(() => {
  const items = quizStore.items;
  if (!items.length) return null;

  const inProgress = items
    .filter((q) => q.status === QuizStatus.IN_PROGRESS)
    .sort((a, b) =>
      new Date(b.updatedAt ?? b.createdAt ?? 0).getTime() -
      new Date(a.updatedAt ?? a.createdAt ?? 0).getTime()
    );

  return inProgress[0] ?? [...items].sort((a, b) =>
    new Date(b.updatedAt ?? b.createdAt ?? 0).getTime() -
    new Date(a.updatedAt ?? a.createdAt ?? 0).getTime()
  )[0];
});

// ── Recent quizzes table (always 5 rows, padded with nulls) ──
const recentQuizzes = computed<(Quiz | null)[]>(() => {
  const sorted = [...quizStore.items]
    .sort((a, b) =>
      new Date(b.updatedAt ?? b.createdAt ?? 0).getTime() -
      new Date(a.updatedAt ?? a.createdAt ?? 0).getTime()
    )
    .slice(0, RECENT_QUIZZES_LIMIT);
  const padded: (Quiz | null)[] = [...sorted];
  while (padded.length < RECENT_QUIZZES_LIMIT) padded.push(null);
  return padded;
});

// ── Stats ─────────────────────────────────────────────────────
const totalCount = computed(() => quizStore.items.length);
const inProgressCount = computed(
  () => quizStore.items.filter((q) => q.status === QuizStatus.IN_PROGRESS).length
);
const publishedCount = computed(
  () => quizStore.items.filter((q) => q.status === QuizStatus.PUBLISHED).length
);
const unpublishedCount = computed(
  () => quizStore.items.filter((q) => q.status === QuizStatus.UNPUBLISHED).length
);

const isLoading = computed(() => quizStore.isLoading && !quizStore.items.length);
</script>

<template>
  <div class="dash">

    <!-- ══ HERO ══════════════════════════════════════════════════ -->
    <!-- Always rendered: skeleton → empty-welcome → continue-editing -->
    <section
      class="dash-hero"
      :class="{ 'dash-hero--empty': !isLoading && !heroQuiz }"
      :aria-label="heroQuiz ? 'Continue editing' : 'Get started'"
    >

      <!-- Skeleton -->
      <template v-if="isLoading">
        <div class="hero-body">
          <div class="skel skel--eyebrow" />
          <div class="skel skel--title" />
          <div class="skel skel--meta" />
          <div class="skel skel--btn" />
        </div>
      </template>

      <!-- Empty: no quizzes yet -->
      <template v-else-if="!heroQuiz">
        <div class="hero-body">
          <p class="hero-eyebrow">
            <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <path d="M9 2.5v13M2.5 9h13" stroke-linecap="round" />
            </svg>
            Get started
          </p>
          <h1 class="hero-title">Create your first quiz</h1>
          <p class="hero-subtitle">
            Build a quiz, add questions, and publish it for others to take.
          </p>
          <RouterLink class="hero-cta" :to="{ name: 'create-quiz' }">
            Create quiz
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.64L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.16-3.96H3.75A.75.75 0 0 1 3 10Z" clip-rule="evenodd" />
            </svg>
          </RouterLink>
        </div>
        <!-- Decorative mockup (empty state) -->
        <div class="hero-mockup" aria-hidden="true">
          <div class="mockup-card">
            <div class="mockup-line mockup-line--short" />
            <div class="mockup-option">
              <span class="mockup-radio" />
              <div class="mockup-line" />
            </div>
            <div class="mockup-option">
              <span class="mockup-radio" />
              <div class="mockup-line" />
            </div>
            <div class="mockup-option">
              <span class="mockup-radio" />
              <div class="mockup-line" />
            </div>
            <div class="mockup-option">
              <span class="mockup-radio" />
              <div class="mockup-line mockup-line--short" />
            </div>
          </div>
        </div>
      </template>

      <!-- Has quiz: Continue editing -->
      <template v-else>
        <div class="hero-body">
          <p class="hero-eyebrow">
            <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <path d="M14.5 9A5.5 5.5 0 1 1 9 3.5" stroke-linecap="round" />
              <path d="M14.5 3.5v3h-3" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            Continue editing
          </p>

          <h1 class="hero-title">{{ heroQuiz.title }}</h1>

          <p class="hero-meta">
            <span>{{ heroQuiz.questions.length }} question{{ heroQuiz.questions.length !== 1 ? "s" : "" }}</span>
            <span class="hero-dot" aria-hidden="true">•</span>
            <QuizStatusBadge :status="mapStatus(heroQuiz.status)" />
          </p>

          <RouterLink
            class="hero-cta"
            :to="{ name: 'edit-quiz-questions', params: { id: heroQuiz.id } }"
          >
            Continue
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.64L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.16-3.96H3.75A.75.75 0 0 1 3 10Z" clip-rule="evenodd" />
            </svg>
          </RouterLink>
        </div>

        <!-- Floating edit button -->
        <RouterLink
          class="hero-edit-btn"
          :to="{ name: 'edit-quiz-questions', params: { id: heroQuiz.id } }"
          :aria-label="`Edit ${heroQuiz.title}`"
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7">
            <path d="M13.586 3.586a2 2 0 1 1 2.828 2.828l-.793.793-2.828-2.828.793-.793ZM11.379 5.793 3 14.172V17h2.828l8.38-8.379-2.83-2.828Z" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </RouterLink>

        <!-- Decorative quiz mockup -->
        <div class="hero-mockup" aria-hidden="true">
          <div class="mockup-card">
            <div class="mockup-line mockup-line--short" />
            <div class="mockup-option">
              <span class="mockup-radio" />
              <div class="mockup-line" />
            </div>
            <div class="mockup-option mockup-option--selected">
              <span class="mockup-radio mockup-radio--selected" />
              <div class="mockup-line mockup-line--selected" />
            </div>
            <div class="mockup-option">
              <span class="mockup-radio" />
              <div class="mockup-line" />
            </div>
            <div class="mockup-option">
              <span class="mockup-radio" />
              <div class="mockup-line mockup-line--short" />
            </div>
          </div>
        </div>
      </template>
    </section>

    <!-- ══ RECENT QUIZZES TABLE ══════════════════════════════════ -->
    <section class="dash-card" aria-labelledby="recent-heading">
      <div class="card-header">
        <h2 id="recent-heading" class="card-title">Recent quizzes</h2>
        <RouterLink class="card-link" :to="{ name: 'quizzes' }">
          View all
          <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L9.19 8 6.22 5.03a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
          </svg>
        </RouterLink>
      </div>

      <!-- Skeleton rows -->
      <AppTable
        v-if="isLoading"
        :columns="[
          { label: 'Quiz title' },
          { label: 'Subject' },
          { label: 'Questions' },
          { label: 'Status' },
          { label: 'Last updated' },
        ]"
        aria-busy="true"
      >
        <tr v-for="n in RECENT_QUIZZES_LIMIT" :key="n" aria-hidden="true">
          <td><div class="skel skel--row-xs" /></td>
          <td><div class="skel skel--row-title" /></td>
          <td><div class="skel skel--row-sm" /></td>
          <td><div class="skel skel--row-badge" /></td>
          <td><div class="skel skel--row-md" /></td>
        </tr>
      </AppTable>

      <!-- Data table (always 5 rows) -->
      <AppTable
        v-else
        first-column-variant="index"
        :columns="[
          { label: '#', class: 'col-num' },
          { label: 'Quiz title' },
          { label: 'Subject' },
          { label: 'Questions' },
          { label: 'Status' },
          { label: 'Last updated' },
        ]"
      >
        <tr
          v-for="(quiz, i) in recentQuizzes"
          :key="quiz ? quiz.id : `empty-${i}`"
          :class="{ 'row-empty': !quiz }"
        >
          <template v-if="quiz">
            <td class="col-num cell-muted">{{ i + 1 }}</td>
            <td>
              <div class="quiz-title-cell">
                <QuizIconAvatar :icon="getQuizIcon(quiz.subject)" />
                <span>{{ quiz.title }}</span>
              </div>
            </td>
            <td class="cell-muted">{{ quiz.subject ?? "Custom" }}</td>
            <td class="cell-muted">{{ quiz.questions.length }}</td>
            <td><QuizStatusBadge :status="mapStatus(quiz.status)" /></td>
            <td class="cell-muted">{{ formatDateTime(quiz.updatedAt ?? quiz.createdAt) }}</td>
          </template>
          <template v-else>
            <td colspan="6" class="cell-empty">&nbsp;</td>
          </template>
        </tr>
      </AppTable>
    </section>

    <!-- ══ STATS GRID ════════════════════════════════════════════ -->
    <section class="stats-grid" aria-label="Quiz stats overview">

      <!-- Skeleton -->
      <template v-if="isLoading">
        <div v-for="n in 4" :key="n" class="stat-card stat-card--skeleton" aria-hidden="true">
          <div class="skel skel--stat-icon" />
          <div class="stat-card__body">
            <div class="skel skel--stat-num" />
            <div class="skel skel--stat-label" />
            <div class="skel skel--stat-hint" />
          </div>
        </div>
      </template>

      <template v-else>
        <StatCard :value="totalCount" label="Total quizzes" hint="All quizzes you've created" color="green">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
            <path d="M6 3h8l4 4v14H6z" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M14 3v4h4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M9 13h6M9 17h4" stroke-linecap="round" />
          </svg>
        </StatCard>

        <StatCard :value="inProgressCount" label="In progress" hint="Being actively edited" color="amber">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
            <path d="M11 4H4v16h16v-7" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </StatCard>

        <StatCard :value="publishedCount" label="Published" hint="Publicly available" color="teal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
            <path d="M22 2 11 13" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M22 2 15 22l-4-9-9-4 20-7Z" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </StatCard>

        <StatCard :value="unpublishedCount" label="Unpublished" hint="Hidden from public" color="gray">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" stroke-linecap="round" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" stroke-linecap="round" />
            <path d="M1 1l22 22" stroke-linecap="round" />
          </svg>
        </StatCard>
      </template>
    </section>

  </div>
</template>

<style scoped>
/* ── Page shell ──────────────────────────────────────────────── */
.dash {
  display: grid;
  gap: 12px;
}

/* ══ HERO ════════════════════════════════════════════════════════ */
.dash-hero {
  position: relative;
  overflow: hidden;
  border-radius: var(--surface-radius, 20px);
  background: linear-gradient(135deg, #e8fbf2 0%, #d1f5e4 100%);
  border: 1px solid #c3f0d8;
  padding: 24px 40px;
  min-height: 150px;
  display: flex;
  align-items: center;
}

.hero-body {
  display: grid;
  gap: 12px;
  z-index: 1;
  max-width: 420px;
}

.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  font-size: 0.82rem;
  font-weight: 700;
  color: #059669;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.hero-eyebrow svg {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

.hero-title {
  margin: 0;
  font-size: 2rem;
  font-weight: 800;
  color: #182033;
  line-height: 1.15;
}

/* Empty hero: softer tint so it doesn't compete with content */
.dash-hero--empty {
  background: linear-gradient(135deg, #f0fdf8 0%, #e8fbf2 100%);
  border-color: #d1f5e4;
}

.hero-subtitle {
  margin: 0;
  font-size: 0.93rem;
  color: #4b5563;
  max-width: 380px;
  line-height: 1.6;
}

.hero-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-size: 0.93rem;
  color: #4b5563;
}

.hero-dot { color: #9ca3af; }

.hero-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  padding: 11px 22px;
  border-radius: 12px;
  background: #10b981;
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 700;
  text-decoration: none;
  width: fit-content;
  box-shadow: 0 8px 18px rgba(16, 185, 129, 0.22);
  transition:
    background-color 0.15s ease,
    transform 0.15s ease;
}

.hero-cta svg { width: 18px; height: 18px; }
.hero-cta:hover { background: #0ea873; transform: translateY(-1px); }
.hero-cta:focus-visible { outline: 2px solid #10b981; outline-offset: 2px; }

/* Floating edit button */
.hero-edit-btn {
  position: absolute;
  bottom: 36px;
  left: 400px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #10b981;
  color: #ffffff;
  display: grid;
  place-items: center;
  text-decoration: none;
  box-shadow: 0 8px 18px rgba(16, 185, 129, 0.28);
  z-index: 1;
  transition:
    background-color 0.15s ease,
    transform 0.15s ease;
}

.hero-edit-btn svg { width: 20px; height: 20px; }
.hero-edit-btn:hover { background: #0ea873; transform: translateY(-1px); }
.hero-edit-btn:focus-visible { outline: 2px solid #065f46; outline-offset: 2px; border-radius: 50%; }

/* Decorative mockup */
.hero-mockup {
  position: absolute;
  right: 48px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 0;
  pointer-events: none;
}

.mockup-card {
  width: 220px;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 16px 40px rgba(16, 60, 40, 0.1);
  padding: 20px;
  display: grid;
  gap: 10px;
}

.mockup-option {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mockup-radio {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid #d1d5db;
  flex-shrink: 0;
}

.mockup-radio--selected {
  border-color: #10b981;
  background: #10b981;
  box-shadow: inset 0 0 0 2px #fff;
}

.mockup-line {
  height: 8px;
  border-radius: 4px;
  background: #e5e7eb;
  flex: 1;
}

.mockup-line--short { flex: none; width: 60%; }

.mockup-line--selected { background: #10b981; opacity: 0.5; }

/* ══ SHARED CARD ═════════════════════════════════════════════════ */
.dash-card {
  border: var(--surface-border, 1px solid rgba(226, 223, 218, 0.92));
  border-radius: var(--surface-radius, 20px);
  background: rgba(255, 255, 255, 0.98);
  box-shadow: var(--surface-shadow, 0 10px 26px rgba(46, 35, 20, 0.06));
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px 12px;
}

.card-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #182033;
}

.card-link {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 0.88rem;
  font-weight: 600;
  color: #10b981;
  text-decoration: none;
  transition: color 0.15s ease;
}

.card-link svg { width: 15px; height: 15px; }
.card-link:hover { color: #065f46; }
.card-link:focus-visible { outline: 2px solid #10b981; outline-offset: 2px; border-radius: 3px; }

/* ══ RECENT QUIZZES TABLE ════════════════════════════════════════ */
.quiz-title-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: #182033;
  font-weight: 700;
}


.cell-muted { color: #657286; }
.col-num { width: 40px; text-align: center; }

.row-empty { pointer-events: none; }
.row-empty:hover { background: transparent !important; }
.cell-empty { height: 38px; }

/* ══ STATS GRID ══════════════════════════════════════════════════ */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.stat-card--skeleton {
  border: var(--surface-border, 1px solid rgba(226, 223, 218, 0.92));
  border-radius: var(--surface-radius, 20px);
  background: rgba(255, 255, 255, 0.98);
  box-shadow: var(--surface-shadow, 0 10px 26px rgba(46, 35, 20, 0.06));
  padding: 14px 16px;
  min-height: 68px;
}

/* ══ SKELETON SHIMMER ════════════════════════════════════════════ */
.skel {
  border-radius: 6px;
  background: linear-gradient(90deg, #f0f2f5 25%, #e4e8ed 50%, #f0f2f5 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease infinite;
}

/* Hero skeletons */
.skel--eyebrow  { height: 11px; width: 110px; }
.skel--title    { height: 32px; width: 200px; }
.skel--meta     { height: 22px; width: 160px; }
.skel--btn      { height: 42px; width: 120px; border-radius: 12px; }

/* Table row skeletons */
.skel--row-title  { height: 14px; width: 70%; }
.skel--row-sm     { height: 12px; width: 80px; }
.skel--row-xs     { height: 12px; width: 28px; }
.skel--row-badge  { height: 22px; width: 86px; border-radius: 999px; }
.skel--row-md     { height: 12px; width: 130px; }

/* Stats skeletons */
.skel--stat-icon  { width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0; }
.skel--stat-num   { height: 20px; width: 40px; margin-bottom: 2px; }
.skel--stat-label { height: 11px; width: 80px; margin-bottom: 2px; }
.skel--stat-hint  { height: 10px; width: 100px; }

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ══ RESPONSIVE ══════════════════════════════════════════════════ */
@media (max-width: 1024px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .hero-edit-btn { left: 340px; }
}

@media (max-width: 860px) {
  .dash-hero { padding: 20px 24px; }
  .hero-title { font-size: 1.6rem; }
  .hero-mockup { display: none; }
  .hero-edit-btn { display: none; }
  .card-header { padding: 18px 20px 14px; }
}

@media (max-width: 560px) {
  .stats-grid { grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  .skel { animation: none; }
  .hero-cta,
  .hero-edit-btn { transition: none; }
}
</style>
