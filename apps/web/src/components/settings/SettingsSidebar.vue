<script setup lang="ts">
import { RouterLink } from "vue-router";

defineProps<{
  activeSection: "profile" | "configuration" | "password";
}>();

function handleUpgrade() {
  console.info("Upgrade to Pro clicked");
}
</script>

<template>
  <aside class="settings-sidebar" aria-label="Configuration settings">
    <nav class="settings-nav" aria-label="Settings sections">
      <RouterLink
        class="settings-nav-link"
        :class="{ 'is-active': activeSection === 'profile' }"
        :to="{ name: 'profile' }"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
          <path d="M4.5 20a7.5 7.5 0 0 1 15 0" stroke-linecap="round" />
        </svg>
        <span>Profile</span>
      </RouterLink>

      <RouterLink
        class="settings-nav-link"
        :class="{ 'is-active': activeSection === 'configuration' }"
        :to="{ name: 'configuration' }"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <circle cx="12" cy="12" r="3" />
          <path
            d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.05.05a2.1 2.1 0 0 1-2.97 2.97l-.05-.05a1.8 1.8 0 0 0-1.98-.36 1.8 1.8 0 0 0-1.09 1.65V21.3a2.1 2.1 0 0 1-4.2 0v-.07a1.8 1.8 0 0 0-1.09-1.65 1.8 1.8 0 0 0-1.98.36l-.05.05a2.1 2.1 0 0 1-2.97-2.97l.05-.05A1.8 1.8 0 0 0 3.84 15a1.8 1.8 0 0 0-1.65-1.09H2.1a2.1 2.1 0 0 1 0-4.2h.09a1.8 1.8 0 0 0 1.65-1.09 1.8 1.8 0 0 0-.36-1.98l-.05-.05a2.1 2.1 0 0 1 2.97-2.97l.05.05a1.8 1.8 0 0 0 1.98.36 1.8 1.8 0 0 0 1.09-1.65V2.1a2.1 2.1 0 0 1 4.2 0v.29a1.8 1.8 0 0 0 1.09 1.65 1.8 1.8 0 0 0 1.98-.36l.05-.05a2.1 2.1 0 0 1 2.97 2.97l-.05.05a1.8 1.8 0 0 0-.36 1.98 1.8 1.8 0 0 0 1.65 1.09h.09a2.1 2.1 0 0 1 0 4.2h-.09A1.8 1.8 0 0 0 19.4 15Z"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span>Configuration</span>
      </RouterLink>

      <RouterLink
        class="settings-nav-link"
        :class="{ 'is-active': activeSection === 'password' }"
        :to="{ name: 'password' }"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <rect x="5" y="10" width="14" height="10" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke-linecap="round" />
          <path d="M12 14.5v1.75" stroke-linecap="round" />
        </svg>
        <span>Password</span>
      </RouterLink>
    </nav>

    <section class="upgrade-card" aria-labelledby="upgrade-title">
      <div class="upgrade-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
          <path
            d="m4.5 17.5 1.25-9 4.2 4.05L12 6l2.05 6.55 4.2-4.05 1.25 9h-15Z"
            stroke-linejoin="round"
          />
          <path d="M5.5 20h13" stroke-linecap="round" />
        </svg>
      </div>
      <h2 id="upgrade-title">Upgrade to Pro</h2>
      <p>Unlock advanced analytics, custom themes and more.</p>
      <button class="upgrade-button" type="button" @click="handleUpgrade">Upgrade now</button>
    </section>
  </aside>
</template>

<style scoped>
.settings-sidebar {
  height: 100%;
  padding: 20px 20px;
  border: var(--surface-border);
  border-radius: var(--surface-radius);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: var(--surface-shadow);
}

.settings-nav {
  display: grid;
  gap: 8px;
}

.settings-nav-link {
  width: 100%;
  min-height: 48px;
  padding: 0 18px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 18px;
  color: #293246;
  font-size: 1rem;
  font-weight: 800;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.settings-nav-link svg {
  width: 23px;
  height: 23px;
  flex-shrink: 0;
}

.settings-nav-link:hover,
.settings-nav-link.is-active {
  background: #e8fbf2;
  color: #10b981;
}

.upgrade-card {
  padding: 20px 18px 18px;
  border: 1px solid #d6f3e7;
  border-radius: 16px;
  display: grid;
  justify-items: center;
  gap: 8px;
  background:
    radial-gradient(circle at center 20%, rgba(16, 185, 129, 0.14), transparent 45%),
    linear-gradient(180deg, #f5fffa 0%, #f9fffc 100%);
  text-align: center;
}

.upgrade-icon {
  width: 52px;
  height: 52px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #dff9ee;
  color: #10b981;
}

.upgrade-icon svg {
  width: 26px;
  height: 26px;
}

.upgrade-card h2,
.upgrade-card p {
  margin: 0;
}

.upgrade-card h2 {
  color: #10b981;
  font-size: 1.1rem;
  line-height: 1.2;
}

.upgrade-card p {
  max-width: 220px;
  color: #657286;
  line-height: 1.55;
}

.upgrade-button {
  width: 100%;
  min-height: 44px;
  margin-top: 4px;
  border: 0;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #10b981;
  color: #ffffff;
  box-shadow: 0 12px 22px rgba(16, 185, 129, 0.16);
  font-weight: 800;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease;
}

.upgrade-button:hover {
  transform: translateY(-1px);
  background: #0ea873;
}

@media (max-width: 860px) {
  .settings-sidebar {
    min-height: auto;
    padding: 20px;
  }

  .settings-nav {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .settings-nav-link {
    justify-content: center;
  }
}

@media (max-width: 560px) {
  .settings-nav {
    grid-template-columns: 1fr;
  }

  .settings-nav-link {
    justify-content: flex-start;
  }
}
</style>
