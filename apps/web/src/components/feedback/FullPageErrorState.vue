<script setup lang="ts">
import { onMounted, ref } from "vue";

/**
 * Full-page blocking error. Use when the page has no useful content to show
 * (e.g. quiz editor can't load the quiz at all, 404, or auth expired).
 *
 * - `retryable` shows a Try again button
 * - `actionLabel` / `actionHref` shows a secondary navigation link (e.g. "Back to My Quizzes")
 * - Focus is placed on the heading when mounted for screen-reader accessibility
 */
const props = defineProps<{
  message: string;
  retryable?: boolean;
  retryLabel?: string;
  loading?: boolean;
  actionLabel?: string;
  actionHref?: string;
}>();

const emit = defineEmits<{
  retry: [];
}>();

const headingRef = ref<HTMLHeadingElement | null>(null);

onMounted(() => {
  headingRef.value?.focus();
});
</script>

<template>
  <div class="full-page-error" role="main" aria-labelledby="fpe-heading">
    <div class="full-page-error__card">
      <div class="full-page-error__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" focusable="false">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
        </svg>
      </div>

      <h1
        id="fpe-heading"
        ref="headingRef"
        class="full-page-error__heading"
        tabindex="-1"
      >
        Something went wrong
      </h1>

      <p class="full-page-error__message">{{ message }}</p>

      <div class="full-page-error__actions">
        <button
          v-if="retryable"
          type="button"
          class="full-page-error__retry"
          :disabled="loading"
          :aria-disabled="loading"
          @click="emit('retry')"
        >
          <svg
            v-if="loading"
            class="full-page-error__spinner"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
          <span>{{ loading ? "Retrying…" : (retryLabel ?? "Try again") }}</span>
        </button>

        <a
          v-if="actionHref && actionLabel"
          :href="actionHref"
          class="full-page-error__back"
        >
          {{ actionLabel }}
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.full-page-error {
  min-height: 60vh;
  display: grid;
  place-items: center;
  padding: 40px 20px;
}

.full-page-error__card {
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
  padding: 40px 32px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #f3f4f6;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}

.full-page-error__icon {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background: #fef2f2;
  color: #dc2626;
  flex-shrink: 0;
}

.full-page-error__icon svg {
  width: 34px;
  height: 34px;
}

.full-page-error__heading {
  margin: 0;
  color: #111827;
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1.3;
  outline: none;
}

.full-page-error__message {
  margin: 0;
  color: #4b5563;
  font-size: 0.95rem;
  line-height: 1.6;
  max-width: 360px;
}

.full-page-error__actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 4px;
  width: 100%;
  max-width: 280px;
}

.full-page-error__retry {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 0;
  border-radius: 10px;
  background: #10b981;
  color: #ffffff;
  padding: 11px 20px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    transform 0.15s ease;
}

.full-page-error__retry:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-1px);
}

.full-page-error__retry:disabled {
  background: #a7f3d0;
  cursor: wait;
}

.full-page-error__retry:focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

.full-page-error__spinner {
  width: 16px;
  height: 16px;
  animation: spin 0.8s linear infinite;
  flex-shrink: 0;
}

.full-page-error__back {
  color: #6b7280;
  font-size: 0.9rem;
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.15s ease;
}

.full-page-error__back:hover {
  color: #374151;
}

.full-page-error__back:focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 2px;
  border-radius: 2px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 480px) {
  .full-page-error__card {
    padding: 32px 20px;
    box-shadow: none;
    border: none;
  }
}
</style>
