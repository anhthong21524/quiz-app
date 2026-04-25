import { authValidationMessages } from "./errorMessages";
import type { AuthFieldErrors, LoginFormValues, RegisterFormValues } from "./authSchema";
import { getFieldErrors, getUserMessage } from "../api/error-messages";
import type { AppError } from "../api/errors";

export interface NormalizedAuthError {
  fieldErrors: AuthFieldErrors;
  formError: string;
}

type AuthErrorContext = "login" | "register";

const FIELD_ALIASES: Record<string, keyof RegisterFormValues> = {
  email: "email",
  password: "password",
  confirmPassword: "confirmPassword",
  name: "name"
};

export function normalizeAuthError(
  error: AppError,
  context: AuthErrorContext
): NormalizedAuthError {
  const fieldErrors: AuthFieldErrors = {};

  for (const [field, message] of Object.entries(getFieldErrors(error))) {
    const mappedField = FIELD_ALIASES[field];
    if (mappedField) {
      fieldErrors[mappedField] = message;
    }
  }

  if (context === "login" && error.category === "unauthorized") {
    return {
      fieldErrors,
      formError: authValidationMessages.form.invalidLogin
    };
  }

  return {
    fieldErrors,
    formError: getUserMessage(error, context)
  };
}

export function loginPayloadFrom(values: LoginFormValues): LoginFormValues {
  return {
    email: values.email.trim(),
    password: values.password
  };
}

export function registerPayloadFrom(values: RegisterFormValues): LoginFormValues {
  return {
    email: values.email.trim(),
    password: values.password
  };
}
