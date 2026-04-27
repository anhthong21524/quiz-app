<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const isMobileNavOpen = ref(false);
const isPublicPage = computed(() =>
  route.name === "home" ||
  route.name === "public-quizzes" ||
  route.name === "about" ||
  route.name === "login" ||
  route.name === "public-quiz" ||
  route.name === "public-quiz-take" ||
  route.name === "private-quiz-entry"
);

const username = computed(() => {
  const email = authStore.user?.email?.trim();

  if (!email) {
    return "User";
  }

  const [emailName] = email.split("@");
  return emailName || email;
});

const avatarUrl = computed(() => authStore.user?.avatarUrl ?? "");

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
        aria-label="Open navigation menu"
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
        <span class="public-brand-name">Quiz App</span>
      </RouterLink>

      <nav class="public-nav" aria-label="Primary">
        <RouterLink
          class="public-nav-link"
          :class="{ 'is-active': activeNav === 'home' }"
          :to="{ name: 'home' }"
        >
          Home
        </RouterLink>
        <RouterLink
          class="public-nav-link"
          :class="{ 'is-active': activeNav === 'quizzes' }"
          :to="{ name: 'public-quizzes' }"
        >
          Quizzes
        </RouterLink>
        <RouterLink
          class="public-nav-link"
          :class="{ 'is-active': activeNav === 'about' }"
          :to="{ name: 'about' }"
        >
          About
        </RouterLink>
      </nav>

      <div class="public-header-actions">
        <button class="public-icon-button" type="button" aria-label="Dark mode">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M20.4 14.8A7.4 7.4 0 0 1 9.2 3.6 8.5 8.5 0 1 0 20.4 14.8Z" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <RouterLink class="public-login-button" :to="{ name: 'login' }" @click="closeMenus">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
            <path d="M4.5 21a7.5 7.5 0 0 1 15 0" stroke-linecap="round" />
          </svg>
          <span>Login</span>
        </RouterLink>
      </div>

      <nav
        v-if="isMobileNavOpen"
        id="public-mobile-navigation"
        class="public-mobile-nav-panel"
        aria-label="Mobile primary"
      >
        <RouterLink
          class="public-mobile-nav-link"
          :class="{ 'is-active': activeNav === 'home' }"
          :to="{ name: 'home' }"
          @click="closeMenus"
        >
          Home
        </RouterLink>
        <RouterLink
          class="public-mobile-nav-link"
          :class="{ 'is-active': activeNav === 'quizzes' }"
          :to="{ name: 'public-quizzes' }"
          @click="closeMenus"
        >
          Quizzes
        </RouterLink>
        <RouterLink
          class="public-mobile-nav-link"
          :class="{ 'is-active': activeNav === 'about' }"
          :to="{ name: 'about' }"
          @click="closeMenus"
        >
          About
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
      aria-label="Open navigation menu"
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
      title="Go to management home"
      aria-label="Quiz App — go to management home"
      @click="closeMenus"
    >
      <div class="brand-badge" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M8 5h8" stroke-linecap="round" />
          <path d="M10 5v9a2 2 0 1 0 4 0V5" stroke-linecap="round" />
          <path d="M7 19h10" stroke-linecap="round" />
        </svg>
      </div>
      <span class="brand-name">Quiz App</span>
    </RouterLink>

    <nav class="dashboard-nav" aria-label="Primary">
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
        <span>My Quizzes</span>
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
        <span>Quiz Results</span>
      </RouterLink>
    </nav>

    <div class="header-actions">
      <button
        class="header-create-button"
        type="button"
        aria-label="Create quiz"
        @click="navigateToEditor"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M12 5v14M5 12h14" stroke-linecap="round" />
        </svg>
        <span class="header-create-label">Create quiz</span>
      </button>

      <button
        class="user-profile-button"
        type="button"
        aria-label="Open account menu"
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
          <span class="user-greeting">
            Hi <span class="user-greeting-name">{{ username }}</span>
          </span>
        </span>
      </button>

      <button class="header-signout-button" type="button" @click="signOut">Sign out</button>
    </div>

    <nav
      v-if="isMobileNavOpen"
      id="mobile-navigation"
      class="mobile-nav-panel"
      aria-label="Mobile primary"
    >
      <RouterLink
        class="mobile-nav-link"
        :class="{ 'is-active': activeNav === 'home' }"
        :to="{ name: 'quizzes' }"
        @click="closeMenus"
      >
        Dashboard
      </RouterLink>
      <RouterLink
        class="mobile-nav-link"
        :class="{ 'is-active': activeNav === 'quizzes' }"
        :to="{ name: 'quizzes' }"
        @click="closeMenus"
      >
        My Quizzes
      </RouterLink>
      <RouterLink
        class="mobile-nav-link"
        :class="{ 'is-active': activeNav === 'results' }"
        :to="{ name: 'results' }"
        @click="closeMenus"
      >
        Quiz Results
      </RouterLink>
    </nav>
  </header>
</template>
