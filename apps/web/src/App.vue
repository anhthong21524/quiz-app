<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const useBareLayout = computed(() => route.meta.bareLayout === true);
</script>

<template>
  <RouterView v-if="useBareLayout" />

  <div v-else class="shell">
    <header class="topbar">
      <div>
        <p class="eyebrow">Production-ready starter</p>
        <h1>Quiz App</h1>
      </div>
      <nav class="nav">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/quizzes">My Quizzes</RouterLink>
        <RouterLink to="/editor">Quiz Editor</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
      </nav>
    </header>

    <main class="content">
      <RouterView />
    </main>
  </div>
</template>
