<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { setAuthenticated } from "../services/auth-session";

const route = useRoute();
const router = useRouter();
const isUserMenuOpen = ref(false);
const isMobileNavOpen = ref(false);

const activeNav = computed(() => {
  if (route.name === "home") {
    return "home";
  }

  if (route.name === "quizzes") {
    return "quizzes";
  }

  return "";
});

function closeMenus() {
  isUserMenuOpen.value = false;
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

function toggleUserMenu() {
  isUserMenuOpen.value = !isUserMenuOpen.value;
  isMobileNavOpen.value = false;
}

function toggleMobileNav() {
  isMobileNavOpen.value = !isMobileNavOpen.value;
  isUserMenuOpen.value = false;
}

function signOut() {
  closeMenus();
  setAuthenticated(false);
  router.push({ name: "login" });
}

function handleWindowClick(event: MouseEvent) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  if (!target.closest(".user-menu")) {
    isUserMenuOpen.value = false;
  }

  if (!target.closest(".mobile-menu-button") && !target.closest(".mobile-nav-panel")) {
    isMobileNavOpen.value = false;
  }
}

watch(() => route.fullPath, closeMenus);

onMounted(() => {
  window.addEventListener("click", handleWindowClick);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", handleWindowClick);
});
</script>

<template>
  <header class="dashboard-header">
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

    <RouterLink class="brand-lockup" :to="{ name: 'home' }" @click="closeMenus">
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

      <div class="user-menu">
        <button
          class="user-menu-trigger"
          type="button"
          :aria-expanded="isUserMenuOpen"
          aria-label="Open account menu"
          @click.stop="toggleUserMenu"
        >
          <span class="user-avatar" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="8" r="4.5" />
              <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
            </svg>
          </span>
          <svg
            class="user-menu-chevron"
            :class="{ 'is-open': isUserMenuOpen }"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path d="m7 10 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>

        <div v-if="isUserMenuOpen" class="user-menu-popover">
          <button class="user-menu-item" type="button" @click="navigateToProfile">Profile</button>
          <button class="user-menu-item" type="button" @click="signOut">Sign out</button>
        </div>
      </div>
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
        :to="{ name: 'home' }"
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
    </nav>
  </header>
</template>
