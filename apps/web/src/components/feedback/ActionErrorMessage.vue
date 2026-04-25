<script setup lang="ts">
/**
 * Inline error shown directly below an action button (save, publish, etc.).
 * Non-blocking — the form and other UI remain usable.
 * Never use this for page-level load failures; use SectionErrorState there.
 */
defineProps<{
  message: string;
  /** When true a retry button is rendered alongside the message */
  retryable?: boolean;
  /** Replaces the generic "Try again" label */
  retryLabel?: string;
  loading?: boolean;
}>();

const emit = defineEmits<{
  retry: [];
}>();
</script>

<template>
  <div
    v-if="message"
    class="action-error"
    role="alert"
    aria-live="polite"
    aria-atomic="true"
  >
    <svg
      class="action-error__icon"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill-rule="evenodd"
        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm-.75-9.5a.75.75 0 0 1 1.5 0v3.25a.75.75 0 0 1-1.5 0V8.5Zm.75 6a.875.875 0 1 0 0-1.75.875.875 0 0 0 0 1.75Z"
        clip-rule="evenodd"
      />
    </svg>

    <span class="action-error__text">{{ message }}</span>

    <button
      v-if="retryable"
      type="button"
      class="action-error__retry"
      :disabled="loading"
      :aria-disabled="loading"
      @click="emit('retry')"
    >
      {{ loading ? "Retrying…" : (retryLabel ?? "Try again") }}
    </button>
  </div>
</template>

<style scoped>
.action-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 8px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  font-size: 0.9rem;
  line-height: 1.4;
}

.action-error__icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: #dc2626;
}

.action-error__text {
  flex: 1;
  min-width: 0;
}

.action-error__retry {
  border: 0;
  background: transparent;
  color: #dc2626;
  font-weight: 600;
  font-size: 0.88rem;
  padding: 0;
  white-space: nowrap;
  text-decoration: underline;
  text-underline-offset: 2px;
  cursor: pointer;
}

.action-error__retry:disabled {
  opacity: 0.6;
  cursor: wait;
}

.action-error__retry:hover:not(:disabled) {
  color: #991b1b;
}

.action-error__retry:focus-visible {
  outline: 2px solid #dc2626;
  outline-offset: 2px;
  border-radius: 2px;
}
</style>
