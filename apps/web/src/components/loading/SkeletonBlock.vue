<script setup lang="ts">
/**
 * Base shimmer skeleton block. Compose these into page-specific skeleton layouts.
 * All sizing is controlled via class or inline style from the parent — this component
 * owns only the shimmer animation and shape.
 */
withDefaults(
  defineProps<{
    rounded?: "sm" | "md" | "lg" | "full";
    width?: string;
    height?: string;
  }>(),
  { rounded: "md" }
);
</script>

<template>
  <span
    class="skeleton-block"
    :class="`skeleton-block--${rounded}`"
    :style="{ width, height }"
    aria-hidden="true"
  />
</template>

<style scoped>
.skeleton-block {
  display: block;
  background: linear-gradient(
    90deg,
    #edf0f3 25%,
    #e3e7eb 50%,
    #edf0f3 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}

.skeleton-block--sm  { border-radius: 4px; }
.skeleton-block--md  { border-radius: 8px; }
.skeleton-block--lg  { border-radius: 12px; }
.skeleton-block--full { border-radius: 9999px; }

@keyframes skeleton-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-block {
    animation: none;
    background: #edf0f3;
  }
}
</style>
