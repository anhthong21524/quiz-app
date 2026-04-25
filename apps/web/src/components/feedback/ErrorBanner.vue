<script setup lang="ts">
/**
 * Non-blocking sticky banner for background-refresh failures when stale
 * content is still displayed (e.g. quiz list failed to reload but last-known
 * data is still visible). Does not replace content.
 */
defineProps<{
  message: string;
  retryable?: boolean;
  retryLabel?: string;
  loading?: boolean;
}>();

const emit = defineEmits<{
  retry: [];
  dismiss: [];
}>();
</script>

<template>
  <div
    v-if="message"
    class="error-banner"
    role="alert"
    aria-live="polite"
    aria-atomic="true"
  >
    <svg
      class="error-banner__icon"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill-rule="evenodd"
        d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
        clip-rule="evenodd"
      />
    </svg>

    <p class="error-banner__text">{{ message }}</p>

    <button
      v-if="retryable"
      type="button"
      class="error-banner__action"
      :disabled="loading"
      @click="emit('retry')"
    >
      {{ loading ? "Retrying…" : (retryLabel ?? "Retry") }}
    </button>

    <button
      type="button"
      class="error-banner__dismiss"
      aria-label="Dismiss"
      @click="emit('dismiss')"
    >
      <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
        <path
          d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.error-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 10px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  color: #92400e;
  font-size: 0.9rem;
}

.error-banner__icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: #d97706;
}

.error-banner__text {
  flex: 1;
  margin: 0;
  min-width: 0;
  line-height: 1.4;
}

.error-banner__action {
  border: 1px solid #f59e0b;
  background: transparent;
  color: #92400e;
  border-radius: 6px;
  padding: 4px 12px;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.error-banner__action:hover:not(:disabled) {
  background: #fef3c7;
}

.error-banner__action:disabled {
  opacity: 0.6;
  cursor: wait;
}

.error-banner__action:focus-visible {
  outline: 2px solid #d97706;
  outline-offset: 2px;
}

.error-banner__dismiss {
  width: 28px;
  height: 28px;
  display: inline-grid;
  place-items: center;
  border: 0;
  background: transparent;
  color: #b45309;
  border-radius: 6px;
  cursor: pointer;
  flex-shrink: 0;
  padding: 0;
  transition: background-color 0.15s ease;
}

.error-banner__dismiss svg {
  width: 16px;
  height: 16px;
}

.error-banner__dismiss:hover {
  background: #fef3c7;
}

.error-banner__dismiss:focus-visible {
  outline: 2px solid #d97706;
  outline-offset: 2px;
}

@media (max-width: 560px) {
  .error-banner {
    flex-wrap: wrap;
    gap: 8px;
  }

  .error-banner__action {
    flex: 1;
    text-align: center;
  }
}
</style>
