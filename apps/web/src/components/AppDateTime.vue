<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "../i18n";

const props = withDefaults(defineProps<{
  value?: string | null;
  fallback?: string;
}>(), {
  value: "",
  fallback: "-"
});

const { formatDateTime } = useI18n();

const formattedValue = computed(() => {
  if (!props.value) {
    return props.fallback;
  }

  const date = new Date(props.value);
  if (Number.isNaN(date.getTime())) {
    return props.fallback;
  }

  return formatDateTime(date, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
});

const machineValue = computed(() => {
  if (!props.value) {
    return undefined;
  }

  const date = new Date(props.value);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toISOString();
});
</script>

<template>
  <time class="app-date-time" :datetime="machineValue">{{ formattedValue }}</time>
</template>

<style scoped>
.app-date-time {
  color: inherit;
  font: inherit;
  white-space: nowrap;
}
</style>
