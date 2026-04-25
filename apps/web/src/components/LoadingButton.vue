<script setup lang="ts">
/**
 * Reusable button with a pending/loading state.
 *
 * - Disables interaction while loading to prevent duplicate submissions.
 * - Preserves button width when the spinner replaces text (min-width: max-content trick).
 * - Announces loading state to screen readers via aria-busy + aria-label.
 * - loadingLabel falls back to the default slot content with "…" appended when omitted.
 */
const props = withDefaults(
  defineProps<{
    loading?: boolean;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary" | "danger";
    loadingLabel?: string;
  }>(),
  {
    loading: false,
    disabled: false,
    type: "button",
    variant: "primary",
  }
);

defineEmits<{ click: [event: MouseEvent] }>();
</script>

<template>
  <button
    :type="props.type"
    :disabled="props.loading || props.disabled"
    :aria-disabled="props.loading || props.disabled"
    :aria-busy="props.loading"
    :aria-label="props.loading && props.loadingLabel ? props.loadingLabel : undefined"
    class="loading-btn"
    :class="[`loading-btn--${props.variant}`, { 'loading-btn--pending': props.loading }]"
    @click="!props.loading && !props.disabled ? $emit('click', $event) : undefined"
  >
    <span class="loading-btn__inner">
      <svg
        v-if="props.loading"
        class="loading-btn__spinner"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.2"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>

      <span class="loading-btn__label">
        <template v-if="props.loading && props.loadingLabel">
          {{ props.loadingLabel }}
        </template>
        <template v-else>
          <slot />
        </template>
      </span>
    </span>
  </button>
</template>

<style scoped>
.loading-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* Lock width when content changes between label and loading label */
  min-width: max-content;
  border: 0;
  border-radius: 10px;
  font-weight: 700;
  font-size: inherit;
  line-height: 1;
  cursor: pointer;
  white-space: nowrap;
  transition:
    background-color 0.15s ease,
    box-shadow 0.15s ease,
    opacity 0.15s ease,
    transform 0.15s ease;
}

.loading-btn__inner {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.loading-btn__spinner {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  animation: btn-spin 0.75s linear infinite;
}

@keyframes btn-spin {
  to { transform: rotate(360deg); }
}

/* ── Variants ─────────────────────────────────────────────────────── */

.loading-btn--primary {
  min-height: 44px;
  padding: 0 22px;
  background: #10b981;
  color: #ffffff;
  box-shadow: 0 8px 18px rgba(16, 185, 129, 0.22);
}

.loading-btn--primary:hover:not(:disabled) {
  background: #0ea873;
  transform: translateY(-1px);
  box-shadow: 0 12px 22px rgba(16, 185, 129, 0.28);
}

.loading-btn--secondary {
  min-height: 44px;
  padding: 0 20px;
  background: transparent;
  color: #374151;
  border: 1.5px solid #d1d5db;
}

.loading-btn--secondary:hover:not(:disabled) {
  border-color: #10b981;
  color: #065f46;
  background: #f0fdf4;
}

.loading-btn--danger {
  min-height: 44px;
  padding: 0 22px;
  background: #dc2626;
  color: #ffffff;
}

.loading-btn--danger:hover:not(:disabled) {
  background: #b91c1c;
}

/* ── Pending / Disabled ───────────────────────────────────────────── */

.loading-btn--pending,
.loading-btn:disabled {
  opacity: 0.72;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.loading-btn:focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .loading-btn__spinner {
    animation: none;
    opacity: 0.6;
  }
}
</style>
