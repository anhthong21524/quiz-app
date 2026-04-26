<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import AppHeader from "./components/AppHeader.vue";
import AppToastList from "./components/AppToastList.vue";
import GlobalLoadingBar from "./components/GlobalLoadingBar.vue";

const route = useRoute();
const useBareLayout = computed(() => route.meta.bareLayout === true);
const usePublicLayout = computed(() =>
  route.name === "home" ||
  route.name === "public-quizzes" ||
  route.name === "about" ||
  route.name === "login" ||
  route.name === "public-quiz" ||
  route.name === "public-quiz-take"
);
</script>

<template>
  <GlobalLoadingBar />
  <AppToastList />

  <RouterView v-if="useBareLayout" />

  <div v-else class="app-shell" :class="{ 'public-shell': usePublicLayout }">
    <AppHeader />

    <main class="app-content" :class="{ 'public-content': usePublicLayout }">
      <RouterView />
    </main>

    <footer class="app-footer" :class="{ 'public-footer': usePublicLayout }">
      <span>&copy; 2026 Quiz App</span>
    </footer>
  </div>
</template>
