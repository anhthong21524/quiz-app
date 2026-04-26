<script setup lang="ts">
interface ResultTabItem {
  id: string;
  label: string;
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
      :class="{ 'is-active': activeTab === tab.id }"
      :aria-selected="activeTab === tab.id"
      role="tab"
      @click="emit('select', tab.id)"
    >
      {{ tab.label }}
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
  background: transparent;
  color: #344159;
  font-weight: 800;
  white-space: nowrap;
}

.result-tab:hover,
.result-tab.is-active {
  color: #10b981;
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
</style>
