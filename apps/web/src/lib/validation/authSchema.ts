import type { AuthFieldName, ValidationIssue } from "./validators";
import {
  normalizeEmail,
  normalizeOptionalName,
  validateEmail,
  validateNewPassword,
  validateOptionalName,
  validatePasswordConfirmation,
  validateRequiredPassword
} from "./validators";

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface RegisterFormValues extends LoginFormValues {
  confirmPassword: string;
  name?: string;
}

export type AuthFieldErrors = Partial<Record<AuthFieldName, string>>;

export interface FormValidationResult<TValues> {
  values: TValues;
  issues: ValidationIssue[];
  fieldErrors: AuthFieldErrors;
  isValid: boolean;
}

function toFieldErrors(issues: ValidationIssue[]): AuthFieldErrors {
  return issues.reduce<AuthFieldErrors>((acc, issue) => {
    acc[issue.field] ??= issue.message;
    return acc;
  }, {});
}

export function validateLoginForm(
  values: LoginFormValues
): FormValidationResult<LoginFormValues> {
  const issues = [
    ...validateEmail(values.email),
    ...validateRequiredPassword(values.password)
  ];

  return {
    values: {
      email: normalizeEmail(values.email),
      password: values.password
    },
    issues,
    fieldErrors: toFieldErrors(issues),
    isValid: issues.length === 0
  };
}

export function validateRegisterForm(
  values: RegisterFormValues
): FormValidationResult<RegisterFormValues> {
  const issues = [
    ...validateOptionalName(values.name),
    ...validateEmail(values.email),
    ...validateNewPassword(values.password),
    ...validatePasswordConfirmation(values.password, values.confirmPassword)
  ];

  return {
    values: {
      name: normalizeOptionalName(values.name),
      email: normalizeEmail(values.email),
      password: values.password,
      confirmPassword: values.confirmPassword
    },
    issues,
    fieldErrors: toFieldErrors(issues),
    isValid: issues.length === 0
  };
}
