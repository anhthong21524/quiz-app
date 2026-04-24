<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { QuizStatus } from "@quiz-app/shared";
import { useQuizStore } from "../stores/quizzes";

type StatCard = {
  title: string;
  value: number;
  description: string;
  tone: "green" | "amber" | "gray";
  icon: "document" | "edit" | "publish" | "hidden";
};

type RecentQuiz = {
  title: string;
  subject: string;
  questions: number;
  status: "Published" | "In progress" | "Unpublished";
  updatedAt: string;
  actionLabel: string;
  icon: "math" | "science" | "geography" | "english" | "biology";
  action: () => void;
};

const router = useRouter();
const quizStore = useQuizStore();

onMounted(async () => {
  if (!quizStore.items.length) {
    await quizStore.loadQuizzes();
  }
});

const latestInProgressQuiz = computed(() =>
  [...quizStore.items]
    .filter((quiz) => quiz.status === QuizStatus.IN_PROGRESS && quiz.id)
    .sort((left, right) => {
      const leftTime = new Date(left.updatedAt ?? left.createdAt ?? 0).getTime();
      const rightTime = new Date(right.updatedAt ?? right.createdAt ?? 0).getTime();
      return rightTime - leftTime;
    })[0] ?? null
);

function goToMyQuizzes() {
  router.push({ name: "quizzes" });
}

function goToLatestQuiz() {
  const latestQuizId = latestInProgressQuiz.value?.id;
  if (latestQuizId) {
    router.push({ name: "edit-quiz", params: { id: latestQuizId } });
    return;
  }

  router.push({ name: "create-quiz" });
}

const statCards = computed<StatCard[]>(() => [
  {
    title: "Total quizzes",
    value: 24,
    description: "All quizzes you've created",
    tone: "green",
    icon: "document"
  },
  {
    title: "In progress",
    value: 8,
    description: "Drafts being edited",
    tone: "amber",
    icon: "edit"
  },
  {
    title: "Published",
    value: 11,
    description: "Publicly available",
    tone: "green",
    icon: "publish"
  },
  {
    title: "Unpublished",
    value: 5,
    description: "Hidden from public",
    tone: "gray",
    icon: "hidden"
  }
]);

const recentQuizzes = computed<RecentQuiz[]>(() => [
  {
    title: "Mathematics Quiz #1",
    subject: "Mathematics",
    questions: 20,
    status: "Published",
    updatedAt: "May 15, 2024 • 2:30 PM",
    actionLabel: "View",
    icon: "math",
    action: goToMyQuizzes
  },
  {
    title: "Chemistry Basics",
    subject: "Science",
    questions: 15,
    status: "In progress",
    updatedAt: "May 14, 2024 • 11:45 AM",
    actionLabel: "Continue",
    icon: "science",
    action: goToLatestQuiz
  },
  {
    title: "World Capitals Quiz",
    subject: "Geography",
    questions: 10,
    status: "Published",
    updatedAt: "May 13, 2024 • 9:20 AM",
    actionLabel: "View",
    icon: "geography",
    action: goToMyQuizzes
  },
  {
    title: "English Grammar Practice",
    subject: "English",
    questions: 25,
    status: "Unpublished",
    updatedAt: "May 12, 2024 • 4:10 PM",
    actionLabel: "Edit",
    icon: "english",
    action: goToMyQuizzes
  },
  {
    title: "Biology MCQs",
    subject: "Science",
    questions: 18,
    status: "In progress",
    updatedAt: "May 11, 2024 • 3:05 PM",
    actionLabel: "Continue",
    icon: "biology",
    action: goToLatestQuiz
  }
]);

const recentQuizzesPreview = computed(() => recentQuizzes.value.slice(0, 3));

const featuredQuiz = computed(() =>
  latestInProgressQuiz.value
    ? {
        title: latestInProgressQuiz.value.title,
        questions: latestInProgressQuiz.value.questions.length
      }
    : {
        title: "Chemistry Basics",
        questions: 15
      }
);
</script>

<template>
  <section class="home-dashboard">
    <article class="hero-card">
      <div class="hero-copy">
        <div class="hero-kicker">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12a7 7 0 1 1-2.05-4.95" stroke-linecap="round" />
            <path d="M19 5v5h-5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span>Continue editing</span>
        </div>

        <h1>{{ featuredQuiz.title }}</h1>

        <div class="hero-meta">
          <span>{{ featuredQuiz.questions }} questions</span>
          <span class="hero-meta-dot"></span>
          <span class="hero-status-badge">In progress</span>
        </div>

        <div class="hero-actions">
          <button class="hero-button hero-button-primary" type="button" @click="goToLatestQuiz">
            <span>Continue</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h13" stroke-linecap="round" />
              <path d="m13 6 6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div class="hero-visual" aria-hidden="true">
        <div class="hero-blob"></div>
        <div class="hero-orbit"></div>
        <div class="hero-spark hero-spark-left"></div>
        <div class="hero-spark hero-spark-right"></div>
        <div class="hero-leaf"></div>
        <div class="hero-icon hero-icon-edit">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
            <path d="m5 19 3.6-.8 8.9-8.9a2.1 2.1 0 1 0-3-3l-8.9 8.9L5 19Z" stroke-linejoin="round" />
            <path d="m13.5 7.5 3 3" stroke-linecap="round" />
          </svg>
        </div>

        <div class="quiz-preview">
          <div class="preview-heading"></div>
          <div class="preview-option">
            <span></span>
            <div></div>
          </div>
          <div class="preview-option is-correct">
            <span></span>
            <div></div>
          </div>
          <div class="preview-option">
            <span></span>
            <div></div>
          </div>
          <div class="preview-option">
            <span></span>
            <div></div>
          </div>
          <div class="preview-option">
            <span></span>
            <div></div>
          </div>
        </div>
      </div>
    </article>

    <section class="recent-card">
      <div class="recent-header">
        <h2>Recent quizzes</h2>
        <button class="recent-link" type="button" @click="goToMyQuizzes">
          <span>View all</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="m9 6 6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>

      <div class="recent-table-shell">
        <table class="recent-table">
          <thead>
            <tr>
              <th>Quiz title</th>
              <th>Subject</th>
              <th>Questions</th>
              <th>Status</th>
              <th>Last updated</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="quiz in recentQuizzesPreview"
              :key="quiz.title"
              :class="{ 'is-highlighted': quiz.title === featuredQuiz.title }"
            >
              <td data-label="Quiz title">
                <div class="quiz-title-cell">
                  <span class="table-icon" :class="`is-${quiz.icon}`">
                    <svg
                      v-if="quiz.icon === 'math'"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.7"
                    >
                      <path d="M7.5 6.5h9v11h-9z" opacity="0.3" />
                      <path d="m9 10 2 4 2-8 2 12" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <svg
                      v-else-if="quiz.icon === 'science'"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.7"
                    >
                      <path d="M9 4h6M10 4v5l-4.5 7.2A2 2 0 0 0 7.2 19h9.6a2 2 0 0 0 1.7-2.8L14 9V4" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <svg
                      v-else-if="quiz.icon === 'geography'"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.7"
                    >
                      <circle cx="12" cy="12" r="8" />
                      <path d="M4 12h16M12 4a13 13 0 0 1 0 16M12 4a13 13 0 0 0 0 16" stroke-linecap="round" />
                    </svg>
                    <svg
                      v-else-if="quiz.icon === 'english'"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.7"
                    >
                      <path d="M6 5.5A2.5 2.5 0 0 1 8.5 3H18v15.5A2.5 2.5 0 0 0 15.5 16H6z" stroke-linejoin="round" />
                      <path d="M6 5.5V21a2.5 2.5 0 0 1 2.5-2.5H18" stroke-linejoin="round" />
                    </svg>
                    <svg
                      v-else
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.7"
                    >
                      <path d="M8 4c0 2-2 2.5-2 5s2 3 2 5-2 2.5-2 5" stroke-linecap="round" />
                      <path d="M16 4c0 2-2 2.5-2 5s2 3 2 5-2 2.5-2 5" stroke-linecap="round" />
                      <path d="M9 8h6M9 16h6" stroke-linecap="round" />
                    </svg>
                  </span>
                  <span>{{ quiz.title }}</span>
                </div>
              </td>
              <td data-label="Subject">{{ quiz.subject }}</td>
              <td data-label="Questions">{{ quiz.questions }}</td>
              <td data-label="Status">
                <span class="status-badge" :class="`is-${quiz.status.toLowerCase().replace(' ', '-')}`">
                  {{ quiz.status }}
                </span>
              </td>
              <td data-label="Last updated">{{ quiz.updatedAt }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="stats-grid" aria-label="Dashboard statistics">
      <article
        v-for="stat in statCards"
        :key="stat.title"
        class="stat-card"
        :class="`is-${stat.tone}`"
      >
        <div class="stat-icon">
          <svg
            v-if="stat.icon === 'document'"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path d="M8 3.5h6l4 4V20a1 1 0 0 1-1 1H8a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2Z" />
            <path d="M14 3.5V8h4" />
            <path d="M9 11h6M9 15h6" stroke-linecap="round" />
          </svg>
          <svg
            v-else-if="stat.icon === 'edit'"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path d="m4 20 4.5-1 9-9a2.12 2.12 0 0 0-3-3l-9 9L4 20Z" stroke-linejoin="round" />
            <path d="m13.5 7.5 3 3" stroke-linecap="round" />
          </svg>
          <svg
            v-else-if="stat.icon === 'publish'"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path d="m4 12 15-7-4.5 14-3.5-4.5L4 12Z" stroke-linejoin="round" />
          </svg>
          <svg
            v-else
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path d="M3 3 21 21" stroke-linecap="round" />
            <path
              d="M10.6 10.7A3 3 0 0 0 15 13.9M9.1 4.3A10.2 10.2 0 0 1 12 4c6.6 0 10 8 10 8a17.3 17.3 0 0 1-3.5 4.5M6.2 6.3C3.8 8 2 12 2 12a18.5 18.5 0 0 0 10 6c1.4 0 2.7-.2 3.8-.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div class="stat-copy">
          <strong>{{ stat.value }}</strong>
          <h2>{{ stat.title }}</h2>
          <p>{{ stat.description }}</p>
        </div>
      </article>
    </section>
  </section>
</template>

<style scoped>
.home-dashboard {
  display: grid;
  gap: 20px;
}

.hero-card,
.stat-card,
.recent-card {
  background: #ffffff;
  border: var(--surface-border);
  border-radius: var(--surface-radius);
  box-shadow: var(--surface-shadow);
}

.hero-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 0.85fr);
  gap: 16px;
  padding: 34px 30px;
  overflow: hidden;
  background:
    radial-gradient(circle at left top, rgba(233, 248, 238, 0.9), transparent 40%),
    linear-gradient(180deg, #f8fffb 0%, #f7fffa 100%);
}

.hero-copy {
  display: grid;
  align-content: center;
  gap: 16px;
  min-height: 230px;
}

.hero-kicker {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #10b981;
  font-size: 1.15rem;
  font-weight: 700;
}

.hero-kicker svg {
  width: 20px;
  height: 20px;
}

.hero-copy h1 {
  margin: 0;
  max-width: 460px;
  color: #182033;
  font-size: 3rem;
  line-height: 1.08;
  letter-spacing: 0;
}

.hero-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
  color: #556276;
  font-size: 1rem;
}

.hero-meta-dot {
  width: 5px;
  height: 5px;
  border-radius: 999px;
  background: #8e98a7;
}

.hero-status-badge {
  min-height: 38px;
  padding: 7px 16px;
  border-radius: 12px;
  background: #fff2e3;
  color: #d97706;
  font-weight: 700;
}

.hero-actions {
  display: flex;
  gap: 12px;
}

.hero-button {
  min-height: 48px;
  padding: 0 24px;
  border-radius: 14px;
  border: 1.5px solid transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-weight: 700;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.hero-button svg {
  width: 18px;
  height: 18px;
}

.hero-button:hover {
  transform: translateY(-1px);
}

.hero-button-primary {
  background: #10b981;
  color: #ffffff;
  box-shadow: 0 14px 24px rgba(16, 185, 129, 0.18);
}

.hero-button-primary:hover {
  background: #0ea873;
}

.hero-visual {
  position: relative;
  min-height: 230px;
}

.hero-blob {
  position: absolute;
  top: -2px;
  right: 58px;
  width: 255px;
  height: 230px;
  border-radius: 999px;
  background:
    radial-gradient(circle at 70% 25%, rgba(255, 255, 255, 0.78), transparent 26%),
    linear-gradient(135deg, rgba(229, 250, 236, 0.98), rgba(237, 250, 241, 0.88));
}

.hero-orbit {
  position: absolute;
  top: 26px;
  left: 10px;
  width: 325px;
  height: 155px;
  border-top: 1.5px dashed rgba(171, 215, 191, 0.45);
  border-right: 1.5px dashed rgba(171, 215, 191, 0.45);
  border-radius: 999px;
  transform: rotate(12deg);
}

.hero-spark {
  position: absolute;
  width: 10px;
  height: 10px;
  background: rgba(148, 221, 182, 0.65);
  clip-path: polygon(50% 0%, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0% 50%, 38% 38%);
}

.hero-spark-left {
  left: 2px;
  top: 150px;
}

.hero-spark-right {
  right: 20px;
  top: 42px;
  background: rgba(255, 205, 109, 0.78);
}

.hero-leaf {
  position: absolute;
  right: -4px;
  bottom: -8px;
  width: 96px;
  height: 90px;
  opacity: 0.52;
}

.hero-leaf::before,
.hero-leaf::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(190, 238, 206, 0.55), rgba(207, 243, 217, 0.4));
  clip-path: ellipse(32% 48% at 35% 52%);
}

.hero-leaf::after {
  left: 28px;
  top: 10px;
  clip-path: ellipse(28% 44% at 45% 52%);
}

.hero-icon,
.quiz-preview {
  position: absolute;
  border-radius: 14px;
  box-shadow: 0 16px 26px rgba(82, 68, 37, 0.08);
}

.hero-icon {
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
}

.hero-icon svg {
  width: 30px;
  height: 30px;
}

.hero-icon-edit {
  left: 42px;
  bottom: 44px;
  background: #52d68f;
  color: #ffffff;
}

.quiz-preview {
  top: 4px;
  right: 74px;
  width: min(100%, 300px);
  padding: 24px 24px 20px;
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid rgba(219, 228, 231, 0.96);
}

.preview-heading {
  width: 94px;
  height: 12px;
  margin-bottom: 22px;
  border-radius: 999px;
  background: linear-gradient(90deg, #e7e7ee 0%, #ececf2 100%);
}

.preview-option {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.preview-option:last-child {
  margin-bottom: 0;
}

.preview-option span {
  width: 20px;
  height: 20px;
  border-radius: 999px;
  border: 1.5px solid #d9dde5;
}

.preview-option div {
  flex: 1;
  height: 10px;
  border-radius: 999px;
  background: linear-gradient(90deg, #e8e8ef 0%, #ededf3 80%);
}

.preview-option.is-correct span {
  border-color: #10b981;
  background: radial-gradient(circle at center, #10b981 0, #10b981 39%, transparent 41%);
}

.preview-option.is-correct div {
  max-width: 200px;
}

.recent-card {
  padding: 14px 0 10px;
  overflow: hidden;
}

.recent-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 30px 10px;
}

.recent-header h2,
.stat-copy h2 {
  margin: 0;
  color: #1c2433;
}

.recent-link {
  border: 0;
  background: transparent;
  color: #10b981;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
}

.recent-link svg {
  width: 18px;
  height: 18px;
}

.recent-table-shell {
  width: 100%;
  overflow-x: auto;
}

.recent-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 980px;
}

.recent-table th,
.recent-table td {
  padding: 12px 30px;
  text-align: left;
  border-top: 1px solid #edf0f2;
}

.recent-table th {
  color: #8a93a3;
  font-size: 0.9rem;
  font-weight: 500;
}

.recent-table td {
  color: #293246;
  font-size: 0.97rem;
}

.recent-table tbody tr.is-highlighted {
  background: #f6fbf7;
}

.quiz-title-cell {
  display: flex;
  align-items: center;
  gap: 14px;
  font-weight: 700;
}

.table-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: grid;
  place-items: center;
}

.table-icon svg {
  width: 22px;
  height: 22px;
}

.table-icon.is-math {
  background: #f4edff;
  color: #8b5cf6;
}

.table-icon.is-science {
  background: #e9fbf2;
  color: #10b981;
}

.table-icon.is-geography {
  background: #ecf3ff;
  color: #1d7cf2;
}

.table-icon.is-english {
  background: #fff0f2;
  color: #ef4444;
}

.table-icon.is-biology {
  background: #fff4e5;
  color: #f59e0b;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  font-weight: 700;
}

.status-badge::before {
  content: "";
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: currentColor;
}

.status-badge.is-published {
  background: #ebfbf2;
  color: #10b981;
}

.status-badge.is-in-progress {
  background: #fff5e7;
  color: #d97706;
}

.status-badge.is-unpublished {
  background: #f2f4f7;
  color: #6b7280;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 18px;
  min-height: 138px;
  padding: 24px;
}

.stat-icon {
  flex-shrink: 0;
  width: 76px;
  height: 76px;
  border-radius: 999px;
  display: grid;
  place-items: center;
}

.stat-icon svg {
  width: 34px;
  height: 34px;
}

.stat-copy {
  display: grid;
  gap: 4px;
}

.stat-copy strong {
  font-size: 2.35rem;
  line-height: 1;
}

.stat-copy h2 {
  font-size: 0.98rem;
}

.stat-copy p {
  margin: 0;
  color: #657286;
  line-height: 1.55;
}

.stat-card.is-green .stat-icon {
  background: #e8fbf2;
  color: #10b981;
}

.stat-card.is-green .stat-copy strong {
  color: #10b981;
}

.stat-card.is-amber .stat-icon {
  background: #fff6e8;
  color: #f59e0b;
}

.stat-card.is-amber .stat-copy strong {
  color: #f59e0b;
}

.stat-card.is-gray .stat-icon {
  background: #f3f4f6;
  color: #6b7280;
}

.stat-card.is-gray .stat-copy strong {
  color: #6b7280;
}

@media (max-width: 1120px) {
  .hero-card {
    grid-template-columns: 1fr;
  }

  .hero-visual {
    min-height: 280px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
  }
}

@media (max-width: 720px) {
  .hero-card {
    padding: 26px 22px;
  }

  .hero-copy h1 {
    font-size: 2.15rem;
  }

  .hero-actions {
    flex-direction: column;
  }

  .hero-button {
    width: 100%;
  }

  .hero-visual {
    min-height: 260px;
  }

  .hero-blob {
    right: 22px;
    width: 220px;
    height: 190px;
  }

  .hero-icon-edit {
    left: 12px;
    bottom: 18px;
  }

  .quiz-preview {
    right: 12px;
    width: auto;
  }

  .recent-header {
    padding: 0 18px 14px;
  }

  .recent-table-shell {
    overflow: visible;
  }

  .recent-table,
  .recent-table thead,
  .recent-table tbody,
  .recent-table tr,
  .recent-table td {
    display: block;
  }

  .recent-table {
    min-width: 0;
  }

  .recent-table thead {
    display: none;
  }

  .recent-table tbody {
    padding: 0 14px 10px;
  }

  .recent-table tr {
    margin-bottom: 14px;
    border: 1px solid #edf0f2;
    border-radius: 16px;
    background: #ffffff;
    box-shadow: 0 8px 22px rgba(34, 24, 12, 0.04);
    overflow: hidden;
  }

  .recent-table td {
    border-top: 1px solid #f1f3f5;
    padding: 14px 18px;
  }

  .recent-table td:first-child {
    border-top: 0;
  }

  .recent-table td::before {
    content: attr(data-label);
    display: block;
    margin-bottom: 6px;
    color: #8a93a3;
    font-size: 0.82rem;
    font-weight: 600;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
