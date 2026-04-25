<script setup lang="ts">
import type { MyQuizStatus } from "../../data/my-quizzes";

const props = defineProps<{
  status: MyQuizStatus;
}>();

function statusClass() {
  return `is-${props.status.toLowerCase().replace(/\s+/g, "-")}`;
}
</script>

<template>
  <span class="status-badge" :class="statusClass()">
    {{ status }}
  </span>
</template>

<style scoped>
.status-badge {
  min-height: 26px;
  border-radius: 999px;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  font-weight: 800;
  white-space: nowrap;
}

.status-badge::before {
  content: "";
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: currentColor;
}

.status-badge.is-published {
  background: #e8fbf2;
  color: #10b981;
}

.status-badge.is-in-progress {
  background: #fff4e6;
  color: #d97706;
}

.status-badge.is-unpublished {
  background: #f2f4f7;
  color: #667287;
}
</style>
