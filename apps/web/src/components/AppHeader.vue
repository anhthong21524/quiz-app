<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { useTheme } from "../composables/useTheme";
import { useAuthStore } from "../stores/auth";
import { useI18n, type SupportedLocale } from "../i18n";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const { locale, setLocale, t } = useI18n();
const { isDark, toggleTheme } = useTheme();
const isMobileNavOpen = ref(false);
const isPublicPage = computed(() =>
  route.name === "home" ||
  route.name === "public-quizzes" ||
  route.name === "about" ||
  route.name === "user-guideline" ||
  route.name === "login" ||
  route.name === "public-quiz" ||
  route.name === "public-quiz-take" ||
  route.name === "user-quiz" ||
  route.name === "user-quiz-take"
);

const username = computed(() => {
  const email = authStore.user?.email?.trim();

  if (!email) {
    return t("common.quizFallbackUser");
  }

  const [emailName] = email.split("@");
  return emailName || email;
});

const avatarUrl = computed(() => authStore.user?.avatarUrl ?? "");
const localeOptions = computed(() => [
  { value: "en", label: "EN" },
  { value: "vi", label: "VI" }
]);
const themeToggleLabel = computed(() =>
  isDark.value ? t("header.switchToLightTheme") : t("header.switchToDarkTheme")
);
const isManagementEditor = computed(
  () => route.name === "create-quiz" || route.name === "edit-quiz-questions"
);

onMounted(() => {
  if (authStore.isAuthenticated) {
    void authStore.syncProfile();
  }
});

const activeNav = computed(() => {
  if (route.name === "home") {
    return "home";
  }

  if (route.name === "public-quizzes" || route.name === "public-quiz-take" || route.name === "quizzes") {
    return "quizzes";
  }

  if (route.name === "results" || route.name === "result-quiz-detail") {
    return "results";
  }

  if (route.name === "about") {
    return "about";
  }

  if (route.name === "user-guideline") {
    return "user-guideline";
  }

  return "";
});

function closeMenus() {
  isMobileNavOpen.value = false;
}

function navigateToEditor() {
  closeMenus();
  router.push({ name: "create-quiz" });
}

function navigateToProfile() {
  closeMenus();
  router.push({ name: "profile" });
}

function toggleMobileNav() {
  isMobileNavOpen.value = !isMobileNavOpen.value;
}

function handleLocaleChange(event: Event) {
  const nextLocale = (event.target as HTMLSelectElement).value as SupportedLocale;
  setLocale(nextLocale);
}

async function signOut() {
  closeMenus();
  await authStore.logout();
  router.push({ name: "login" });
}

watch(() => route.fullPath, closeMenus);
</script>

<template>
  <header v-if="isPublicPage" class="public-header">
    <div class="public-header-inner">
      <button
        class="public-mobile-menu-button"
        type="button"
        :aria-expanded="isMobileNavOpen"
        aria-controls="public-mobile-navigation"
        :aria-label="t('header.openNavigation')"
        @click.stop="toggleMobileNav"
      >
        <svg
          v-if="!isMobileNavOpen"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.9"
        >
          <path d="M5 7h14M5 12h14M5 17h14" stroke-linecap="round" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
          <path d="m7 7 10 10M17 7 7 17" stroke-linecap="round" />
        </svg>
      </button>

      <RouterLink class="public-brand-lockup" :to="{ name: 'home' }" @click="closeMenus">
        <div class="public-brand-badge" aria-hidden="true">Q</div>
        <span class="public-brand-name">{{ t("common.appName") }}</span>
      </RouterLink>

      <nav class="public-nav" :aria-label="t('header.publicNav')">
        <RouterLink
          class="public-nav-link"
          :class="{ 'is-active': activeNav === 'home' }"
          :to="{ name: 'home' }"
        >
          {{ t("navigation.home") }}
        </RouterLink>
        <RouterLink
          class="public-nav-link"
          :class="{ 'is-active': activeNav === 'quizzes' }"
          :to="{ name: 'public-quizzes' }"
        >
          {{ t("navigation.quizzes") }}
        </RouterLink>
        <RouterLink
          class="public-nav-link"
          :class="{ 'is-active': activeNav === 'about' }"
          :to="{ name: 'about' }"
        >
          {{ t("navigation.about") }}
        </RouterLink>
        <RouterLink
          class="public-nav-link"
          :class="{ 'is-active': activeNav === 'user-guideline' }"
          :to="{ name: 'user-guideline' }"
        >
          {{ t("navigation.guide") }}
        </RouterLink>
      </nav>

      <div class="public-header-actions">
        <label class="header-locale-switcher">
          <span class="sr-only">{{ t("common.locale.label") }}</span>
          <select class="header-locale-select" :value="locale" @change="handleLocaleChange">
            <option v-for="option in localeOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </label>

        <button
          class="public-icon-button"
          :class="{ 'is-active': isDark }"
          type="button"
          :aria-label="themeToggleLabel"
          :title="themeToggleLabel"
          @click="toggleTheme"
        >
          <svg
            v-if="isDark"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.9"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="4.5" />
            <path
              d="M12 2.75v2.5M12 18.75v2.5M5.46 5.46l1.76 1.76M16.78 16.78l1.76 1.76M2.75 12h2.5M18.75 12h2.5M5.46 18.54l1.76-1.76M16.78 7.22l1.76-1.76"
              stroke-linecap="round"
            />
          </svg>
          <svg
            v-else
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.9"
            aria-hidden="true"
          >
            <path
              d="M20 15.2A7.9 7.9 0 0 1 8.8 4a8.5 8.5 0 1 0 11.2 11.2Z"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <RouterLink class="public-login-button" :to="{ name: 'login' }" @click="closeMenus">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
            <path d="M4.5 21a7.5 7.5 0 0 1 15 0" stroke-linecap="round" />
          </svg>
          <span>{{ t("navigation.login") }}</span>
        </RouterLink>
      </div>

      <nav
        v-if="isMobileNavOpen"
        id="public-mobile-navigation"
        class="public-mobile-nav-panel"
        :aria-label="t('header.mobilePublicNav')"
      >
        <RouterLink
          class="public-mobile-nav-link"
          :class="{ 'is-active': activeNav === 'home' }"
          :to="{ name: 'home' }"
          @click="closeMenus"
        >
          {{ t("navigation.home") }}
        </RouterLink>
        <RouterLink
          class="public-mobile-nav-link"
          :class="{ 'is-active': activeNav === 'quizzes' }"
          :to="{ name: 'public-quizzes' }"
          @click="closeMenus"
        >
          {{ t("navigation.quizzes") }}
        </RouterLink>
        <RouterLink
          class="public-mobile-nav-link"
          :class="{ 'is-active': activeNav === 'about' }"
          :to="{ name: 'about' }"
          @click="closeMenus"
        >
          {{ t("navigation.about") }}
        </RouterLink>
        <RouterLink
          class="public-mobile-nav-link"
          :class="{ 'is-active': activeNav === 'user-guideline' }"
          :to="{ name: 'user-guideline' }"
          @click="closeMenus"
        >
          {{ t("navigation.guide") }}
        </RouterLink>
      </nav>
    </div>
  </header>

  <header v-else class="dashboard-header">
    <button
      class="mobile-menu-button"
      type="button"
      :aria-expanded="isMobileNavOpen"
      aria-controls="mobile-navigation"
      :aria-label="t('header.openNavigation')"
      @click.stop="toggleMobileNav"
    >
      <svg
        v-if="!isMobileNavOpen"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.9"
      >
        <path d="M5 7h14M5 12h14M5 17h14" stroke-linecap="round" />
      </svg>
      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
        <path d="m7 7 10 10M17 7 7 17" stroke-linecap="round" />
      </svg>
    </button>

    <RouterLink
      class="brand-lockup"
      :to="{ name: 'management' }"
      :title="t('header.managementHomeTitle')"
      :aria-label="t('header.managementHomeAria')"
      @click="closeMenus"
    >
      <div class="brand-badge" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M8 5h8" stroke-linecap="round" />
          <path d="M10 5v9a2 2 0 1 0 4 0V5" stroke-linecap="round" />
          <path d="M7 19h10" stroke-linecap="round" />
        </svg>
      </div>
      <span class="brand-name">{{ t("common.appName") }}</span>
    </RouterLink>

    <nav class="dashboard-nav" :aria-label="t('header.dashboardNav')">
      <RouterLink
        class="nav-link"
        :class="{ 'is-active': activeNav === 'quizzes' }"
        :to="{ name: 'quizzes' }"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M7 4.75h10" stroke-linecap="round" />
          <path d="M7 9.75h10" stroke-linecap="round" />
          <path d="M7 14.75h10" stroke-linecap="round" />
          <path d="M5 4.75h.01M5 9.75h.01M5 14.75h.01" stroke-linecap="round" />
          <path d="M4 3h16v18H4z" stroke-linejoin="round" opacity="0.3" />
        </svg>
        <span>{{ t("navigation.myQuizzes") }}</span>
      </RouterLink>
      <RouterLink
        class="nav-link"
        :class="{ 'is-active': activeNav === 'results' }"
        :to="{ name: 'results' }"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M7 19V11M12 19V5M17 19v-8" stroke-linecap="round" />
          <path d="M4 19h16" stroke-linecap="round" opacity="0.4" />
        </svg>
        <span>{{ t("navigation.quizResults") }}</span>
      </RouterLink>
    </nav>

    <div class="header-actions" :class="{ 'header-actions--editor': isManagementEditor }">
      <button
        class="header-create-button"
        type="button"
        :aria-label="t('navigation.createQuiz')"
        @click="navigateToEditor"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M12 5v14M5 12h14" stroke-linecap="round" />
        </svg>
        <span class="header-create-label">{{ t("navigation.createQuiz") }}</span>
      </button>

      <label class="header-locale-switcher">
        <span class="sr-only">{{ t("common.locale.label") }}</span>
        <select class="header-locale-select" :value="locale" @change="handleLocaleChange">
          <option v-for="option in localeOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>

      <button
        class="dashboard-icon-button"
        :class="{ 'is-active': isDark }"
        type="button"
        :aria-label="themeToggleLabel"
        :title="themeToggleLabel"
        @click="toggleTheme"
      >
        <svg
          v-if="isDark"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.9"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4.5" />
          <path
            d="M12 2.75v2.5M12 18.75v2.5M5.46 5.46l1.76 1.76M16.78 16.78l1.76 1.76M2.75 12h2.5M18.75 12h2.5M5.46 18.54l1.76-1.76M16.78 7.22l1.76-1.76"
            stroke-linecap="round"
          />
        </svg>
        <svg
          v-else
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.9"
          aria-hidden="true"
        >
          <path
            d="M20 15.2A7.9 7.9 0 0 1 8.8 4a8.5 8.5 0 1 0 11.2 11.2Z"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <button
        class="user-profile-button"
        type="button"
        :aria-label="t('header.openAccountMenu')"
        @click="navigateToProfile"
      >
        <span class="user-menu-trigger">
          <span class="user-avatar" aria-hidden="true">
            <img v-if="avatarUrl" :src="avatarUrl" alt="" />
            <svg v-else viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="8" r="4.5" />
              <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
            </svg>
          </span>
          <span class="user-greeting">{{ t("header.greeting", { name: username }) }}</span>
        </span>
      </button>

      <button class="header-signout-button" type="button" @click="signOut">
        {{ t("navigation.signOut") }}
      </button>
    </div>

    <nav
      v-if="isMobileNavOpen"
      id="mobile-navigation"
      class="mobile-nav-panel"
      :aria-label="t('header.mobileDashboardNav')"
    >
      <RouterLink
        class="mobile-nav-link"
        :class="{ 'is-active': activeNav === 'home' }"
        :to="{ name: 'quizzes' }"
        @click="closeMenus"
      >
        {{ t("navigation.dashboard") }}
      </RouterLink>
      <RouterLink
        class="mobile-nav-link"
        :class="{ 'is-active': activeNav === 'quizzes' }"
        :to="{ name: 'quizzes' }"
        @click="closeMenus"
      >
        {{ t("navigation.myQuizzes") }}
      </RouterLink>
      <RouterLink
        class="mobile-nav-link"
        :class="{ 'is-active': activeNav === 'results' }"
        :to="{ name: 'results' }"
        @click="closeMenus"
      >
        {{ t("navigation.quizResults") }}
      </RouterLink>
      <RouterLink class="mobile-nav-link" :to="{ name: 'profile' }" @click="closeMenus">
        {{ t("settings.navigation.profile") }}
      </RouterLink>
      <button class="mobile-nav-link mobile-nav-action" type="button" @click="signOut">
        {{ t("navigation.signOut") }}
      </button>
    </nav>
  </header>
</template>
