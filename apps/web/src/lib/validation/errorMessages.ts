import { AUTH_FIELD_LIMITS, AUTH_PASSWORD_POLICY } from "@quiz-app/shared";
import { t } from "../../i18n";

export function getAuthValidationMessages() {
  return {
    required: {
      email: t("auth.validation.required.email"),
      password: t("auth.validation.required.password"),
      confirmPassword: t("auth.validation.required.confirmPassword"),
      name: t("auth.validation.required.name")
    },
    email: {
      invalid: t("auth.validation.email.invalid"),
      maxLength: t("auth.validation.email.maxLength", {
        max: AUTH_FIELD_LIMITS.emailMaxLength
      })
    },
    password: {
      minLength: t("auth.validation.password.minLength", {
        min: AUTH_PASSWORD_POLICY.minLength
      }),
      maxLength: t("auth.validation.password.maxLength", {
        max: AUTH_PASSWORD_POLICY.maxLength
      }),
      spacesOnly: t("auth.validation.password.spacesOnly"),
      weak: t("auth.validation.password.weak"),
      mismatch: t("auth.validation.password.mismatch")
    },
    name: {
      maxLength: t("auth.validation.name.maxLength", {
        max: AUTH_FIELD_LIMITS.nameMaxLength
      })
    },
    form: {
      invalidLogin: t("auth.validation.form.invalidLogin"),
      loginValidation: t("auth.validation.form.loginValidation"),
      registerValidation: t("auth.validation.form.registerValidation"),
      generic: t("auth.validation.form.generic")
    }
  } as const;
}

export function getPasswordHintText() {
  return t("auth.validation.hint", {
    min: AUTH_PASSWORD_POLICY.minLength,
    max: AUTH_PASSWORD_POLICY.maxLength
  });
}
