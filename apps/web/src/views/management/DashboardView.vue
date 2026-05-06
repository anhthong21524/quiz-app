<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { RouterLink, type RouteLocationRaw } from "vue-router";
import { QuizStatus, type Quiz } from "@quiz-app/shared";
import AppTable from "../../components/AppTable.vue";
import StatCard from "../../components/StatCard.vue";
import QuizIconAvatar from "../../components/my-quizzes/QuizIconAvatar.vue";
import QuizStatusBadge from "../../components/my-quizzes/QuizStatusBadge.vue";
import { useI18n } from "../../i18n";
import { getQuizIcon, mapQuizStatus } from "../../lib/quiz-helpers";
import { useQuizStore } from "../../stores/quizzes";
import { fetchResultsSummary } from "../../services/quiz-api";
import { userGuidelineContent } from "../public/userGuidelineContent";

const quizStore = useQuizStore();
const RECENT_QUIZZES_LIMIT = 5;
const GUIDE_AUTOPLAY_DELAY_MS = 7000;

const totalSubmissions = ref<number | null>(null);
const currentSlideIndex = ref(0);
const { locale, t, formatDateTime: formatLocalizedDateTime } = useI18n();

let autoplayTimer: number | null = null;

async function loadDashboardData() {
  const quizzesPromise = !quizStore.items.length && !quizStore.isLoading
    ? quizStore.loadQuizzes()
    : Promise.resolve();
  const [, summary] = await Promise.all([quizzesPromise, fetchResultsSummary()]);
  totalSubmissions.value = summary.totalSubmissions;
}

onMounted(() => {
  void loadDashboardData();
  startAutoplay();
});

onUnmounted(() => {
  stopAutoplay();
});

function formatDateTime(value?: string) {
  if (!value) return "--";
  return formatLocalizedDateTime(value, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

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

const totalCount = computed(() => quizStore.items.length);
const inProgressCount = computed(
  () => quizStore.items.filter((q) => q.status === QuizStatus.IN_PROGRESS).length
);
const publishedCount = computed(
  () => quizStore.items.filter((q) => q.status === QuizStatus.PUBLISHED).length
);

const isLoading = computed(() => quizStore.isLoading && !quizStore.items.length);

type ManagementGuideSlide = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  highlights: string[];
  imageSrc: string;
  imageAlt: string;
  imageCaption: string;
  ctaLabel: string;
  to: RouteLocationRaw;
  theme: "green" | "teal" | "amber" | "blue";
};

const guideContent = computed(() => userGuidelineContent[locale.value]);

const guideSlides = computed<ManagementGuideSlide[]>(() => {
  const guide = guideContent.value;
  const isVietnamese = locale.value === "vi";

  return [
    {
      id: "dashboard",
      eyebrow: guide.badge,
      title: guide.creator.dashboard.title,
      description: guide.creator.dashboard.intro,
      highlights: guide.creator.dashboard.cards.map((card) => card.title),
      imageSrc: guide.creator.dashboardShot.src,
      imageAlt: guide.creator.dashboardShot.alt,
      imageCaption: guide.creator.dashboardShot.caption,
      ctaLabel: t("navigation.myQuizzes"),
      to: { name: "quizzes" },
      theme: "green"
    },
    {
      id: "my-quizzes",
      eyebrow: guide.badge,
      title: t("myQuizzes.title"),
      description: t("myQuizzes.description"),
      highlights: isVietnamese
        ? [
            "Tìm nhanh theo tiêu đề và môn học.",
            "Lọc bài nháp hoặc bài đã xuất bản theo trạng thái.",
            "Chỉnh sửa, xuất bản và chia sẻ ngay từ từng bài."
          ]
        : [
            "Search quickly by title and subject.",
            "Filter drafts or published quizzes by status.",
            "Edit, publish, and share directly from each quiz."
          ],
      imageSrc: "/guide-images/my-quizzes.jpg",
      imageAlt: isVietnamese ? "Trang Bài của tôi" : "My Quizzes page",
      imageCaption: isVietnamese
        ? "Quản lý toàn bộ bài trắc nghiệm ở một nơi với tìm kiếm, bộ lọc và thao tác nhanh."
        : "Manage every quiz in one place with search, filters, and quick actions.",
      ctaLabel: t("navigation.myQuizzes"),
      to: { name: "quizzes" },
      theme: "teal"
    },
    {
      id: "create",
      eyebrow: guide.badge,
      title: guide.creator.createFlow.title,
      description: guide.creator.createFlow.intro,
      highlights: guide.creator.createFlow.cards.map((card) => card.title),
      imageSrc: guide.creator.createShot.src,
      imageAlt: guide.creator.createShot.alt,
      imageCaption: guide.creator.createShot.caption,
      ctaLabel: t("navigation.createQuiz"),
      to: { name: "create-quiz" },
      theme: "amber"
    },
    {
      id: "results",
      eyebrow: guide.badge,
      title: guide.creator.results.title,
      description: guide.creator.results.intro,
      highlights: guide.creator.results.cards.map((card) => card.title),
      imageSrc: guide.creator.resultsShot.src,
      imageAlt: guide.creator.resultsShot.alt,
      imageCaption: guide.creator.resultsShot.caption,
      ctaLabel: t("navigation.results"),
      to: { name: "results" },
      theme: "blue"
    }
  ];
});

const currentSlide = computed(() => guideSlides.value[currentSlideIndex.value] ?? guideSlides.value[0]);

const carouselLabels = computed(() =>
  locale.value === "vi"
    ? {
        region: "Thanh trình chiếu hướng dẫn quản lý Quiz App",
        previous: "Slide trước",
        next: "Slide tiếp theo",
        openGuide: "Xem hướng dẫn đầy đủ",
        goTo: "Chuyển tới slide"
      }
    : {
        region: "Quiz App management guide carousel",
        previous: "Previous slide",
        next: "Next slide",
        openGuide: "Open full guide",
        goTo: "Go to slide"
      }
);

function stopAutoplay() {
  if (autoplayTimer !== null) {
    window.clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
}

function startAutoplay() {
  stopAutoplay();

  if (guideSlides.value.length < 2) {
    return;
  }

  autoplayTimer = window.setInterval(() => {
    nextSlide(false);
  }, GUIDE_AUTOPLAY_DELAY_MS);
}

function pauseAutoplay() {
  stopAutoplay();
}

function resumeAutoplay() {
  startAutoplay();
}

function setSlide(index: number) {
  currentSlideIndex.value = index;
  startAutoplay();
}

function nextSlide(resetAutoplay = true) {
  if (!guideSlides.value.length) return;

  currentSlideIndex.value = (currentSlideIndex.value + 1) % guideSlides.value.length;

  if (resetAutoplay) {
    startAutoplay();
  }
}

function previousSlide() {
  if (!guideSlides.value.length) return;

  currentSlideIndex.value =
    (currentSlideIndex.value - 1 + guideSlides.value.length) % guideSlides.value.length;
  startAutoplay();
}

watch(guideSlides, (slides) => {
  if (!slides.length) {
    currentSlideIndex.value = 0;
    stopAutoplay();
    return;
  }

  if (currentSlideIndex.value >= slides.length) {
    currentSlideIndex.value = 0;
  }

  startAutoplay();
});
</script>

<template>
  <div class="dash">
    <section
      class="dash-hero"
      :class="`dash-hero--${currentSlide.theme}`"
      :aria-label="carouselLabels.region"
    >
      <template v-if="isLoading">
        <div class="hero-slide hero-slide--loading">
          <div class="hero-body">
            <div class="skel skel--eyebrow" />
            <div class="skel skel--title" />
            <div class="skel skel--meta" />
            <div class="skel skel--tag-row" />
            <div class="skel skel--btn" />
          </div>
          <div class="hero-preview">
            <div class="skel skel--image" />
          </div>
        </div>
      </template>

      <template v-else>
        <div class="hero-slider" @mouseenter="pauseAutoplay" @mouseleave="resumeAutoplay">
          <div class="hero-viewport">
            <Transition name="hero-fade" mode="out-in">
              <article :key="currentSlide.id" class="hero-slide">
                <div class="hero-body">
                  <p class="hero-eyebrow">
                    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                      <path d="M9 2.5 10.6 6l3.9.4-2.9 2.6.8 3.8L9 11l-3.5 1.8.8-3.8-2.9-2.6L7.4 6 9 2.5Z" stroke-linejoin="round" />
                    </svg>
                    {{ currentSlide.eyebrow }}
                  </p>

                  <div class="hero-heading">
                    <h1 class="hero-title">{{ currentSlide.title }}</h1>
                    <span class="hero-counter">
                      {{ String(currentSlideIndex + 1).padStart(2, "0") }}
                      /
                      {{ String(guideSlides.length).padStart(2, "0") }}
                    </span>
                  </div>

                  <p class="hero-subtitle">{{ currentSlide.description }}</p>

                  <ul class="hero-highlights">
                    <li v-for="highlight in currentSlide.highlights" :key="highlight">
                      <span class="highlight-dot" aria-hidden="true" />
                      {{ highlight }}
                    </li>
                  </ul>

                  <div class="hero-actions">
                    <RouterLink class="hero-cta" :to="currentSlide.to">
                      {{ currentSlide.ctaLabel }}
                      <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.64L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.16-3.96H3.75A.75.75 0 0 1 3 10Z" clip-rule="evenodd" />
                      </svg>
                    </RouterLink>

                    <a
                      class="hero-secondary"
                      href="/guide"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {{ carouselLabels.openGuide }}
                    </a>
                  </div>
                </div>

                <div class="hero-preview">
                  <div class="preview-card">
                    <img
                      class="preview-image"
                      :src="currentSlide.imageSrc"
                      :alt="currentSlide.imageAlt"
                    />
                    <p class="preview-caption">{{ currentSlide.imageCaption }}</p>
                  </div>
                </div>
              </article>
            </Transition>
          </div>

          <div class="hero-controls">
            <button
              type="button"
              class="hero-nav"
              :aria-label="carouselLabels.previous"
              @click="previousSlide"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M11.78 4.22a.75.75 0 0 1 0 1.06L8.81 8.25h7.44a.75.75 0 0 1 0 1.5H8.81l2.97 2.97a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" />
              </svg>
            </button>

            <div class="hero-dots">
              <button
                v-for="(slide, index) in guideSlides"
                :key="slide.id"
                type="button"
                class="hero-dot-btn"
                :class="{ 'hero-dot-btn--active': index === currentSlideIndex }"
                :aria-label="`${carouselLabels.goTo} ${index + 1}: ${slide.title}`"
                @click="setSlide(index)"
              />
            </div>

            <button
              type="button"
              class="hero-nav"
              :aria-label="carouselLabels.next"
              @click="nextSlide()"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M8.22 4.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06l2.97-2.97H3.75a.75.75 0 0 1 0-1.5h7.44L8.22 5.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </template>
    </section>

    <section class="stats-grid" :aria-label="t('dashboard.stats.overviewAria')">
      <template v-if="isLoading">
        <div v-for="n in 4" :key="n" class="stat-card stat-card--skeleton" aria-hidden="true">
          <div class="skel skel--stat-icon" />
          <div class="stat-card__body">
            <div class="skel skel--stat-num" />
            <div class="skel skel--stat-label" />
          </div>
        </div>
      </template>

      <template v-else>
        <StatCard :value="totalCount" :label="t('dashboard.stats.totalQuizzes')" color="green">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
            <path d="M6 3h8l4 4v14H6z" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M14 3v4h4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M9 13h6M9 17h4" stroke-linecap="round" />
          </svg>
        </StatCard>

        <StatCard :value="inProgressCount" :label="t('dashboard.stats.inProgress')" color="amber">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
            <path d="M11 4H4v16h16v-7" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </StatCard>

        <StatCard :value="publishedCount" :label="t('dashboard.stats.published')" color="green">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
            <path d="M22 2 11 13" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M22 2 15 22l-4-9-9-4 20-7Z" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </StatCard>

        <StatCard :value="totalSubmissions ?? '--'" :label="t('dashboard.stats.totalSubmissions')" color="teal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke-linecap="round" stroke-linejoin="round" />
            <circle cx="9" cy="7" r="4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </StatCard>
      </template>
    </section>

    <section class="dash-card" aria-labelledby="recent-heading">
      <div class="card-header">
        <h2 id="recent-heading" class="card-title">{{ t("dashboard.recent.title") }}</h2>
        <RouterLink class="card-link" :to="{ name: 'quizzes' }">
          {{ t("dashboard.recent.viewAll") }}
          <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L9.19 8 6.22 5.03a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
          </svg>
        </RouterLink>
      </div>

      <AppTable
        v-if="isLoading"
        :columns="[
          { label: t('dashboard.recent.columns.quizTitle') },
          { label: t('dashboard.recent.columns.subject') },
          { label: t('dashboard.recent.columns.questions') },
          { label: t('dashboard.recent.columns.status') },
          { label: t('dashboard.recent.columns.lastUpdated') }
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

      <AppTable
        v-else
        first-column-variant="index"
        :columns="[
          { label: t('dashboard.recent.columns.number'), class: 'col-num' },
          { label: t('dashboard.recent.columns.quizTitle') },
          { label: t('dashboard.recent.columns.subject') },
          { label: t('dashboard.recent.columns.questions') },
          { label: t('dashboard.recent.columns.status') },
          { label: t('dashboard.recent.columns.lastUpdated') }
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
            <td class="cell-muted">{{ quiz.subject ?? t("dashboard.recent.customSubject") }}</td>
            <td class="cell-muted">{{ quiz.questions.length }}</td>
            <td><QuizStatusBadge :status="mapQuizStatus(quiz.status)" /></td>
            <td class="cell-muted">{{ formatDateTime(quiz.updatedAt ?? quiz.createdAt) }}</td>
          </template>
          <template v-else>
            <td colspan="6" class="cell-empty">&nbsp;</td>
          </template>
        </tr>
      </AppTable>
    </section>
  </div>
</template>

<style scoped>
.dash {
  display: grid;
  gap: 12px;
}

.dash-hero {
  position: relative;
  overflow: hidden;
  border-radius: var(--surface-radius, 20px);
  background: linear-gradient(135deg, var(--hero-bg-start) 0%, var(--hero-bg-end) 100%);
  border: 1px solid var(--hero-border);
  padding: 22px 28px 18px;
  min-height: 286px;
  display: grid;
  gap: 16px;
  transition:
    background 0.25s ease,
    border-color 0.25s ease;
  --hero-bg-start: #effdf6;
  --hero-bg-end: #d6f7e7;
  --hero-border: #bfead4;
  --hero-accent: #10b981;
  --hero-accent-strong: #0f9f72;
}

.dash-hero::before {
  content: "";
  position: absolute;
  inset: auto -70px -100px auto;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.58) 0%, rgba(255, 255, 255, 0) 72%);
  pointer-events: none;
}

.dash-hero--green {
  --hero-bg-start: #effdf6;
  --hero-bg-end: #d6f7e7;
  --hero-border: #bfead4;
  --hero-accent: #10b981;
  --hero-accent-strong: #0f9f72;
}

.dash-hero--teal {
  --hero-bg-start: #eefcfb;
  --hero-bg-end: #d7f4f1;
  --hero-border: #b9e6e1;
  --hero-accent: #0d9488;
  --hero-accent-strong: #0b7f75;
}

.dash-hero--amber {
  --hero-bg-start: #fff9ef;
  --hero-bg-end: #ffeccf;
  --hero-border: #f4ddaf;
  --hero-accent: #d97706;
  --hero-accent-strong: #b65f00;
}

.dash-hero--blue {
  --hero-bg-start: #f1f7ff;
  --hero-bg-end: #dbeafe;
  --hero-border: #bed8f7;
  --hero-accent: #2563eb;
  --hero-accent-strong: #1d4ed8;
}

.hero-slider {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 14px;
}

.hero-viewport {
  min-height: 252px;
}

.hero-slide {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 360px);
  gap: 28px;
  align-items: center;
  width: 100%;
}

.hero-slide--loading {
  width: 100%;
}

.hero-body {
  display: grid;
  gap: 14px;
  max-width: 560px;
}

.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--hero-accent);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.hero-eyebrow svg {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

.hero-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.hero-title {
  margin: 0;
  font-size: 1.85rem;
  font-weight: 800;
  color: #182033;
  line-height: 1.15;
  max-width: 420px;
}

.hero-counter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 66px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.85);
  font-size: 0.8rem;
  font-weight: 800;
  color: #314155;
}

.hero-subtitle {
  margin: 0;
  font-size: 0.93rem;
  color: #4b5563;
  line-height: 1.6;
}

.hero-highlights {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 0;
  padding: 0;
}

.hero-highlights li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.82);
  color: #314155;
  font-size: 0.82rem;
  font-weight: 600;
}

.highlight-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--hero-accent);
  flex-shrink: 0;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.hero-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 12px;
  background: var(--hero-accent);
  color: #ffffff;
  font-size: 0.92rem;
  font-weight: 700;
  text-decoration: none;
  width: fit-content;
  box-shadow: 0 10px 22px rgba(24, 32, 51, 0.12);
  transition:
    background-color 0.15s ease,
    transform 0.15s ease;
}

.hero-cta svg {
  width: 18px;
  height: 18px;
}

.hero-cta:hover {
  background: var(--hero-accent-strong);
  transform: translateY(-1px);
}

.hero-cta:focus-visible {
  outline: 2px solid var(--hero-accent);
  outline-offset: 2px;
}

.hero-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  border-radius: 12px;
  border: 1px solid rgba(24, 32, 51, 0.12);
  background: rgba(255, 255, 255, 0.72);
  color: #223046;
  font-size: 0.9rem;
  font-weight: 700;
  text-decoration: none;
  transition:
    border-color 0.15s ease,
    transform 0.15s ease;
}

.hero-secondary:hover {
  border-color: rgba(24, 32, 51, 0.2);
  transform: translateY(-1px);
}

.hero-secondary:focus-visible {
  outline: 2px solid var(--hero-accent);
  outline-offset: 2px;
}

.hero-preview {
  display: flex;
  justify-content: flex-end;
}

.preview-card {
  position: relative;
  width: min(100%, 360px);
  overflow: hidden;
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.85);
  box-shadow: 0 16px 36px rgba(23, 34, 51, 0.14);
}

.preview-image {
  display: block;
  width: 100%;
  height: 228px;
  object-fit: cover;
  object-position: center top;
}

.preview-caption {
  position: absolute;
  inset: auto 0 0 0;
  margin: 0;
  padding: 18px 18px 16px;
  color: #ffffff;
  font-size: 0.82rem;
  line-height: 1.5;
  background: linear-gradient(180deg, rgba(13, 22, 38, 0) 0%, rgba(13, 22, 38, 0.82) 100%);
}

.hero-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 14px;
}

.hero-nav {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: 1px solid rgba(24, 32, 51, 0.12);
  background: rgba(255, 255, 255, 0.72);
  color: #223046;
  display: inline-grid;
  place-items: center;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    border-color 0.15s ease,
    background-color 0.15s ease;
}

.hero-nav svg {
  width: 18px;
  height: 18px;
}

.hero-nav:hover {
  transform: translateY(-1px);
  border-color: rgba(24, 32, 51, 0.2);
  background: rgba(255, 255, 255, 0.9);
}

.hero-nav:focus-visible {
  outline: 2px solid var(--hero-accent);
  outline-offset: 2px;
}

.hero-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex: 1;
}

.hero-dot-btn {
  width: 10px;
  height: 10px;
  border: 0;
  border-radius: 999px;
  background: rgba(24, 32, 51, 0.18);
  cursor: pointer;
  transition:
    width 0.18s ease,
    background-color 0.18s ease,
    transform 0.18s ease;
}

.hero-dot-btn:hover {
  transform: scale(1.06);
}

.hero-dot-btn--active {
  width: 34px;
  background: var(--hero-accent);
}

.hero-dot-btn:focus-visible {
  outline: 2px solid var(--hero-accent);
  outline-offset: 2px;
}

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

.card-link svg {
  width: 15px;
  height: 15px;
}

.card-link:hover {
  color: #065f46;
}

.card-link:focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 2px;
  border-radius: 3px;
}

.quiz-title-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: #182033;
  font-weight: 700;
}

.cell-muted {
  color: #657286;
}

.col-num {
  width: 40px;
  text-align: center;
}

.row-empty {
  pointer-events: none;
}

.row-empty:hover {
  background: transparent !important;
}

.cell-empty {
  height: 38px;
}

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

.skel {
  border-radius: 6px;
  background: linear-gradient(90deg, #f0f2f5 25%, #e4e8ed 50%, #f0f2f5 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease infinite;
}

.skel--eyebrow {
  height: 11px;
  width: 110px;
}

.skel--title {
  height: 32px;
  width: 200px;
}

.skel--meta {
  height: 22px;
  width: 160px;
}

.skel--tag-row {
  height: 34px;
  width: 320px;
  border-radius: 999px;
}

.skel--btn {
  height: 42px;
  width: 120px;
  border-radius: 12px;
}

.skel--image {
  height: 228px;
  width: min(100%, 360px);
  border-radius: 18px;
  justify-self: end;
}

.skel--row-title {
  height: 14px;
  width: 70%;
}

.skel--row-sm {
  height: 12px;
  width: 80px;
}

.skel--row-xs {
  height: 12px;
  width: 28px;
}

.skel--row-badge {
  height: 22px;
  width: 86px;
  border-radius: 999px;
}

.skel--row-md {
  height: 12px;
  width: 130px;
}

.skel--stat-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  flex-shrink: 0;
}

.skel--stat-num {
  height: 20px;
  width: 40px;
  margin-bottom: 2px;
}

.skel--stat-label {
  height: 11px;
  width: 80px;
  margin-bottom: 2px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .hero-viewport {
    min-height: 0;
  }

  .hero-slide {
    grid-template-columns: 1fr;
  }

  .hero-preview {
    justify-content: flex-start;
  }

  .preview-card {
    width: min(100%, 520px);
  }

  .skel--image {
    width: min(100%, 520px);
    justify-self: start;
  }
}

@media (max-width: 860px) {
  .dash-hero {
    padding: 18px 20px 16px;
    min-height: 0;
  }

  .hero-title {
    font-size: 1.5rem;
  }

  .hero-heading {
    flex-direction: column;
    align-items: flex-start;
  }

  .hero-preview {
    display: none;
  }

  .card-header {
    padding: 18px 20px 14px;
  }
}

@media (max-width: 560px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .hero-highlights li {
    width: 100%;
  }

  .hero-controls {
    gap: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skel {
    animation: none;
  }

  .dash-hero,
  .hero-cta,
  .hero-secondary,
  .hero-nav,
  .hero-dot-btn {
    transition: none;
  }
}

.hero-fade-enter-active,
.hero-fade-leave-active {
  transition: opacity 0.18s ease;
}

.hero-fade-enter-from,
.hero-fade-leave-to {
  opacity: 0;
}
</style>
