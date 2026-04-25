<script setup lang="ts">
defineProps<{
  message?: string;
}>();
</script>

<template>
  <div v-if="message" class="form-error-banner" role="alert" aria-live="polite">
    {{ message }}
  </div>
</template>

<style scoped>
.form-error-banner {
  border-radius: 8px;
  border: 1px solid rgba(194, 65, 12, 0.22);
  background: #fff7ed;
  color: #9a3412;
  padding: 10px 12px;
  font-size: 0.9rem;
  line-height: 1.4;
}
</style>
