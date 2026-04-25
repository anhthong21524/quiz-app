<script setup lang="ts">
/**
 * EmptyState — unified empty state component for the Quiz App.
 *
 * Size variants:
 *   page    – min-height 60vh, centred with a card wrapper. Use for full-page
 *             absences (e.g. 404, coming-soon). Semantically acts as main region.
 *   section – min-height 320 px with a top border separator. Use when the
 *             component replaces a content list/table inside a card (quiz list,
 *             activity feed, etc.).
 *   inline  – compact, dashed border box. Use inside a form section or any
 *             narrow container (editor question area, widget panels).
 *
 * Icon variants (built-in, overridable via #icon slot):
 *   quiz       – document with lines
 *   questions  – question-mark circle
 *   activity   – sparkline chart
 *   search     – magnifier (for filter-empty states)
 *   default    – plus-in-rect placeholder
 *
 * Actions: primaryAction / secondaryAction each accept one of:
 *   { label, to }      → <RouterLink>
 *   { label, href }    → <a>
 *   { label, onClick } → <button>
 *
 * Slots:
 *   #icon        – replace the built-in icon SVG
 *   #description – additional content below the description text
 *   #actions     – fully replace the action row
 *
 * Accessibility:
 *   role="status" + aria-live="polite" so screen readers announce when the
 *   empty state appears without interrupting ongoing narration.
 */

import { RouterLink } from "vue-router";

export interface EmptyStateAction {
  label: string;
  /** RouterLink target — named route object or path string. */
  to?: string | Record<string, unknown>;
  /** Anchor href for external links or fragment navigation. */
  href?: string;
  /** Click handler when rendered as a plain <button>. */
  onClick?: () => void;
}

withDefaults(
  defineProps<{
    title: string;
    description?: string;
    iconVariant?: "quiz" | "questions" | "activity" | "search" | "default";
    primaryAction?: EmptyStateAction;
    secondaryAction?: EmptyStateAction;
    size?: "page" | "section" | "inline";
  }>(),
  {
    iconVariant: "default",
    size: "section",
  }
);
</script>

<template>
  <div
    class="es"
    :class="`es--${size}`"
    role="status"
    aria-live="polite"
    aria-atomic="true"
  >
    <!-- ── Icon ─────────────────────────────────────────────── -->
    <div class="es__icon" aria-hidden="true">
      <slot name="icon">
        <!-- quiz / document -->
        <svg
          v-if="iconVariant === 'quiz'"
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M15 8h14l6 6v24a3 3 0 0 1-3 3H15a3 3 0 0 1-3-3V11a3 3 0 0 1 3-3Z" />
          <path d="M29 8v7h7" />
          <path d="M18 23h12M18 30h8" stroke-linecap="round" />
        </svg>

        <!-- questions / help circle -->
        <svg
          v-else-if="iconVariant === 'questions'"
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="24" cy="24" r="18" />
          <path
            d="M19.5 19.5a4.5 4.5 0 0 1 9 0c0 3-4.5 4.5-4.5 7.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <circle cx="24" cy="33" r="1.5" fill="currentColor" stroke="none" />
        </svg>

        <!-- activity / sparkline -->
        <svg
          v-else-if="iconVariant === 'activity'"
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            d="M9 34l9-10 8 6 10-14"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path d="M9 39h30" stroke-linecap="round" opacity="0.35" />
        </svg>

        <!-- search / magnifier (filter-empty states) -->
        <svg
          v-else-if="iconVariant === 'search'"
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="21" cy="21" r="13" />
          <path d="M31 31l9 9" stroke-linecap="round" />
          <path d="M17 21h8M21 17v8" stroke-linecap="round" opacity="0.45" />
        </svg>

        <!-- default: plus-in-rect placeholder -->
        <svg
          v-else
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <rect x="9" y="9" width="30" height="30" rx="7" />
          <path d="M24 17v14M17 24h14" stroke-linecap="round" opacity="0.5" />
        </svg>
      </slot>
    </div>

    <!-- ── Text ──────────────────────────────────────────────── -->
    <div class="es__body">
      <p class="es__title">{{ title }}</p>
      <p v-if="description" class="es__description">{{ description }}</p>
      <slot name="description" />
    </div>

    <!-- ── Actions ──────────────────────────────────────────── -->
    <div
      v-if="primaryAction || secondaryAction || $slots.actions"
      class="es__actions"
    >
      <slot name="actions">
        <!-- Primary action -->
        <RouterLink
          v-if="primaryAction?.to"
          class="es__btn es__btn--primary"
          :to="primaryAction.to"
        >
          {{ primaryAction.label }}
        </RouterLink>
        <a
          v-else-if="primaryAction?.href"
          class="es__btn es__btn--primary"
          :href="primaryAction.href"
        >
          {{ primaryAction.label }}
        </a>
        <button
          v-else-if="primaryAction?.onClick"
          type="button"
          class="es__btn es__btn--primary"
          @click="primaryAction.onClick"
        >
          {{ primaryAction.label }}
        </button>

        <!-- Secondary action -->
        <RouterLink
          v-if="secondaryAction?.to"
          class="es__btn es__btn--secondary"
          :to="secondaryAction.to"
        >
          {{ secondaryAction.label }}
        </RouterLink>
        <a
          v-else-if="secondaryAction?.href"
          class="es__btn es__btn--secondary"
          :href="secondaryAction.href"
        >
          {{ secondaryAction.label }}
        </a>
        <button
          v-else-if="secondaryAction?.onClick"
          type="button"
          class="es__btn es__btn--secondary"
          @click="secondaryAction.onClick"
        >
          {{ secondaryAction.label }}
        </button>
      </slot>
    </div>
  </div>
</template>

<style scoped>
/* ── Base ──────────────────────────────────────────────────── */
.es {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 48px 24px;
  text-align: center;
}

/* ── Size variants ─────────────────────────────────────────── */
.es--page {
  min-height: 60vh;
  padding: 64px 24px;
}

.es--section {
  min-height: 320px;
  border-top: 1px solid #edf0f2;
}

.es--inline {
  min-height: 200px;
  padding: 32px 20px;
  border-radius: 14px;
  border: 1.5px dashed #e2e8f0;
  background: #fafbfc;
}

/* ── Icon container ────────────────────────────────────────── */
.es__icon {
  width: 76px;
  height: 76px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background: #e8fbf2;
  color: #10b981;
  flex-shrink: 0;
}

.es--inline .es__icon {
  width: 60px;
  height: 60px;
  border-radius: 14px;
}

.es__icon svg {
  width: 42px;
  height: 42px;
}

.es--inline .es__icon svg {
  width: 32px;
  height: 32px;
}

/* ── Text ──────────────────────────────────────────────────── */
.es__body {
  display: grid;
  gap: 6px;
}

.es__title {
  margin: 0;
  color: #182033;
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1.3;
}

.es--inline .es__title {
  font-size: 1.05rem;
}

.es__description {
  margin: 0;
  max-width: 400px;
  color: #657286;
  font-size: 0.93rem;
  line-height: 1.65;
}

/* ── Actions ───────────────────────────────────────────────── */
.es__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 4px;
}

.es__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 10px;
  font-size: 0.93rem;
  font-weight: 700;
  padding: 10px 22px;
  min-height: 42px;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.es__btn:focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 2px;
  border-radius: 10px;
}

.es__btn--primary {
  border: 0;
  background: #10b981;
  color: #ffffff;
  box-shadow: 0 8px 18px rgba(16, 185, 129, 0.18);
}

.es__btn--primary:hover {
  background: #0ea873;
  transform: translateY(-1px);
  box-shadow: 0 12px 22px rgba(16, 185, 129, 0.22);
}

.es__btn--secondary {
  border: 1.5px solid #dfe4ea;
  background: #ffffff;
  color: #4b5563;
}

.es__btn--secondary:hover {
  border-color: #10b981;
  color: #065f46;
  background: #f0fdf4;
}

/* ── Reduced motion ────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .es__btn {
    transition: none;
  }
}
</style>
