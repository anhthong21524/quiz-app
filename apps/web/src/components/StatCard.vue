<script setup lang="ts">
withDefaults(defineProps<{
  value: string | number;
  label: string;
  hint: string;
  color?: "green" | "amber" | "teal" | "gray";
  width?: string;
  height?: string;
}>(), {
  color: "green",
});
</script>

<template>
  <div
    class="stat-card"
    :style="{
      width: width ?? undefined,
      height: height ?? undefined,
    }"
  >
    <div class="stat-icon" :class="`stat-icon--${color}`" aria-hidden="true">
      <slot />
    </div>
    <div class="stat-card__body">
      <p class="stat-value" :class="`stat-value--${color}`">{{ value }}</p>
      <p class="stat-label">{{ label }}</p>
      <p class="stat-hint">{{ hint }}</p>
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  border: var(--surface-border, 1px solid rgba(226, 223, 218, 0.92));
  border-radius: var(--surface-radius, 20px);
  background: rgba(255, 255, 255, 0.98);
  box-shadow: var(--surface-shadow, 0 10px 26px rgba(46, 35, 20, 0.06));
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.stat-icon :deep(svg) {
  width: 15px;
  height: 15px;
}

.stat-icon--green { background: #e8fbf2; color: #10b981; }
.stat-icon--amber { background: #fff4e6; color: #d97706; }
.stat-icon--teal  { background: #e0f7f4; color: #0d9488; }
.stat-icon--gray  { background: #f3f4f6; color: #6b7280; }

.stat-card__body {
  display: grid;
  gap: 1px;
}

.stat-value {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 800;
  color: #182033;
  line-height: 1;
}

.stat-value--amber { color: #d97706; }
.stat-value--teal  { color: #0d9488; }
.stat-value--gray  { color: #6b7280; }
.stat-value--green { color: #182033; }

.stat-label {
  margin: 0;
  font-size: 0.82rem;
  font-weight: 700;
  color: #182033;
}

.stat-hint {
  margin: 0;
  font-size: 0.75rem;
  color: #8a93a3;
  line-height: 1.3;
}
</style>
