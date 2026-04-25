<script setup lang="ts">
import SettingsPageLayout from "../components/settings/SettingsPageLayout.vue";
</script>

<template>
  <SettingsPageLayout
    active-section="account"
    title="Account"
    subtitle="Manage account preferences and connected settings."
    title-id="account-title"
  >
    <article class="account-card">
      <p>Account settings will be available when account management is connected.</p>
    </article>
  </SettingsPageLayout>
</template>

<style scoped>
.account-card p {
  margin: 0;
}

.account-card p {
  color: #657286;
}

.account-card {
  padding: 28px;
  border: 1px solid #dfe5ea;
  border-radius: 14px;
  background: #ffffff;
}

@media (max-width: 720px) {
  .account-card {
    padding: 24px 20px;
  }
}
</style>
