<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import SettingsPageLayout from "../../components/settings/SettingsPageLayout.vue";
import { updatePassword } from "../../services/auth-api";

type PasswordField = "currentPassword" | "newPassword" | "confirmPassword";

interface PasswordRule {
  label: string;
  passed: boolean;
}

const form = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: ""
});

const touched = reactive<Record<PasswordField, boolean>>({
  currentPassword: false,
  newPassword: false,
  confirmPassword: false
});

const visibility = reactive<Record<PasswordField, boolean>>({
  currentPassword: false,
  newPassword: false,
  confirmPassword: false
});

const submitted = ref(false);
const isSubmitting = ref(false);
const successMessage = ref("");
const formError = ref("");

const passwordRules = computed<PasswordRule[]>(() => [
  {
    label: "Uppercase letter (A-Z)",
    passed: /[A-Z]/.test(form.newPassword)
  },
  {
    label: "Lowercase letter (a-z)",
    passed: /[a-z]/.test(form.newPassword)
  },
  {
    label: "Number (0-9)",
    passed: /[0-9]/.test(form.newPassword)
  },
  {
    label: "Special character (!@#$%^&*)",
    passed: /[!@#$%^&*]/.test(form.newPassword)
  }
]);

const isNewPasswordComplete = computed(
  () => form.newPassword.length >= 8 && passwordRules.value.every((rule) => rule.passed)
);

const fieldErrors = computed<Record<PasswordField, string>>(() => ({
  currentPassword:
    shouldValidate("currentPassword") && !form.currentPassword
      ? "Current password is required."
      : "",
  newPassword:
    shouldValidate("newPassword") && !form.newPassword
      ? "New password is required."
      : shouldValidate("newPassword") && !isNewPasswordComplete.value
        ? "Use at least 8 characters with uppercase, lowercase, number, and special character."
        : "",
  confirmPassword:
    shouldValidate("confirmPassword") && !form.confirmPassword
      ? "Confirm password is required."
      : shouldValidate("confirmPassword") && form.confirmPassword !== form.newPassword
        ? "Confirm password must match the new password."
        : ""
}));

const isFormValid = computed(
  () =>
    Boolean(form.currentPassword) &&
    Boolean(form.newPassword) &&
    Boolean(form.confirmPassword) &&
    isNewPasswordComplete.value &&
    form.confirmPassword === form.newPassword
);

function shouldValidate(field: PasswordField) {
  return touched[field] || submitted.value;
}

function inputType(field: PasswordField) {
  return visibility[field] ? "text" : "password";
}

function toggleVisibility(field: PasswordField) {
  visibility[field] = !visibility[field];
}

function markTouched(field: PasswordField) {
  touched[field] = true;
}

function clearForm() {
  form.currentPassword = "";
  form.newPassword = "";
  form.confirmPassword = "";
  touched.currentPassword = false;
  touched.newPassword = false;
  touched.confirmPassword = false;
  submitted.value = false;
}

async function handleSubmit() {
  submitted.value = true;
  successMessage.value = "";
  formError.value = "";

  if (!isFormValid.value || isSubmitting.value) {
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await updatePassword({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword
    });

    successMessage.value = response.message;
    clearForm();
  } catch {
    formError.value = "We could not update your password. Please check your current password and try again.";
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <SettingsPageLayout
    active-section="password"
    title="Password"
    subtitle="Manage your password to keep your account secure."
    title-id="password-title"
  >
      <article class="password-card" aria-labelledby="change-password-title">
        <h2 id="change-password-title">Change password</h2>

        <div
          v-if="successMessage"
          class="password-alert is-success"
          role="status"
          aria-live="polite"
        >
          {{ successMessage }}
        </div>

        <div v-if="formError" class="password-alert is-error" role="alert">
          {{ formError }}
        </div>

        <form class="password-form" novalidate @submit.prevent="handleSubmit">
          <div class="password-field">
            <label for="current-password">Current password</label>
            <div class="password-input-wrap">
              <svg
                class="password-input-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                aria-hidden="true"
              >
                <rect x="5" y="10" width="14" height="10" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke-linecap="round" />
                <path d="M12 14.5v1.75" stroke-linecap="round" />
              </svg>
              <input
                id="current-password"
                v-model="form.currentPassword"
                :type="inputType('currentPassword')"
                autocomplete="current-password"
                placeholder="Enter your current password"
                :aria-invalid="Boolean(fieldErrors.currentPassword)"
                aria-describedby="current-password-error"
                @blur="markTouched('currentPassword')"
              />
              <button
                class="password-visibility-button"
                type="button"
                :aria-label="visibility.currentPassword ? 'Hide current password' : 'Show current password'"
                @click="toggleVisibility('currentPassword')"
              >
                <svg
                  v-if="visibility.currentPassword"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  aria-hidden="true"
                >
                  <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <svg
                  v-else
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  aria-hidden="true"
                >
                  <path d="M3 3l18 18" stroke-linecap="round" />
                  <path d="M10.7 5.2A9.8 9.8 0 0 1 12 5c6 0 9.5 7 9.5 7a16.1 16.1 0 0 1-3 3.9" />
                  <path d="M14.1 14.1A3 3 0 0 1 9.9 9.9" />
                  <path d="M6.6 6.8A16.7 16.7 0 0 0 2.5 12s3.5 7 9.5 7a9.2 9.2 0 0 0 4.3-1.1" />
                </svg>
              </button>
            </div>
            <p v-if="fieldErrors.currentPassword" id="current-password-error" class="field-error">
              {{ fieldErrors.currentPassword }}
            </p>
          </div>

          <div class="password-field">
            <label for="new-password">New password</label>
            <div class="password-input-wrap">
              <svg
                class="password-input-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                aria-hidden="true"
              >
                <rect x="5" y="10" width="14" height="10" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke-linecap="round" />
                <path d="M12 14.5v1.75" stroke-linecap="round" />
              </svg>
              <input
                id="new-password"
                v-model="form.newPassword"
                :type="inputType('newPassword')"
                autocomplete="new-password"
                placeholder="Enter your new password"
                :aria-invalid="Boolean(fieldErrors.newPassword)"
                aria-describedby="new-password-error password-rules"
                @blur="markTouched('newPassword')"
              />
              <button
                class="password-visibility-button"
                type="button"
                :aria-label="visibility.newPassword ? 'Hide new password' : 'Show new password'"
                @click="toggleVisibility('newPassword')"
              >
                <svg
                  v-if="visibility.newPassword"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  aria-hidden="true"
                >
                  <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <svg
                  v-else
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  aria-hidden="true"
                >
                  <path d="M3 3l18 18" stroke-linecap="round" />
                  <path d="M10.7 5.2A9.8 9.8 0 0 1 12 5c6 0 9.5 7 9.5 7a16.1 16.1 0 0 1-3 3.9" />
                  <path d="M14.1 14.1A3 3 0 0 1 9.9 9.9" />
                  <path d="M6.6 6.8A16.7 16.7 0 0 0 2.5 12s3.5 7 9.5 7a9.2 9.2 0 0 0 4.3-1.1" />
                </svg>
              </button>
            </div>
            <p v-if="fieldErrors.newPassword" id="new-password-error" class="field-error">
              {{ fieldErrors.newPassword }}
            </p>

            <div id="password-rules" class="password-rules" aria-live="polite">
              <p>Password must be at least 8 characters and include:</p>
              <ul>
                <li
                  v-for="rule in passwordRules"
                  :key="rule.label"
                  :class="{ 'is-passed': rule.passed }"
                >
                  <span class="rule-check" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="m6.5 12.5 3.5 3.5 7.5-8" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </span>
                  <span>{{ rule.label }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="password-field">
            <label for="confirm-password">Confirm new password</label>
            <div class="password-input-wrap">
              <svg
                class="password-input-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                aria-hidden="true"
              >
                <rect x="5" y="10" width="14" height="10" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke-linecap="round" />
                <path d="M12 14.5v1.75" stroke-linecap="round" />
              </svg>
              <input
                id="confirm-password"
                v-model="form.confirmPassword"
                :type="inputType('confirmPassword')"
                autocomplete="new-password"
                placeholder="Confirm your new password"
                :aria-invalid="Boolean(fieldErrors.confirmPassword)"
                aria-describedby="confirm-password-error"
                @blur="markTouched('confirmPassword')"
              />
              <button
                class="password-visibility-button"
                type="button"
                :aria-label="visibility.confirmPassword ? 'Hide confirm password' : 'Show confirm password'"
                @click="toggleVisibility('confirmPassword')"
              >
                <svg
                  v-if="visibility.confirmPassword"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  aria-hidden="true"
                >
                  <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <svg
                  v-else
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  aria-hidden="true"
                >
                  <path d="M3 3l18 18" stroke-linecap="round" />
                  <path d="M10.7 5.2A9.8 9.8 0 0 1 12 5c6 0 9.5 7 9.5 7a16.1 16.1 0 0 1-3 3.9" />
                  <path d="M14.1 14.1A3 3 0 0 1 9.9 9.9" />
                  <path d="M6.6 6.8A16.7 16.7 0 0 0 2.5 12s3.5 7 9.5 7a9.2 9.2 0 0 0 4.3-1.1" />
                </svg>
              </button>
            </div>
            <p v-if="fieldErrors.confirmPassword" id="confirm-password-error" class="field-error">
              {{ fieldErrors.confirmPassword }}
            </p>
          </div>

          <div class="password-action-row">
            <button class="update-password-button" type="submit" :disabled="!isFormValid || isSubmitting">
              {{ isSubmitting ? "Updating..." : "Update password" }}
            </button>
          </div>
        </form>
      </article>
  </SettingsPageLayout>
</template>

<style scoped>
.password-card h2,
.password-rules p {
  margin: 0;
}

.password-rules {
  color: #657286;
}

.password-card {
  display: grid;
  align-content: start;
  gap: 12px;
  padding: 18px 28px 0;
  border: 1px solid #dfe5ea;
  border-radius: 14px;
  background: #ffffff;
}

.password-card h2 {
  color: #182033;
  font-size: 1.15rem;
  font-weight: 800;
  line-height: 1.25;
}

.password-form {
  display: grid;
  gap: 13px;
}

.password-field {
  display: grid;
  gap: 9px;
}

.password-field label {
  color: #58657a;
  font-weight: 700;
}

.password-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-wrap input {
  width: 100%;
  min-height: 46px;
  padding: 0 54px;
  border: 1px solid #d7dee8;
  border-radius: 11px;
  background: #ffffff;
  color: #182033;
  box-shadow: inset 0 1px 1px rgba(15, 23, 42, 0.02);
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.password-input-wrap input::placeholder {
  color: #8390a4;
}

.password-input-wrap input:focus {
  border-color: rgba(16, 185, 129, 0.72);
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.11);
}

.password-input-wrap input[aria-invalid="true"] {
  border-color: #ef4444;
}

.password-input-icon,
.password-visibility-button {
  position: absolute;
  color: #64748b;
}

.password-input-icon {
  left: 16px;
  width: 22px;
  height: 22px;
  pointer-events: none;
}

.password-visibility-button {
  right: 12px;
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: transparent;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.password-visibility-button:hover {
  background: #eef9f4;
  color: #10b981;
}

.password-visibility-button svg {
  width: 21px;
  height: 21px;
}

.field-error {
  margin: 0;
  color: #b91c1c;
  font-size: 0.9rem;
  font-weight: 700;
}

.password-rules {
  display: grid;
  gap: 8px;
  font-size: 0.88rem;
}

.password-rules ul {
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: nowrap;
  gap: 12px;
  list-style: none;
  white-space: nowrap;
}

.password-rules li {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #788398;
  font-weight: 700;
}

.password-rules li.is-passed {
  color: #10b981;
}

.rule-check {
  width: 17px;
  height: 17px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #eef1f4;
  color: #9aa4b2;
}

.rule-check svg {
  width: 13px;
  height: 13px;
}

.password-rules li.is-passed .rule-check {
  background: #dff9ee;
  color: #10b981;
}

.password-action-row {
  min-height: 58px;
  border-top: 1px solid #dfe5ea;
  display: flex;
  align-items: center;
}

.update-password-button {
  min-height: 44px;
  padding: 0 24px;
  border: 0;
  border-radius: 9px;
  background: #10b981;
  color: #ffffff;
  box-shadow: 0 12px 22px rgba(16, 185, 129, 0.16);
  font-weight: 800;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    opacity 0.2s ease;
}

.update-password-button:hover:not(:disabled) {
  transform: translateY(-1px);
  background: #0ea873;
}

.update-password-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.password-alert {
  padding: 12px 14px;
  border-radius: 11px;
  font-weight: 700;
}

.password-alert.is-success {
  border: 1px solid #bdebd8;
  background: #effdf6;
  color: #047857;
}

.password-alert.is-error {
  border: 1px solid #fecaca;
  background: #fff1f2;
  color: #b91c1c;
}

@media (max-width: 720px) {
  .password-card {
    padding: 20px 20px 0;
  }
}

@media (max-width: 560px) {
  .password-rules ul {
    overflow-x: auto;
    padding-bottom: 4px;
  }

  .update-password-button {
    width: 100%;
  }
}
</style>
