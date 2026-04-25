import { AUTH_FIELD_LIMITS, AUTH_PASSWORD_POLICY } from "@quiz-app/shared";

export const authValidationMessages = {
  required: {
    email: "Email is required.",
    password: "Password is required.",
    confirmPassword: "Confirm your password.",
    name: "Name is required."
  },
  email: {
    invalid: "Enter a valid email address.",
    maxLength: `Email must be ${AUTH_FIELD_LIMITS.emailMaxLength} characters or fewer.`
  },
  password: {
    minLength: `Use at least ${AUTH_PASSWORD_POLICY.minLength} characters.`,
    maxLength: `Use ${AUTH_PASSWORD_POLICY.maxLength} characters or fewer.`,
    spacesOnly: "Password can't be only spaces.",
    weak: "Choose a less common password.",
    mismatch: "Passwords do not match."
  },
  name: {
    maxLength: `Name must be ${AUTH_FIELD_LIMITS.nameMaxLength} characters or fewer.`
  },
  form: {
    invalidLogin: "Incorrect email or password. Please try again.",
    loginValidation: "Please check your email and password.",
    registerValidation: "Please check your account details.",
    generic: "Something went wrong. Please try again."
  }
} as const;

export const passwordHintText =
  `Use ${AUTH_PASSWORD_POLICY.minLength}-${AUTH_PASSWORD_POLICY.maxLength} characters. ` +
  "Avoid common passwords; a mix of letters, numbers, and symbols is recommended.";
