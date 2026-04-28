<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import FieldErrorText from "../../components/forms/FieldErrorText.vue";
import FormErrorBanner from "../../components/forms/FormErrorBanner.vue";
import PasswordHint from "../../components/forms/PasswordHint.vue";
import { env } from "../../config/env";
import { useI18n } from "../../i18n";
import { getGoogleAuthStatus } from "../../services/auth-api";
import { useAuthStore } from "../../stores/auth";
import { isAppError } from "../../lib/api/errors";
import {
  validateLoginForm,
  validateRegisterForm,
  type AuthFieldErrors,
  type LoginFormValues,
  type RegisterFormValues
} from "../../lib/validation/authSchema";
import {
  loginPayloadFrom,
  normalizeAuthError,
  registerPayloadFrom
} from "../../lib/validation/normalizeAuthError";
import type { AuthFieldName } from "../../lib/validation/validators";

type FieldFlags = Partial<Record<AuthFieldName, boolean>>;

type AuthMode = "signIn" | "createAccount";

type BrandMessage = {
  title: string;
  description: string;
};

const BRAND_ROTATION_MS = 4000;
const ADMIN_EMAIL = "admin@quiz.app";
const ADMIN_PASSWORD = "admin1234";
const { t, tm } = useI18n();

const loginForm = reactive<LoginFormValues>({
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD
});
const registerForm = reactive<RegisterFormValues>({
  name: "",
  email: "",
  password: "",
  confirmPassword: ""
});
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const isSubmitting = ref(false);
const isCheckingGoogleAuth = ref(false);
const googleAuthEnabled = ref<boolean | null>(null);
const authMode = ref<AuthMode>("signIn");
const activeBrandIndex = ref(0);
const submitAttempted = ref(false);
const loginTouched = reactive<FieldFlags>({});
const registerTouched = reactive<FieldFlags>({});
const loginDirty = reactive<FieldFlags>({});
const registerDirty = reactive<FieldFlags>({});
const loginServerErrors = reactive<AuthFieldErrors>({});
const registerServerErrors = reactive<AuthFieldErrors>({});
const formError = ref("");
const brandMessages = computed(() => tm<BrandMessage[]>("login.brandMessages"));

const isSignIn = computed(() => authMode.value === "signIn");
const authTitle = computed(() =>
  isSignIn.value ? t("login.titleSignIn") : t("login.titleCreateAccount")
);
const passwordInputType = computed(() => (showPassword.value ? "text" : "password"));
const confirmPasswordInputType = computed(() =>
  showConfirmPassword.value ? "text" : "password"
);
const panelContent = computed(() => brandMessages.value[activeBrandIndex.value]);
const submitLabel = computed(() => (isSignIn.value ? t("login.actions.signIn") : t("login.actions.createAccount")));
const loadingLabel = computed(() =>
  isSignIn.value ? t("login.actions.signingIn") : t("login.actions.creatingAccount")
);
const loginValidation = computed(() => validateLoginForm(loginForm));
const registerValidation = computed(() => validateRegisterForm(registerForm));
const activeValidation = computed(() =>
  isSignIn.value ? loginValidation.value : registerValidation.value
);
const activeTouched = computed(() => (isSignIn.value ? loginTouched : registerTouched));
const activeDirty = computed(() => (isSignIn.value ? loginDirty : registerDirty));
const activeServerErrors = computed(() =>
  isSignIn.value ? loginServerErrors : registerServerErrors
);
const isSubmitDisabled = computed(
  () => isSubmitting.value || !activeValidation.value.isValid
);
const authStore = useAuthStore();
const router = useRouter();

let brandRotationTimer: number | undefined;

const clearObject = (target: Record<string, unknown>) => {
  for (const key of Object.keys(target)) {
    delete target[key];
  }
};

const resetInteractionState = () => {
  submitAttempted.value = false;
  formError.value = "";
  clearObject(loginTouched);
  clearObject(registerTouched);
  clearObject(loginDirty);
  clearObject(registerDirty);
  clearObject(loginServerErrors);
  clearObject(registerServerErrors);
};

const resetFormState = () => {
  loginForm.email = ADMIN_EMAIL;
  loginForm.password = ADMIN_PASSWORD;
  registerForm.name = "";
  registerForm.email = "";
  registerForm.password = "";
  registerForm.confirmPassword = "";
  showPassword.value = false;
  showConfirmPassword.value = false;
  isSubmitting.value = false;
  resetInteractionState();
};

const switchMode = (mode: AuthMode) => {
  authMode.value = mode;
  showPassword.value = false;
  showConfirmPassword.value = false;
  isSubmitting.value = false;
  resetInteractionState();
};

const markFieldTouched = (field: AuthFieldName) => {
  activeTouched.value[field] = true;
};

const handleFieldInput = (field: AuthFieldName) => {
  activeDirty.value[field] = true;
  delete activeServerErrors.value[field];
  formError.value = "";
};

const shouldShowFieldError = (field: AuthFieldName) =>
  Boolean(submitAttempted.value || activeTouched.value[field]);

const fieldError = (field: AuthFieldName) => {
  const clientError = activeValidation.value.fieldErrors[field];

  if (clientError && shouldShowFieldError(field)) {
    return clientError;
  }

  return activeServerErrors.value[field] ?? "";
};

const applyServerErrors = (fieldErrors: AuthFieldErrors) => {
  const target = activeServerErrors.value;
  clearObject(target);

  for (const [field, message] of Object.entries(fieldErrors)) {
    target[field as AuthFieldName] = message;
  }
};

const handleSubmit = async () => {
  submitAttempted.value = true;
  formError.value = "";
  clearObject(activeServerErrors.value);

  if (!activeValidation.value.isValid) {
    return;
  }

  isSubmitting.value = true;

  try {
    if (isSignIn.value) {
      const payload = loginPayloadFrom(loginValidation.value.values);
      await authStore.login(payload.email, payload.password);
    } else {
      const payload = registerPayloadFrom(registerValidation.value.values);
      await authStore.register(payload.email, payload.password);
    }

    await router.push({ name: "quizzes" });
  } catch (error) {
    if (isAppError(error)) {
      const context = isSignIn.value ? "login" : "register";
      const normalizedError = normalizeAuthError(error, context);
      applyServerErrors(normalizedError.fieldErrors);
      formError.value = normalizedError.formError;
    } else {
      formError.value = t("login.errors.generic");
    }
  } finally {
    isSubmitting.value = false;
  }
};

const loadGoogleAuthStatus = async () => {
  try {
    googleAuthEnabled.value = (await getGoogleAuthStatus()).enabled;
  } catch (error) {
    console.warn("Unable to check Google sign-in status.", error);
    googleAuthEnabled.value = null;
  }
};

const handleGoogleSignIn = async () => {
  formError.value = "";
  isCheckingGoogleAuth.value = true;

  try {
    if (googleAuthEnabled.value === null) {
      await loadGoogleAuthStatus();
    }

    if (googleAuthEnabled.value === false) {
      formError.value = t("login.errors.googleUnavailable");
      return;
    }

    window.location.href = `${env.apiBaseUrl}/auth/google`;
  } finally {
    isCheckingGoogleAuth.value = false;
  }
};

const handleForgotPassword = () => {
  // TODO: Route to the password recovery flow when it exists.
};

onMounted(() => {
  void loadGoogleAuthStatus();

  brandRotationTimer = window.setInterval(() => {
    activeBrandIndex.value = (activeBrandIndex.value + 1) % brandMessages.value.length;
  }, BRAND_ROTATION_MS);
});

onBeforeUnmount(() => {
  if (brandRotationTimer !== undefined) {
    window.clearInterval(brandRotationTimer);
  }
});
</script>

<template>
  <section class="login-page">
    <div class="login-card">
      <aside class="brand-panel" aria-hidden="true">
        <div class="brand-mark">
          <div class="brand-badge">Q</div>
          <span>{{ t("common.appName") }}</span>
        </div>

        <Transition name="brand-copy" mode="out-in">
          <div :key="activeBrandIndex" class="brand-copy">
            <h2>{{ panelContent.title }}</h2>
            <p>{{ panelContent.description }}</p>
          </div>
        </Transition>
      </aside>

      <main class="form-panel">
        <div class="form-shell">
          <h1 class="auth-title">{{ authTitle }}</h1>

          <div class="tabs" role="tablist" :aria-label="t('login.authOptions')">
            <button
              type="button"
              class="tab"
              :class="{ 'is-active': isSignIn }"
              role="tab"
              :aria-selected="isSignIn"
              @click="switchMode('signIn')"
            >
              {{ t("login.tabSignIn") }}
            </button>
            <button
              type="button"
              class="tab"
              :class="{ 'is-active': !isSignIn }"
              role="tab"
              :aria-selected="!isSignIn"
              @click="switchMode('createAccount')"
            >
              {{ t("login.tabCreateAccount") }}
            </button>
          </div>

          <div class="form-stage">
            <section
              class="auth-form-panel"
              :class="{ 'is-active': isSignIn }"
              :aria-hidden="!isSignIn"
            >
              <div class="sign-in-extras">
                <button
                  type="button"
                  class="social-button"
                  :tabindex="isSignIn ? 0 : -1"
                  :disabled="isCheckingGoogleAuth"
                  :aria-disabled="googleAuthEnabled === false"
                  @click="handleGoogleSignIn"
                >
                  <svg viewBox="0 0 18 18" aria-hidden="true">
                    <path
                      d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
                      fill="#34A853"
                    />
                    <path
                      d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>{{ isCheckingGoogleAuth ? t("login.checkingGoogle") : t("login.continueWithGoogle") }}</span>
                </button>

                <div class="divider" aria-hidden="true">
                  <span></span>
                  <p>{{ t("login.divider") }}</p>
                  <span></span>
                </div>
              </div>

              <form class="login-form" @submit.prevent="handleSubmit" novalidate>
                <div class="field-group">
                  <label for="signin-email">{{ t("login.fields.email") }}</label>
                  <input
                    id="signin-email"
                    v-model="loginForm.email"
                    type="email"
                    name="email"
                    autocomplete="email"
                    :placeholder="t('login.placeholders.email')"
                    :aria-invalid="Boolean(fieldError('email'))"
                    :aria-describedby="fieldError('email') ? 'signin-email-error' : undefined"
                    @blur="markFieldTouched('email')"
                    @input="handleFieldInput('email')"
                  />
                  <FieldErrorText id="signin-email-error" :message="fieldError('email')" />
                </div>

                <div class="field-group">
                  <label for="signin-password">{{ t("login.fields.password") }}</label>
                  <div class="password-field">
                    <input
                      id="signin-password"
                      v-model="loginForm.password"
                      :type="passwordInputType"
                      name="password"
                      autocomplete="current-password"
                      :placeholder="t('login.placeholders.password')"
                      :aria-invalid="Boolean(fieldError('password'))"
                      :aria-describedby="fieldError('password') ? 'signin-password-error' : undefined"
                      @blur="markFieldTouched('password')"
                      @input="handleFieldInput('password')"
                    />
                    <button
                      type="button"
                      class="password-toggle"
                      :aria-label="showPassword ? t('login.visibility.hidePassword') : t('login.visibility.showPassword')"
                      @click="showPassword = !showPassword"
                    >
                      <svg
                        v-if="showPassword"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <svg
                        v-else
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M3 3l18 18" />
                        <path d="M10.6 10.7A2.99 2.99 0 0 0 9 13a3 3 0 0 0 5.2 2.1" />
                        <path
                          d="M9.9 4.24A9.77 9.77 0 0 1 12 4c6.4 0 10 8 10 8a18.4 18.4 0 0 1-3.2 4.2"
                        />
                        <path d="M6.6 6.64C4.2 8.18 2 12 2 12a18.7 18.7 0 0 0 5.17 5.47" />
                      </svg>
                    </button>
                  </div>
                  <FieldErrorText id="signin-password-error" :message="fieldError('password')" />
                </div>

                <div class="form-links">
                  <button type="button" class="text-link" @click="handleForgotPassword">
                    {{ t("login.actions.forgotPassword") }}
                  </button>
                </div>

                <FormErrorBanner :message="formError" />

                <button
                  type="submit"
                  class="submit-button"
                  :disabled="isSubmitDisabled"
                  :aria-busy="isSubmitting"
                  :aria-label="isSubmitting ? loadingLabel : undefined"
                >
                  <span v-if="isSubmitting" class="spinner" aria-hidden="true"></span>
                  <span>{{ isSubmitting ? loadingLabel : submitLabel }}</span>
                </button>
              </form>
            </section>

            <section
              class="auth-form-panel auth-form-panel-signup"
              :class="{ 'is-active': !isSignIn }"
              :aria-hidden="isSignIn"
            >
              <form class="login-form create-account" @submit.prevent="handleSubmit" novalidate>
                <div class="field-group">
                  <label for="signup-email">{{ t("login.fields.email") }}</label>
                  <input
                    id="signup-email"
                    v-model="registerForm.email"
                    type="email"
                    name="email"
                    autocomplete="email"
                    :placeholder="t('login.placeholders.email')"
                    :aria-invalid="Boolean(fieldError('email'))"
                    :aria-describedby="fieldError('email') ? 'signup-email-error' : undefined"
                    @blur="markFieldTouched('email')"
                    @input="handleFieldInput('email')"
                  />
                  <FieldErrorText id="signup-email-error" :message="fieldError('email')" />
                </div>

                <div class="field-group">
                  <label for="signup-password">{{ t("login.fields.password") }}</label>
                  <div class="password-field">
                    <input
                      id="signup-password"
                      v-model="registerForm.password"
                      :type="passwordInputType"
                      name="password"
                      autocomplete="new-password"
                      :placeholder="t('login.placeholders.password')"
                      :aria-invalid="Boolean(fieldError('password'))"
                      :aria-describedby="
                        ['signup-password-hint', fieldError('password') ? 'signup-password-error' : undefined]
                          .filter(Boolean)
                          .join(' ')
                      "
                      @blur="markFieldTouched('password')"
                      @input="handleFieldInput('password')"
                    />
                    <button
                      type="button"
                      class="password-toggle"
                      :aria-label="showPassword ? t('login.visibility.hidePassword') : t('login.visibility.showPassword')"
                      @click="showPassword = !showPassword"
                    >
                      <svg
                        v-if="showPassword"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <svg
                        v-else
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M3 3l18 18" />
                        <path d="M10.6 10.7A2.99 2.99 0 0 0 9 13a3 3 0 0 0 5.2 2.1" />
                        <path
                          d="M9.9 4.24A9.77 9.77 0 0 1 12 4c6.4 0 10 8 10 8a18.4 18.4 0 0 1-3.2 4.2"
                        />
                        <path d="M6.6 6.64C4.2 8.18 2 12 2 12a18.7 18.7 0 0 0 5.17 5.47" />
                      </svg>
                    </button>
                  </div>
                  <FieldErrorText id="signup-password-error" :message="fieldError('password')" />
                </div>

                <PasswordHint
                  id="signup-password-hint"
                  :password="registerForm.password"
                  :confirm-password="registerForm.confirmPassword"
                  show-confirmation
                />

                <div class="field-group">
                  <label for="signup-confirm-password">{{ t("login.fields.confirmPassword") }}</label>
                  <div class="password-field">
                    <input
                      id="signup-confirm-password"
                      v-model="registerForm.confirmPassword"
                      :type="confirmPasswordInputType"
                      name="confirmPassword"
                      autocomplete="new-password"
                      :placeholder="t('login.placeholders.confirmPassword')"
                      :aria-invalid="Boolean(fieldError('confirmPassword'))"
                      :aria-describedby="
                        fieldError('confirmPassword') ? 'signup-confirm-password-error' : undefined
                      "
                      @blur="markFieldTouched('confirmPassword')"
                      @input="handleFieldInput('confirmPassword')"
                    />
                    <button
                      type="button"
                      class="password-toggle"
                      :aria-label="showConfirmPassword ? t('login.visibility.hideConfirmPassword') : t('login.visibility.showConfirmPassword')"
                      @click="showConfirmPassword = !showConfirmPassword"
                    >
                      <svg
                        v-if="showConfirmPassword"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <svg
                        v-else
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M3 3l18 18" />
                        <path d="M10.6 10.7A2.99 2.99 0 0 0 9 13a3 3 0 0 0 5.2 2.1" />
                        <path
                          d="M9.9 4.24A9.77 9.77 0 0 1 12 4c6.4 0 10 8 10 8a18.4 18.4 0 0 1-3.2 4.2"
                        />
                        <path d="M6.6 6.64C4.2 8.18 2 12 2 12a18.7 18.7 0 0 0 5.17 5.47" />
                      </svg>
                    </button>
                  </div>
                  <FieldErrorText
                    id="signup-confirm-password-error"
                    :message="fieldError('confirmPassword')"
                  />
                </div>

                <FormErrorBanner :message="formError" />

                <button
                  type="submit"
                  class="submit-button"
                  :disabled="isSubmitDisabled"
                  :aria-busy="isSubmitting"
                  :aria-label="isSubmitting ? loadingLabel : undefined"
                >
                  <span v-if="isSubmitting" class="spinner" aria-hidden="true"></span>
                  <span>{{ isSubmitting ? loadingLabel : submitLabel }}</span>
                </button>
              </form>
            </section>
          </div>
        </div>
      </main>
    </div>
  </section>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap");

:global(:root) {
  color: #1f2933;
}

.login-page {
  --page-bg: #f0eeeb;
  --card-radius: 12px;
  --card-shadow: 0 4px 40px rgba(0, 0, 0, 0.12);
  --brand-bg: #10b981;
  --brand-text-soft: rgba(255, 255, 255, 0.74);
  --panel-border: #e5e5e5;
  --field-border: #dddddd;
  --field-border-strong: #12c48b;
  --field-error: #c2410c;
  --button-shadow: 0 12px 22px rgba(16, 185, 129, 0.18);
  min-height: calc(100vh - 128px);
  display: grid;
  place-items: center;
  padding: 32px 20px;
  background: var(--page-bg);
  font-family: "DM Sans", sans-serif;
}

.login-card {
  width: 100%;
  max-width: 920px;
  margin: 0 auto;
  min-height: 620px;
  display: grid;
  grid-template-columns: 340px minmax(0, 1fr);
  border-radius: var(--card-radius);
  overflow: hidden;
  background: #ffffff;
  box-shadow: var(--card-shadow);
}

.brand-panel {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 24px;
  padding: 42px 36px;
  background: var(--brand-bg);
}

.brand-mark {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 600;
}

.brand-badge {
  width: 32px;
  height: 32px;
  display: inline-grid;
  place-items: center;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.18);
  color: #ffffff;
  font-family: "DM Serif Display", serif;
  font-size: 1rem;
  font-weight: 700;
}

.brand-copy {
  display: grid;
  gap: 12px;
  margin-top: 36px;
}

.brand-copy-enter-active,
.brand-copy-leave-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}

.brand-copy-enter-from,
.brand-copy-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.brand-copy h2 {
  margin: 0;
  max-width: 220px;
  color: #ffffff;
  font-family: "DM Serif Display", serif;
  font-size: 42px;
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: 0;
}

.brand-copy p {
  margin: 0;
  max-width: 220px;
  color: var(--brand-text-soft);
  font-size: 15px;
  line-height: 1.6;
}

.form-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #ffffff;
  padding: 42px 44px;
}

.form-shell {
  width: 100%;
  max-width: 460px;
  margin: 0 auto;
  display: grid;
  gap: 14px;
}

.auth-title {
  margin: 0;
  color: #1a1a1a;
  font-size: 28px;
  line-height: 1.2;
  letter-spacing: 0;
}

.form-stage {
  width: 100%;
}

.auth-form-panel {
  box-sizing: border-box;
  display: none;
  flex-direction: column;
  gap: 16px;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.auth-form-panel.is-active {
  display: flex;
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.sign-in-extras {
  display: grid;
  gap: 14px;
  padding-top: 6px;
}

.tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  padding: 4px;
  border-radius: 8px;
  background: #f5f2ed;
}

.tab {
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #9a8f84;
  padding: 11px 16px;
  font-weight: 600;
  font-size: 14px;
  transition:
    background-color 0.18s ease,
    color 0.18s ease,
    transform 0.18s ease;
}

.tab:hover,
.tab:focus-visible {
  color: #312f2b;
}

.tab:focus-visible,
.social-button:focus-visible,
.submit-button:focus-visible,
.text-link:focus-visible,
.password-toggle:focus-visible,
.field-group input:focus-visible {
  outline: 3px solid rgba(18, 196, 139, 0.18);
  outline-offset: 2px;
}

.tab.is-active {
  background: #ffffff;
  color: #111111;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

.social-button,
.submit-button {
  width: 100%;
  min-height: 44px;
  border-radius: 8px;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease,
    background-color 0.18s ease;
}

.social-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1.5px solid var(--panel-border);
  background: #ffffff;
  color: #333333;
  font-weight: 500;
  font-size: 13px;
}

.social-button svg {
  width: 18px;
  height: 18px;
}

.social-button:hover {
  transform: translateY(-1px);
  border-color: #cec6bd;
}

.social-button:disabled {
  cursor: wait;
  transform: none;
}

.social-button[aria-disabled="true"] {
  opacity: 0.72;
}

.divider {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 8px;
  color: #bbbbbb;
  font-size: 11px;
}

.divider span {
  height: 1px;
  background: #eeeeee;
}

.divider p {
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 11px;
  width: 100%;
}

.field-group {
  display: grid;
  gap: 6px;
}

.field-group label {
  color: #444444;
  font-size: 13px;
  font-weight: 500;
}

.field-group input {
  width: 100%;
  min-height: 41px;
  border: 1.5px solid var(--field-border);
  border-radius: 8px;
  padding: 10px 14px;
  color: #1a1a1a;
  background: #ffffff;
  font-size: 14px;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}

.field-group input::placeholder {
  color: #a39a91;
}

.field-group input:focus {
  border-color: var(--field-border-strong);
  box-shadow: none;
  outline: none;
}

.field-group input[aria-invalid="true"] {
  border-color: rgba(194, 65, 12, 0.55);
}

.password-field {
  position: relative;
}

.password-field input {
  padding-right: 48px;
}

.password-toggle {
  position: absolute;
  top: 50%;
  right: 6px;
  transform: translateY(-50%);
  border: 0;
  background: transparent;
  color: #938a82;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: inline-grid;
  place-items: center;
}

.password-toggle svg {
  width: 18px;
  height: 18px;
}

.password-toggle:hover {
  color: #4f4a44;
  background: #f5f2ee;
}

.form-links {
  display: flex;
  justify-content: flex-end;
  margin-top: -2px;
  min-height: 18px;
  align-items: center;
}

.form-links-placeholder {
  display: none;
}

.text-link {
  border: 0;
  background: transparent;
  color: var(--brand-bg);
  padding: 0;
  font-size: 12px;
  font-weight: 500;
}

.text-link:hover {
  color: #059669;
}

.field-error,
.form-error {
  margin: 0;
  color: var(--field-error);
  font-size: 0.88rem;
}

.submit-button {
  border: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 2px;
  background: var(--brand-bg);
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  box-shadow: none;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-1px);
  background: #0ea572;
}

.submit-button:disabled {
  cursor: not-allowed;
  background: #7fdcbc;
  box-shadow: none;
}

.submit-button[aria-busy="true"] {
  cursor: wait;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 860px) {
  .login-page {
    padding: 24px 16px;
  }

  .login-card {
    max-width: 760px;
    grid-template-columns: 280px minmax(0, 1fr);
  }

  .brand-panel,
  .form-panel {
    padding: 32px 28px;
  }

  .brand-copy h2 {
    font-size: 34px;
  }
}

@media (max-width: 680px) {
  .login-card {
    min-height: auto;
    grid-template-columns: 1fr;
  }

  .brand-panel {
    display: none;
  }

  .form-panel {
    padding: 24px 20px;
  }

  .form-shell {
    width: 100%;
  }
}
</style>
