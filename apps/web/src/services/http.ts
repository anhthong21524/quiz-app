import axios from "axios";
import { env } from "../config/env";
import { normalizeApiError } from "../lib/api/errors";

const STORAGE_KEY = "quiz_app_auth";

export const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 10000
});

// Separate instance for token refresh to avoid interceptor loops
const refreshClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 10000
});

type RefreshSubscriber = (token: string) => void;
let isRefreshing = false;
let refreshSubscribers: RefreshSubscriber[] = [];

function notifySubscribers(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

function getStoredAuth(): { accessToken: string | null; refreshToken: string | null } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { accessToken: null, refreshToken: null };
    return JSON.parse(raw);
  } catch {
    return { accessToken: null, refreshToken: null };
  }
}

httpClient.interceptors.request.use((config) => {
  const { accessToken } = getStoredAuth();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve) => {
        refreshSubscribers.push(resolve);
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return httpClient(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { refreshToken } = getStoredAuth();
      if (!refreshToken) throw new Error("No refresh token.");

      const response = await refreshClient.post<{
        accessToken: string;
        refreshToken: string;
        user: { email: string; avatarUrl?: string };
      }>("/auth/refresh", { refreshToken });

      const { accessToken, refreshToken: newRefreshToken, user } = response.data;

      try {
        const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
        const nextUser = { ...(existing.user ?? {}), ...user };
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ ...existing, accessToken, refreshToken: newRefreshToken, user: nextUser })
        );
      } catch {
        // storage unavailable
      }

      notifySubscribers(accessToken);
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return httpClient(originalRequest);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      window.location.href = "/login";
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
);

// Normalization interceptor — runs after the 401 refresh interceptor.
// Every error that escapes the refresh logic is converted into an AppError here,
// so all catch blocks in stores/components receive a consistent shape.
httpClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeApiError(error))
);
