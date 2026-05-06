<script setup lang="ts">
defineProps<{
  title: string;
  description?: string;
}>();
</script>

<template>
  <header class="page-header">
    <h1>{{ title }}</h1>
    <p v-if="description">{{ description }}</p>
  </header>
</template>

<style scoped>
.page-header {
  display: grid;
  gap: 6px;
  max-width: min(100%, 52rem);
}

.page-header h1,
.page-header p {
  margin: 0;
}

.page-header h1 {
  color: #182033;
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  line-height: 1.15;
  text-wrap: balance;
}

.page-header p {
  color: #657286;
  font-size: clamp(0.95rem, 2vw, 1.05rem);
  line-height: 1.6;
}

@media (max-width: 640px) {
  .page-header {
    gap: 8px;
  }

  .page-header h1 {
    font-size: 1.55rem;
  }

  .page-header p {
    font-size: 0.94rem;
  }
}
</style>
