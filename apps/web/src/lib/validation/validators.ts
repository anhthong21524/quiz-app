import { AUTH_FIELD_LIMITS, AUTH_PASSWORD_POLICY } from "@quiz-app/shared";
import { getAuthValidationMessages } from "./errorMessages";
import { t } from "../../i18n";

export type AuthFieldName = "email" | "password" | "confirmPassword" | "name";

export type ValidationCode =
  | "required"
  | "invalid_email"
  | "max_length"
  | "password_min_length"
  | "password_max_length"
  | "password_spaces_only"
  | "password_weak"
  | "password_mismatch";

export interface ValidationIssue {
  field: AuthFieldName;
  code: ValidationCode;
  message: string;
}

export interface PasswordRuleStatus {
  id: "length" | "notCommon" | "notSpacesOnly" | "match";
  label: string;
  passed: boolean;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WEAK_PASSWORDS = new Set<string>(AUTH_PASSWORD_POLICY.weakPasswords);

export function normalizeEmail(value: string): string {
  return value.trim();
}

export function normalizeOptionalName(value: string | undefined): string {
  return value?.trim() ?? "";
}

export function validateEmail(value: string): ValidationIssue[] {
  const authValidationMessages = getAuthValidationMessages();
  const email = normalizeEmail(value);
  const issues: ValidationIssue[] = [];

  if (!email) {
    issues.push({
      field: "email",
      code: "required",
      message: authValidationMessages.required.email
    });
    return issues;
  }

  if (email.length > AUTH_FIELD_LIMITS.emailMaxLength) {
    issues.push({
      field: "email",
      code: "max_length",
      message: authValidationMessages.email.maxLength
    });
  }

  if (!EMAIL_PATTERN.test(email)) {
    issues.push({
      field: "email",
      code: "invalid_email",
      message: authValidationMessages.email.invalid
    });
  }

  return issues;
}

export function validateRequiredPassword(value: string): ValidationIssue[] {
  const authValidationMessages = getAuthValidationMessages();
  if (!value || !value.trim()) {
    return [
      {
        field: "password",
        code: "required",
        message: authValidationMessages.required.password
      }
    ];
  }

  return [];
}

export function validateNewPassword(value: string): ValidationIssue[] {
  const authValidationMessages = getAuthValidationMessages();
  const issues = validateRequiredPassword(value);

  if (issues.length > 0) {
    return issues;
  }

  if (!value.trim()) {
    issues.push({
      field: "password",
      code: "password_spaces_only",
      message: authValidationMessages.password.spacesOnly
    });
  }

  if (value.length < AUTH_PASSWORD_POLICY.minLength) {
    issues.push({
      field: "password",
      code: "password_min_length",
      message: authValidationMessages.password.minLength
    });
  }

  if (value.length > AUTH_PASSWORD_POLICY.maxLength) {
    issues.push({
      field: "password",
      code: "password_max_length",
      message: authValidationMessages.password.maxLength
    });
  }

  if (WEAK_PASSWORDS.has(value.trim().toLowerCase())) {
    issues.push({
      field: "password",
      code: "password_weak",
      message: authValidationMessages.password.weak
    });
  }

  return issues;
}

export function validatePasswordConfirmation(
  password: string,
  confirmPassword: string
): ValidationIssue[] {
  const authValidationMessages = getAuthValidationMessages();
  if (!confirmPassword) {
    return [
      {
        field: "confirmPassword",
        code: "required",
        message: authValidationMessages.required.confirmPassword
      }
    ];
  }

  if (password !== confirmPassword) {
    return [
      {
        field: "confirmPassword",
        code: "password_mismatch",
        message: authValidationMessages.password.mismatch
      }
    ];
  }

  return [];
}

export function validateOptionalName(value: string | undefined): ValidationIssue[] {
  const authValidationMessages = getAuthValidationMessages();
  const name = normalizeOptionalName(value);

  if (name.length > AUTH_FIELD_LIMITS.nameMaxLength) {
    return [
      {
        field: "name",
        code: "max_length",
        message: authValidationMessages.name.maxLength
      }
    ];
  }

  return [];
}

export function getPasswordRuleStatuses(
  password: string,
  confirmPassword = "",
  includeMatch = false
): PasswordRuleStatus[] {
  const normalizedPassword = password.trim().toLowerCase();
  const statuses: PasswordRuleStatus[] = [
    {
      id: "length",
      label: t("auth.validation.rules.length", {
        min: AUTH_PASSWORD_POLICY.minLength,
        max: AUTH_PASSWORD_POLICY.maxLength
      }),
      passed:
        password.length >= AUTH_PASSWORD_POLICY.minLength &&
        password.length <= AUTH_PASSWORD_POLICY.maxLength
    },
    {
      id: "notSpacesOnly",
      label: t("auth.validation.rules.notSpacesOnly"),
      passed: Boolean(password.trim())
    },
    {
      id: "notCommon",
      label: t("auth.validation.rules.notCommon"),
      passed: !WEAK_PASSWORDS.has(normalizedPassword)
    }
  ];

  if (includeMatch) {
    statuses.push({
      id: "match",
      label: t("auth.validation.rules.match"),
      passed: Boolean(confirmPassword) && password === confirmPassword
    });
  }

  return statuses;
}
