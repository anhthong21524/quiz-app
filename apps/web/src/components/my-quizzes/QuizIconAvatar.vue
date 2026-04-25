<script setup lang="ts">
import type { MyQuizIcon } from "./types";

defineProps<{
  icon: MyQuizIcon;
}>();
</script>

<template>
  <span class="quiz-avatar" :class="`is-${icon}`" aria-hidden="true">
    <svg
      v-if="icon === 'mathematics'"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.7"
    >
      <path d="M7.5 6.5h9v11h-9z" opacity="0.3" />
      <path d="m9 10 2 4 2-8 2 12" stroke-linecap="round" stroke-linejoin="round" />
    </svg>

    <svg
      v-else-if="icon === 'science'"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.7"
    >
      <path
        d="M9 4h6M10 4v5l-4.5 7.2A2 2 0 0 0 7.2 19h9.6a2 2 0 0 0 1.7-2.8L14 9V4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>

    <svg
      v-else-if="icon === 'geography'"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.7"
    >
      <circle cx="12" cy="12" r="8" />
      <path
        d="M4 12h16M12 4a13 13 0 0 1 0 16M12 4a13 13 0 0 0 0 16"
        stroke-linecap="round"
      />
    </svg>

    <svg v-else-if="icon === 'knowledge'" viewBox="0 0 24 24" fill="currentColor">
      <path d="m12 3.5 2.45 4.97 5.49.8-3.97 3.87.94 5.47L12 16.03l-4.91 2.58.94-5.47-3.97-3.87 5.49-.8z" />
    </svg>

    <svg
      v-else-if="icon === 'english'"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.7"
    >
      <path
        d="M5 6h8M9 6v12M15 9l4 9M16 15h4M4 18c2.3 0 4.4-1.7 5-4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>

    <svg
      v-else-if="icon === 'physics'"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.7"
    >
      <circle cx="12" cy="12" r="2" />
      <path d="M20 12c0 2-3.6 3.7-8 3.7S4 14 4 12s3.6-3.7 8-3.7 8 1.7 8 3.7Z" />
      <path d="M16 18.9c-1.7 1-4.2-1.4-6.4-5.2S6.4 6.5 8.1 5.5s4.2 1.4 6.4 5.2 3.2 7.2 1.5 8.2Z" />
      <path d="M8.1 18.9c-1.7-1-.7-4.5 1.5-8.2s4.7-6.2 6.4-5.2.7 4.5-1.5 8.2-4.7 6.2-6.4 5.2Z" />
    </svg>

    <svg
      v-else
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.7"
    >
      <path d="M4 20h16M6 18V9l6-4 6 4v9" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M9 18v-6h6v6" stroke-linejoin="round" />
    </svg>
  </span>
</template>

<style scoped>
.quiz-avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.quiz-avatar svg {
  width: 20px;
  height: 20px;
}

.quiz-avatar.is-mathematics,
.quiz-avatar.is-physics {
  background: #f3edff;
  color: #8b5cf6;
}

.quiz-avatar.is-science {
  background: #e7fbf2;
  color: #10b981;
}

.quiz-avatar.is-geography {
  background: #ebf3ff;
  color: #1d7cf2;
}

.quiz-avatar.is-knowledge {
  background: #fff6dd;
  color: #f4b400;
}

.quiz-avatar.is-english {
  background: #fff0f2;
  color: #ef4444;
}

.quiz-avatar.is-history {
  background: #fff2e8;
  color: #f97316;
}
</style>
