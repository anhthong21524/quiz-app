<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { setAuthenticated } from "./services/auth-session";

const route = useRoute();
const router = useRouter();
const useBareLayout = computed(() => route.meta.bareLayout === true);
const isUserMenuOpen = ref(false);

const activeNav = computed(() => {
  if (route.name === "quizzes") {
    return "quizzes";
  }

  return "";
});

function navigateToEditor() {
  router.push({ name: "create-quiz" });
}

function navigateToQuizzes() {
  isUserMenuOpen.value = false;
  router.push({ name: "quizzes" });
}

function toggleUserMenu() {
  isUserMenuOpen.value = !isUserMenuOpen.value;
}

function signOut() {
  isUserMenuOpen.value = false;
  setAuthenticated(false);
  router.push({ name: "login" });
}

function handleWindowClick(event: MouseEvent) {
  const target = event.target;
  if (!(target instanceof HTMLElement) || target.closest(".user-menu")) {
    return;
  }

  isUserMenuOpen.value = false;
}

onMounted(() => {
  window.addEventListener("click", handleWindowClick);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", handleWindowClick);
});
</script>

<template>
  <RouterView v-if="useBareLayout" />

  <div v-else class="app-shell">
    <header class="dashboard-header">
      <RouterLink class="brand-lockup" :to="{ name: 'home' }">
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
        <button class="header-create-button" type="button" @click="navigateToEditor">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M12 5v14M5 12h14" stroke-linecap="round" />
          </svg>
          <span>Create quiz</span>
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
            <button class="user-menu-item" type="button" @click="navigateToQuizzes">
              My Quizzes
            </button>
            <button class="user-menu-item" type="button" @click="signOut">Sign out</button>
          </div>
        </div>
      </div>
    </header>

    <main class="app-content">
      <RouterView />
    </main>

    <footer class="app-footer">
      <span>&copy; 2026 Quiz App</span>
    </footer>
  </div>
</template>
