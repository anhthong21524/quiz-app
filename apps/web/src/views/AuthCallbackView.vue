<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
  const accessToken = route.query.accessToken as string | undefined;
  const refreshToken = route.query.refreshToken as string | undefined;
  const email = route.query.email as string | undefined;

  if (accessToken && refreshToken) {
    authStore.setSession({
      accessToken,
      refreshToken,
      user: email ? { email } : null
    });
    await authStore.syncProfile();
    await router.replace({ name: "quizzes" });
  } else {
    await router.replace({ name: "login" });
  }
});
</script>

<template>
  <div class="callback-page">
    <span class="spinner" aria-label="Signing in…"></span>
  </div>
</template>

<style scoped>
.callback-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #f0eeeb;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(16, 185, 129, 0.2);
  border-top-color: #10b981;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
