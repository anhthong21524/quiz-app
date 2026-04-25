<script setup lang="ts">
import { onUnmounted, ref, watch } from "vue";
import { useGlobalLoading } from "../composables/useGlobalLoading";

const SHOW_DELAY_MS = 150;
const TICK_INTERVAL_MS = 180;
const MAX_AUTO_PROGRESS = 82;

const { isLoading } = useGlobalLoading();
const visible = ref(false);
const progress = ref(0);

let showTimer: ReturnType<typeof setTimeout> | null = null;
let progressTimer: ReturnType<typeof setInterval> | null = null;
let hideTimer: ReturnType<typeof setTimeout> | null = null;

function clearAll() {
  if (showTimer !== null) { clearTimeout(showTimer); showTimer = null; }
  if (progressTimer !== null) { clearInterval(progressTimer); progressTimer = null; }
  if (hideTimer !== null) { clearTimeout(hideTimer); hideTimer = null; }
}

watch(isLoading, (loading) => {
  if (loading) {
    clearAll();
    showTimer = setTimeout(() => {
      visible.value = true;
      progress.value = 8;
      progressTimer = setInterval(() => {
        if (progress.value < MAX_AUTO_PROGRESS) {
          // Decelerate as it approaches the cap to feel natural
          const remaining = MAX_AUTO_PROGRESS - progress.value;
          progress.value += Math.max(1, remaining * 0.12);
        }
      }, TICK_INTERVAL_MS);
    }, SHOW_DELAY_MS);
  } else {
    clearAll();
    if (visible.value) {
      progress.value = 100;
      hideTimer = setTimeout(() => {
        visible.value = false;
        progress.value = 0;
      }, 280);
    } else {
      // Transition completed before the delay threshold — no bar was shown
      progress.value = 0;
    }
  }
});

onUnmounted(clearAll);
</script>

<template>
  <Transition name="global-bar">
    <div
      v-if="visible"
      class="global-loading-bar"
      role="progressbar"
      aria-label="Page loading"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="Math.round(progress)"
      aria-live="polite"
    >
      <div class="global-loading-bar__fill" :style="{ width: `${progress}%` }" />
    </div>
  </Transition>
</template>

<style scoped>
.global-loading-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 9999;
  background: transparent;
  pointer-events: none;
}

.global-loading-bar__fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #34d399);
  border-radius: 0 2px 2px 0;
  transition: width 0.18s ease-out;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
}

.global-bar-enter-active,
.global-bar-leave-active {
  transition: opacity 0.2s ease;
}

.global-bar-enter-from,
.global-bar-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .global-loading-bar__fill {
    transition: none;
  }
}
</style>
