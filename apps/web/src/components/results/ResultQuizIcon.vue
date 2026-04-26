<script setup lang="ts">
import type { QuizResultIcon } from "../../data/quiz-results";

defineProps<{
  icon: QuizResultIcon;
}>();
</script>

<template>
  <span class="result-quiz-icon" :class="`is-${icon}`" aria-hidden="true">
    <svg
      v-if="icon === 'science' || icon === 'chemistry'"
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
      <path d="M4 6.5 9 4l6 2.5 5-2.5v13.5L15 20l-6-2.5L4 20V6.5Z" stroke-linejoin="round" />
      <path d="M9 4v13.5M15 6.5V20" stroke-linecap="round" />
    </svg>

    <svg v-else-if="icon === 'knowledge'" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.2 18.5h5.6v-1.7H9.2v1.7Z" />
      <path
        d="M12 3.4A6.5 6.5 0 0 0 8.1 15.1c.6.4.9.9.9 1.4h6c0-.6.3-1 .9-1.4A6.5 6.5 0 0 0 12 3.4Zm2 10.3a4.6 4.6 0 0 0-1.3 1.3h-1.4a4.8 4.8 0 0 0-1.3-1.3A4.6 4.6 0 1 1 14 13.7Z"
      />
    </svg>

    <svg
      v-else-if="icon === 'mathematics'"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.7"
    >
      <path d="M7 8h4M9 6v4M14 8h3.5M7 16h4M14 14.5l3 3M17 14.5l-3 3" stroke-linecap="round" />
    </svg>

    <svg
      v-else-if="icon === 'technology'"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.7"
    >
      <rect x="4" y="5" width="16" height="11" rx="1.8" />
      <path d="M9 20h6M12 16v4" stroke-linecap="round" />
    </svg>

    <svg
      v-else-if="icon === 'biology'"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.7"
    >
      <path
        d="M19 5c-7.3.2-11.9 3.6-14 10.2 3.8.4 7-.4 9.5-2.4 2.4-1.9 3.9-4.5 4.5-7.8Z"
        stroke-linejoin="round"
      />
      <path d="M6 18c2.6-3.6 5.7-6.5 9.4-8.6" stroke-linecap="round" />
    </svg>

    <svg
      v-else
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.7"
    >
      <path d="M4 19h16M6 17V8l6-4 6 4v9" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M8 10h8M9 17v-5h6v5" stroke-linejoin="round" />
    </svg>
  </span>
</template>

<style scoped>
.result-quiz-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
}

.result-quiz-icon svg {
  width: 19px;
  height: 19px;
}

.is-science,
.is-biology {
  background: #e7fbf2;
  color: #10b981;
}

.is-geography,
.is-technology {
  background: #eaf3ff;
  color: #1d7cf2;
}

.is-knowledge {
  background: #fff6dd;
  color: #f4a62a;
}

.is-mathematics {
  background: #fff0f2;
  color: #ef4444;
}

.is-history {
  background: #fff2e8;
  color: #f97316;
}

.is-chemistry {
  background: #f3edff;
  color: #8b5cf6;
}
</style>
