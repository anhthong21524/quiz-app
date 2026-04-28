import { computed, ref } from "vue";
import { messages, type SupportedLocale } from "./messages";
export type { SupportedLocale } from "./messages";

type MessageValue = unknown;

type MessageParams = Record<string, string | number>;

const STORAGE_KEY = "quiz-app.locale";
const DEFAULT_LOCALE: SupportedLocale = "en";
const SUPPORTED_LOCALES: SupportedLocale[] = ["en", "vi"];

function normalizeLocale(value?: string | null): SupportedLocale {
  if (!value) {
    return DEFAULT_LOCALE;
  }

  const normalized = value.toLowerCase();

  if (normalized.startsWith("vi")) {
    return "vi";
  }

  return "en";
}

function readInitialLocale(): SupportedLocale {
  if (typeof window === "undefined") {
    return DEFAULT_LOCALE;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (stored) {
    return normalizeLocale(stored);
  }

  return normalizeLocale(window.navigator.language);
}

function resolveMessage(locale: SupportedLocale, path: string): MessageValue {
  const segments = path.split(".");
  let cursor: MessageValue = messages[locale];

  for (const segment of segments) {
    if (!cursor || typeof cursor !== "object" || Array.isArray(cursor)) {
      return undefined;
    }

    cursor = (cursor as Record<string, MessageValue>)[segment];
  }

  return cursor;
}

function interpolate(template: string, params?: MessageParams) {
  if (!params) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(params[key] ?? `{${key}}`));
}

function syncDocumentLocale(locale: SupportedLocale) {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.lang = locale === "vi" ? "vi" : "en";
}

export const activeLocale = ref<SupportedLocale>(readInitialLocale());

syncDocumentLocale(activeLocale.value);

export function setLocale(locale: SupportedLocale) {
  activeLocale.value = locale;
  syncDocumentLocale(locale);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, locale);
  }
}

export function getLocaleCode(locale = activeLocale.value) {
  return locale === "vi" ? "vi-VN" : "en-US";
}

export function getOpenGraphLocale(locale = activeLocale.value) {
  return locale === "vi" ? "vi_VN" : "en_US";
}

export function t(key: string, params?: MessageParams, locale = activeLocale.value): string {
  const message = resolveMessage(locale, key);

  if (typeof message === "string") {
    return interpolate(message, params);
  }

  const fallback = resolveMessage(DEFAULT_LOCALE, key);

  if (typeof fallback === "string") {
    return interpolate(fallback, params);
  }

  return key;
}

export function tm<T = MessageValue>(key: string, locale = activeLocale.value): T {
  const message = resolveMessage(locale, key);

  if (message !== undefined) {
    return message as T;
  }

  return resolveMessage(DEFAULT_LOCALE, key) as T;
}

export function useI18n() {
  return {
    locale: computed(() => activeLocale.value),
    locales: SUPPORTED_LOCALES,
    setLocale,
    t,
    tm,
    formatDateTime(value: string | number | Date, options?: Intl.DateTimeFormatOptions) {
      return new Intl.DateTimeFormat(getLocaleCode(), options).format(new Date(value));
    },
    formatNumber(value: number, options?: Intl.NumberFormatOptions) {
      return new Intl.NumberFormat(getLocaleCode(), options).format(value);
    }
  };
}
