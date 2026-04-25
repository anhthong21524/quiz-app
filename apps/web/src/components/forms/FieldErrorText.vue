<script setup lang="ts">
defineProps<{
  id: string;
  message?: string;
}>();
</script>

<template>
  <p v-if="message" :id="id" class="field-error-text">
    {{ message }}
  </p>
</template>

<style scoped>
.field-error-text {
  margin: 0;
  color: #c2410c;
  font-size: 0.88rem;
}
</style>
