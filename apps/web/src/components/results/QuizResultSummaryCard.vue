<script setup lang="ts">
defineProps<{
  label: string;
  value: string;
  icon: "users" | "star" | "clock" | "check";
}>();
</script>

<template>
  <article class="result-detail-summary-card">
    <span class="summary-icon" aria-hidden="true">
      <svg
        v-if="icon === 'users'"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
      >
        <path d="M16 19v-1.4a3.6 3.6 0 0 0-3.6-3.6H7.6A3.6 3.6 0 0 0 4 17.6V19" stroke-linecap="round" />
        <circle cx="10" cy="8" r="3" />
        <path d="M20 19v-1.3a3.6 3.6 0 0 0-2.7-3.5M15.5 5.2a3 3 0 0 1 0 5.6" stroke-linecap="round" />
      </svg>

      <svg
        v-else-if="icon === 'star'"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
      >
        <path d="m12 3.7 2.5 5.1 5.6.8-4 3.9.9 5.5-5-2.6L7 19l.9-5.5-4-3.9 5.6-.8L12 3.7Z" stroke-linejoin="round" />
      </svg>

      <svg
        v-else-if="icon === 'clock'"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
      >
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3 2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>

      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <circle cx="12" cy="12" r="8.5" />
        <path d="m8.5 12 2.3 2.3 4.8-5.1" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M17.8 6.4 19.2 5" stroke-linecap="round" />
      </svg>
    </span>

    <div class="summary-copy">
      <p>{{ label }}</p>
      <strong>{{ value }}</strong>
    </div>
  </article>
</template>

<style scoped>
.result-detail-summary-card {
  min-height: 80px;
  border: var(--surface-border);
  border-radius: 16px;
  padding: 12px 18px;
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: var(--surface-shadow);
}

.summary-icon {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  background: #e7fbf2;
  color: #10b981;
}

.summary-icon svg {
  width: 24px;
  height: 24px;
}

.summary-copy {
  min-width: 0;
  display: grid;
  gap: 4px;
}

.summary-copy p,
.summary-copy strong {
  margin: 0;
}

.summary-copy p {
  color: #52617a;
  font-size: 0.82rem;
  font-weight: 800;
}

.summary-copy strong {
  color: #182033;
  font-size: 1.4rem;
  line-height: 1.1;
}
</style>
