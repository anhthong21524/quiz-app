<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import AppHeader from "./components/AppHeader.vue";

const route = useRoute();
const useBareLayout = computed(() => route.meta.bareLayout === true);
</script>

<template>
  <RouterView v-if="useBareLayout" />

  <div v-else class="app-shell">
    <AppHeader />

    <main class="app-content">
      <RouterView />
    </main>

    <footer class="app-footer">
      <span>&copy; 2026 Quiz App</span>
    </footer>
  </div>
</template>
