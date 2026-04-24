const AUTH_STORAGE_KEY = "quiz-app-authenticated";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

export function isAuthenticated() {
  if (!canUseStorage()) {
    return false;
  }

  return window.sessionStorage.getItem(AUTH_STORAGE_KEY) === "true";
}

export function setAuthenticated(value: boolean) {
  if (!canUseStorage()) {
    return;
  }

  if (value) {
    window.sessionStorage.setItem(AUTH_STORAGE_KEY, "true");
    return;
  }

  window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
}
