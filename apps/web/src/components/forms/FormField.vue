<script setup lang="ts">
defineProps<{
  id: string;
  label: string;
  error?: string;
  hintId?: string;
}>();
</script>

<template>
  <div class="form-field">
    <label :for="id">{{ label }}</label>
    <slot
      :input-id="id"
      :error-id="`${id}-error`"
      :described-by="[error ? `${id}-error` : undefined, hintId].filter(Boolean).join(' ') || undefined"
    />
    <p v-if="error" :id="`${id}-error`" class="form-field-error">
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
.form-field {
  display: grid;
  gap: 6px;
}

.form-field label {
  color: #444444;
  font-size: 13px;
  font-weight: 500;
}

.form-field-error {
  margin: 0;
  color: #c2410c;
  font-size: 0.88rem;
}
</style>
