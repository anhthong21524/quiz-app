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
}

.page-header h1,
.page-header p {
  margin: 0;
}

.page-header h1 {
  color: #182033;
  font-size: 2rem;
  line-height: 1.15;
}

.page-header p {
  color: #657286;
}
</style>
