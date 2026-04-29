<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import AppHeader from "./components/AppHeader.vue";
import AppToastList from "./components/AppToastList.vue";
import GlobalLoadingBar from "./components/GlobalLoadingBar.vue";
import { useTheme } from "./composables/useTheme";
import { useI18n } from "./i18n";

const route = useRoute();
const { t } = useI18n();
const { theme } = useTheme();
const useBareLayout = computed(() => route.meta.bareLayout === true);
const usePublicLayout = computed(() =>
  route.name === "home" ||
  route.name === "public-quizzes" ||
  route.name === "about" ||
  route.name === "user-guideline" ||
  route.name === "login" ||
  route.name === "public-quiz" ||
  route.name === "public-quiz-take" ||
  route.name === "private-quiz-entry"
);
const useQuizTakingLayout = computed(() => route.name === "public-quiz-take");
const currentYear = new Date().getFullYear();
</script>

<template>
  <GlobalLoadingBar />
  <AppToastList />

  <RouterView v-if="useBareLayout" />

  <div
    v-else
    class="app-shell"
    :class="{
      'public-shell': usePublicLayout,
      'public-theme-dark': theme === 'dark',
      'quiz-taking-shell': useQuizTakingLayout
    }"
  >
    <AppHeader />

    <main
      class="app-content"
      :class="{ 'public-content': usePublicLayout, 'quiz-taking-content': useQuizTakingLayout }"
    >
      <RouterView />
    </main>

    <footer
      class="app-footer"
      :class="{ 'public-footer': usePublicLayout, 'quiz-taking-footer': useQuizTakingLayout }"
    >
      <div class="app-footer-inner">
        <span class="app-footer-copy">
          &copy; {{ currentYear }} {{ t("common.appName") }} &mdash; {{ t("footer.tagline") }}
        </span>
      </div>
    </footer>
  </div>
</template>
