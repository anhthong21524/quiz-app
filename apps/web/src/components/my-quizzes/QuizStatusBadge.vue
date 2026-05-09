<script setup lang="ts">
import type { MyQuizStatus } from "./types";
import { useI18n } from "../../i18n";

const props = defineProps<{
  status: MyQuizStatus;
  isExposed?: boolean;
}>();

const { t } = useI18n();

function statusClass() {
  if (props.status !== "Published" && props.isExposed) return "is-exposed";
  return `is-${props.status.toLowerCase().replace(/\s+/g, "-")}`;
}

function labelForStatus(status: MyQuizStatus) {
  if (status === "Published") return t("myQuizzes.status.published");
  if (props.isExposed) return t("myQuizzes.status.exposed");
  if (status === "In progress") return t("myQuizzes.status.inProgress");
  return t("myQuizzes.status.unpublished");
}
</script>

<template>
  <span class="status-badge" :class="statusClass()">
    {{ labelForStatus(status) }}
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

.status-badge.is-exposed {
  background: #eef9f4;
  color: #0b7a52;
}
</style>
