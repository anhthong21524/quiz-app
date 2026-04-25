<script setup lang="ts">
import { computed } from "vue";
import { getPasswordRuleStatuses } from "../../lib/validation/validators";
import { passwordHintText } from "../../lib/validation/errorMessages";

const props = defineProps<{
  id?: string;
  password: string;
  confirmPassword?: string;
  showConfirmation?: boolean;
}>();

const rules = computed(() =>
  getPasswordRuleStatuses(
    props.password,
    props.confirmPassword ?? "",
    props.showConfirmation ?? false
  )
);
</script>

<template>
  <div :id="id" class="password-hint">
    <button
      type="button"
      class="password-hint-trigger"
      :aria-describedby="id ? `${id}-details` : undefined"
    >
      <span>Use 8-72 characters.</span>
      <span class="hint-icon" aria-hidden="true">?</span>
    </button>

    <div :id="id ? `${id}-details` : undefined" class="password-hint-panel" role="tooltip">
      <p>{{ passwordHintText }}</p>
      <ul aria-label="Password requirements">
        <li
          v-for="rule in rules"
          :key="rule.id"
          :class="{ 'is-passing': rule.passed }"
        >
          <span aria-hidden="true">{{ rule.passed ? "+" : "*" }}</span>
          {{ rule.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.password-hint {
  position: relative;
  width: fit-content;
  max-width: 100%;
  color: #64748b;
  font-size: 0.82rem;
  line-height: 1.4;
}

.password-hint-trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: 100%;
  border: 0;
  background: transparent;
  color: #64748b;
  padding: 0;
  font: inherit;
  text-align: left;
}

.password-hint-trigger:hover,
.password-hint-trigger:focus-visible {
  color: #047857;
}

.password-hint-trigger:focus-visible {
  outline: 3px solid rgba(18, 196, 139, 0.18);
  outline-offset: 2px;
}

.hint-icon {
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
  display: inline-grid;
  place-items: center;
  border-radius: 50%;
  border: 1px solid #cbd5e1;
  color: #64748b;
  font-size: 11px;
  font-weight: 700;
}

.password-hint-panel {
  position: absolute;
  left: 0;
  top: calc(100% + 8px);
  z-index: 20;
  width: min(360px, calc(100vw - 48px));
  display: grid;
  gap: 8px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  color: #475569;
  padding: 10px 12px;
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.12);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-4px);
  transition:
    opacity 0.15s ease,
    transform 0.15s ease,
    visibility 0.15s ease;
}

.password-hint:hover .password-hint-panel,
.password-hint:focus-within .password-hint-panel {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.password-hint-panel p,
.password-hint-panel ul {
  margin: 0;
}

.password-hint-panel ul {
  display: grid;
  gap: 4px;
  padding: 0;
  list-style: none;
}

.password-hint-panel li {
  display: flex;
  align-items: center;
  gap: 6px;
}

.password-hint-panel li.is-passing {
  color: #047857;
}
</style>
