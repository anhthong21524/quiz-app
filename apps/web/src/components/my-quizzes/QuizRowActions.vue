<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <div class="row-actions">
    <button class="icon-button" type="button" :aria-label="`View ${title}`">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path
          d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
          stroke-linejoin="round"
        />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    </button>

    <button class="icon-button" type="button" :aria-label="`Edit ${title}`">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="m5 19 3.8-.8 9-9a2.1 2.1 0 0 0-3-3l-9 9L5 19Z" stroke-linejoin="round" />
        <path d="m13.5 7.5 3 3" stroke-linecap="round" />
      </svg>
    </button>

    <button class="icon-button" type="button" :aria-label="`More options for ${title}`">
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
  gap: 12px;
}

.icon-button {
  width: 32px;
  height: 32px;
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
  width: 19px;
  height: 19px;
}
</style>
