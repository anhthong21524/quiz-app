import { defineStore } from "pinia";
import { AuthUser } from "@quiz-app/shared";
import {
  getMe as apiGetMe,
  login as apiLogin,
  logout as apiLogout,
  refreshToken as apiRefresh,
  register as apiRegister,
  uploadAvatar as apiUploadAvatar
} from "../services/auth-api";

type AuthStatus = "authenticated" | "unauthenticated";

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  status: AuthStatus;
}

interface StoredAuth {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const STORAGE_KEY = "quiz_app_auth";

function loadFromStorage(): StoredAuth {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { user: null, accessToken: null, refreshToken: null };
    return JSON.parse(raw) as StoredAuth;
  } catch {
    return { user: null, accessToken: null, refreshToken: null };
  }
}

function saveToStorage(data: StoredAuth) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage unavailable
  }
}

function clearStorage() {
  localStorage.removeItem(STORAGE_KEY);
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => {
    const saved = loadFromStorage();
    return {
      user: saved.user,
      accessToken: saved.accessToken,
      refreshToken: saved.refreshToken,
      status: saved.accessToken ? "authenticated" : "unauthenticated"
    };
  },
  getters: {
    isAuthenticated: (state): boolean =>
      state.status === "authenticated" && !!state.accessToken,
    isAdmin: (state): boolean => state.user?.isAdmin === true
  },
  actions: {
    async login(email: string, password: string) {
      const result = await apiLogin({ email, password });
      this.user = result.user;
      this.accessToken = result.accessToken;
      this.refreshToken = result.refreshToken;
      this.status = "authenticated";
      saveToStorage({ user: result.user, accessToken: result.accessToken, refreshToken: result.refreshToken });
    },

    async register(email: string, password: string) {
      const result = await apiRegister({ email, password });
      this.user = result.user;
      this.accessToken = result.accessToken;
      this.refreshToken = result.refreshToken;
      this.status = "authenticated";
      saveToStorage({ user: result.user, accessToken: result.accessToken, refreshToken: result.refreshToken });
    },

    setSession(data: { accessToken: string; refreshToken: string; user: AuthUser | null }) {
      this.user = data.user;
      this.accessToken = data.accessToken;
      this.refreshToken = data.refreshToken;
      this.status = "authenticated";
      saveToStorage({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken });
    },

    async syncProfile() {
      if (!this.accessToken) return;
      try {
        const profile = await apiGetMe();
        this.user = { ...this.user, ...profile };
        saveToStorage({ user: this.user, accessToken: this.accessToken, refreshToken: this.refreshToken });
      } catch {
        // non-fatal — keep existing user data
      }
    },

    async updateAvatar(avatarUrl: string) {
      if (!this.user) return;
      const result = await apiUploadAvatar(avatarUrl);
      this.user = { ...this.user, avatarUrl: result.avatarUrl };
      saveToStorage({ user: this.user, accessToken: this.accessToken, refreshToken: this.refreshToken });
    },

    async logout() {
      if (this.refreshToken) {
        try {
          await apiLogout(this.refreshToken);
        } catch {
          // ignore — clear locally regardless
        }
      }
      this.clearSession();
    },

    async refresh(): Promise<string> {
      if (!this.refreshToken) throw new Error("No refresh token available.");
      const result = await apiRefresh(this.refreshToken);
      this.user = result.user;
      this.accessToken = result.accessToken;
      this.refreshToken = result.refreshToken;
      this.status = "authenticated";
      saveToStorage({ user: result.user, accessToken: result.accessToken, refreshToken: result.refreshToken });
      return result.accessToken;
    },

    clearSession() {
      this.user = null;
      this.accessToken = null;
      this.refreshToken = null;
      this.status = "unauthenticated";
      clearStorage();
    }
  }
});
