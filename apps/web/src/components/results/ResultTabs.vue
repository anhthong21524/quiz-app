<script setup lang="ts">
interface ResultTabItem {
  id: string;
  label: string;
  badge?: string;
  disabled?: boolean;
}

defineProps<{
  tabs: ResultTabItem[];
  activeTab: string;
}>();

const emit = defineEmits<{
  select: [tabId: string];
}>();
</script>

<template>
  <div class="result-tabs" role="tablist" aria-label="Result views">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      type="button"
      class="result-tab"
      :class="{ 'is-active': activeTab === tab.id, 'is-disabled': tab.disabled }"
      :disabled="tab.disabled"
      :aria-selected="activeTab === tab.id"
      role="tab"
      @click="emit('select', tab.id)"
    >
      <span>{{ tab.label }}</span>
      <span v-if="tab.badge" class="result-tab-badge">{{ tab.badge }}</span>
    </button>
  </div>
</template>

<style scoped>
.result-tabs {
  min-height: 54px;
  padding: 0 18px;
  display: flex;
  align-items: flex-end;
  gap: clamp(18px, 4vw, 42px);
  overflow-x: auto;
  border-bottom: 1px solid #edf0f2;
}

.result-tab {
  min-height: 54px;
  border: 0;
  border-radius: 0;
  padding: 0 2px;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  background: transparent;
  color: #344159;
  font-weight: 800;
  white-space: nowrap;
}

.result-tab:not(.is-disabled):hover,
.result-tab.is-active {
  color: #10b981;
}

.result-tab.is-disabled {
  cursor: default;
  opacity: 0.68;
}

.result-tab.is-disabled.is-active {
  opacity: 1;
}

.result-tab.is-active::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 3px;
  border-radius: 999px 999px 0 0;
  background: #10b981;
}

.result-tab-badge {
  border-radius: 999px;
  padding: 2px 9px;
  background: #dff8ed;
  color: #0f9f65;
  font-size: 0.72rem;
  font-weight: 900;
}
</style>
