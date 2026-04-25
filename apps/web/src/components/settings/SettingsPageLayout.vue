<script setup lang="ts">
import SettingsSidebar from "./SettingsSidebar.vue";

defineProps<{
  activeSection: "profile" | "account" | "password";
  title: string;
  subtitle: string;
  titleId: string;
  contentClass?: string;
}>();
</script>

<template>
  <section class="settings-page-layout" :class="contentClass">
    <SettingsSidebar :active-section="activeSection" />

    <section class="settings-content-shell" :aria-labelledby="titleId">
      <header class="settings-heading">
        <h1 :id="titleId">{{ title }}</h1>
        <p>{{ subtitle }}</p>
      </header>

      <div class="settings-content-body">
        <slot />
      </div>
    </section>
  </section>
</template>

<style scoped>
.settings-page-layout {
  min-height: 780px;
  display: grid;
  grid-template-columns: minmax(240px, 290px) minmax(0, 1fr);
  gap: 16px;
  align-items: stretch;
}

.settings-content-shell {
  min-height: 100%;
  padding: 38px 28px;
  border: var(--surface-border);
  border-radius: var(--surface-radius);
  display: grid;
  grid-template-rows: auto 1fr;
  align-content: start;
  gap: 28px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: var(--surface-shadow);
}

.settings-heading {
  display: grid;
  gap: 8px;
}

.settings-heading h1,
.settings-heading p {
  margin: 0;
}

.settings-heading h1 {
  color: #182033;
  font-size: 2rem;
  font-weight: 400;
  line-height: 1.15;
}

.settings-heading p {
  color: #657286;
}

.settings-content-body {
  min-width: 0;
  display: grid;
  align-content: start;
  gap: 28px;
}

@media (max-width: 980px) {
  .settings-page-layout {
    grid-template-columns: 1fr;
  }

  .settings-content-shell {
    min-height: auto;
  }
}

@media (max-width: 720px) {
  .settings-content-shell {
    padding: 28px 20px;
  }
}
</style>
