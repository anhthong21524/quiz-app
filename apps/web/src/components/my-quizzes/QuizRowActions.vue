<script setup lang="ts">
defineProps<{
  title: string;
  canPublish?: boolean;
  isPublished?: boolean;
  isBusy?: boolean;
}>();

const emit = defineEmits<{
  view: [];
  edit: [];
  "toggle-published": [];
}>();
</script>

<template>
  <div class="row-actions">
    <button class="icon-button" type="button" :aria-label="`View ${title}`" @click="emit('view')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path
          d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
          stroke-linejoin="round"
        />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    </button>

    <button class="icon-button" type="button" :aria-label="`Edit ${title}`" @click="emit('edit')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="m5 19 3.8-.8 9-9a2.1 2.1 0 0 0-3-3l-9 9L5 19Z" stroke-linejoin="round" />
        <path d="m13.5 7.5 3 3" stroke-linecap="round" />
      </svg>
    </button>

    <button
      v-if="canPublish"
      class="publish-button"
      type="button"
      :disabled="isBusy"
      @click="emit('toggle-published')"
    >
      {{ isPublished ? "Unpublish" : "Publish" }}
    </button>

    <button v-else class="icon-button" type="button" :aria-label="`More options for ${title}`">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <circle cx="5" cy="12" r="1.7" />
        <circle cx="12" cy="12" r="1.7" />
        <circle cx="19" cy="12" r="1.7" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.row-actions {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.icon-button {
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 9px;
  display: grid;
  place-items: center;
  background: transparent;
  color: #94a0b1;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.icon-button:hover {
  background: #eef9f4;
  color: #10b981;
}

.icon-button svg {
  width: 18px;
  height: 18px;
}

.publish-button {
  min-height: 30px;
  border: 0;
  border-radius: 9px;
  padding: 0 10px;
  background: #e8fbf2;
  color: #0f9f6e;
  font-size: 0.82rem;
  font-weight: 800;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.publish-button:hover:not(:disabled) {
  background: #10b981;
  color: #ffffff;
}

.publish-button:disabled {
  cursor: wait;
  opacity: 0.65;
}
</style>
