import { computed, ref } from "vue";

export type AppTheme = "light" | "dark";

const STORAGE_KEY = "quiz-app.public-theme";
const DEFAULT_THEME: AppTheme = "light";

function normalizeTheme(value?: string | null): AppTheme {
  return value === "dark" ? "dark" : DEFAULT_THEME;
}

function readInitialTheme(): AppTheme {
  if (typeof window === "undefined") {
    return DEFAULT_THEME;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (stored) {
    return normalizeTheme(stored);
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export const activeTheme = ref<AppTheme>(readInitialTheme());

export function setTheme(theme: AppTheme) {
  activeTheme.value = theme;

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, theme);
  }
}

export function toggleTheme() {
  setTheme(activeTheme.value === "dark" ? "light" : "dark");
}

export function useTheme() {
  return {
    theme: computed(() => activeTheme.value),
    isDark: computed(() => activeTheme.value === "dark"),
    setTheme,
    toggleTheme
  };
}
