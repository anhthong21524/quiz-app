<script setup lang="ts">
/**
 * Section-level error state. Replaces a content section (e.g. the quiz list
 * table area) when its data failed to load. Offers an optional retry button
 * controlled by the parent via `retryable` and `loading`.
 *
 * State priority: if isLoading is true the parent should show a spinner
 * instead of mounting this component.
 */
defineProps<{
  message: string;
  retryable?: boolean;
  retryLabel?: string;
  loading?: boolean;
}>();

const emit = defineEmits<{
  retry: [];
}>();
</script>

<template>
  <div class="section-error" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="section-error__icon-wrap" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    </div>

    <p class="section-error__message">{{ message }}</p>

    <button
      v-if="retryable"
      type="button"
      class="section-error__retry"
      :disabled="loading"
      :aria-disabled="loading"
      :aria-label="loading ? 'Retrying, please wait' : undefined"
      @click="emit('retry')"
    >
      <svg
        v-if="loading"
        class="section-error__spinner"
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
  </div>
</template>

<style scoped>
.section-error {
  min-height: 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 40px 20px;
  text-align: center;
}

.section-error__icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: #fef2f2;
  color: #ef4444;
  flex-shrink: 0;
}

.section-error__icon-wrap svg {
  width: 28px;
  height: 28px;
}

.section-error__message {
  margin: 0;
  max-width: 400px;
  color: #374151;
  font-size: 0.95rem;
  line-height: 1.55;
}

.section-error__retry {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  background: #ffffff;
  color: #374151;
  padding: 8px 20px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease;
}

.section-error__retry:hover:not(:disabled) {
  border-color: #10b981;
  color: #065f46;
  background: #f0fdf4;
}

.section-error__retry:disabled {
  opacity: 0.65;
  cursor: wait;
}

.section-error__retry:focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

.section-error__spinner {
  width: 16px;
  height: 16px;
  animation: spin 0.8s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
