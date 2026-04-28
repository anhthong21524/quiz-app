import { createApp } from "vue";
import { createPinia } from "pinia";
import type { AuthUser } from "@quiz-app/shared";
import App from "./App.vue";
import { router } from "./router";
import { configureAuthCallbacks } from "./services/http";
import { useAuthStore } from "./stores/auth";
import "./styles.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

const authStore = useAuthStore();

configureAuthCallbacks({
  getTokens: () => ({
    accessToken: authStore.accessToken,
    refreshToken: authStore.refreshToken
  }),
  onTokenRefreshed: (accessToken, refreshToken, user) => {
    const mergedUser: AuthUser = { ...(authStore.user ?? {}), ...user };
    authStore.setSession({ accessToken, refreshToken, user: mergedUser });
  },
  onAuthFailure: () => {
    authStore.clearSession();
    router.replace({ name: "login" });
  }
});

app.mount("#app");
