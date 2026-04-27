import type { AppError, AppErrorCategory } from "./errors";

// Each context represents a feature operation. Add new contexts here as the
// app grows — keeping all message copy in one file.
export type MessageContext =
  | "quiz_list_load"
  | "quiz_load"
  | "quiz_save"
  | "quiz_publish"
  | "quiz_unpublish"
  | "quiz_delete"
  | "quiz_duplicate"
  | "login"
  | "register"
  | "default";

// ─── Baseline messages (used when no context override matches) ───────────────

const DEFAULT_MESSAGES: Record<AppErrorCategory, string> = {
  network: "Unable to reach the server. Check your connection and try again.",
  timeout: "The request took too long. Please try again.",
  unauthorized: "Your session has expired. Please sign in again.",
  forbidden: "You don't have permission to do that.",
  not_found: "The requested resource was not found.",
  validation: "Please correct the highlighted fields.",
  conflict: "This action conflicts with the current state. Refresh and try again.",
  rate_limited: "Too many requests. Please wait a moment and try again.",
  server: "Something went wrong on our end. Please try again shortly.",
  cancelled: "",
  unknown: "Something went wrong. Please try again.",
};

// ─── Per-feature overrides ────────────────────────────────────────────────────

const CONTEXT_OVERRIDES: Record<MessageContext, Partial<Record<AppErrorCategory, string>>> = {
  quiz_list_load: {
    network: "Unable to load your quizzes. Check your connection and try again.",
    server: "We couldn't load your quizzes right now. Please try again.",
    not_found: "Your quiz list could not be found.",
  },
  quiz_load: {
    not_found: "This quiz no longer exists. It may have been deleted.",
    network: "Unable to load the quiz. Check your connection and try again.",
    server: "We couldn't load this quiz right now. Please try again.",
    forbidden: "You don't have permission to view this quiz.",
  },
  quiz_save: {
    validation: "Please fix the errors in your quiz before saving.",
    server: "We couldn't save your quiz right now. Your edits are intact — please try again.",
    conflict: "This quiz was modified elsewhere. Refresh to get the latest version before saving.",
    not_found: "This quiz no longer exists and can't be saved.",
    network: "Unable to save. Check your connection and try again.",
  },
  quiz_publish: {
    not_found: "This quiz no longer exists and can't be published.",
    server: "We couldn't publish the quiz right now. Please try again.",
    forbidden: "You don't have permission to publish this quiz.",
    conflict: "The quiz status changed unexpectedly. Refresh and try again.",
    validation: "The quiz can't be published in its current state.",
  },
  quiz_unpublish: {
    not_found: "This quiz no longer exists and can't be unpublished.",
    server: "We couldn't unpublish the quiz right now. Please try again.",
    forbidden: "You don't have permission to unpublish this quiz.",
    conflict: "The quiz status changed unexpectedly. Refresh and try again.",
  },
  quiz_delete: {
    not_found: "This quiz was already deleted.",
    server: "We couldn't delete the quiz right now. Please try again.",
    forbidden: "You don't have permission to delete this quiz.",
  },
  quiz_duplicate: {
    not_found: "The original quiz no longer exists and can't be duplicated.",
    server: "We couldn't duplicate the quiz right now. Please try again.",
  },
  login: {
    unauthorized: "Incorrect email or password. Please try again.",
    validation: "Please check your email and password.",
    server: "We couldn't sign you in right now. Please try again.",
    network: "Unable to reach the server. Check your connection.",
    conflict: "An account with this email already exists. Try signing in instead.",
  },
  register: {
    conflict: "An account with this email already exists. Try signing in instead.",
    validation: "Please check your email and password.",
    server: "We couldn't create your account right now. Please try again.",
    network: "Unable to reach the server. Check your connection.",
  },
  default: {},
};

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns a safe, user-facing message for the given error and feature context.
 * Prefers context-specific overrides; falls back to defaults.
 * Never returns a raw technical string.
 */
export function getUserMessage(error: AppError, context: MessageContext = "default"): string {
  // Errors like network/timeout/unknown already carry a userMessage from normalizeApiError
  if (error.userMessage) return error.userMessage;

  // For edit/unpublish conflicts the server returns a user-safe business-rule explanation
  // (e.g. "Cannot edit: this quiz has 2 participants currently taking it and 3 submissions.").
  // Prefer that over the generic conflict fallback so the user knows exactly why.
  if (
    (context === "quiz_unpublish" || context === "quiz_save") &&
    error.category === "conflict" &&
    error.technicalMessage
  ) {
    return error.technicalMessage;
  }

  const override = CONTEXT_OVERRIDES[context]?.[error.category];
  if (override) return override;

  return DEFAULT_MESSAGES[error.category] ?? "Something went wrong. Please try again.";
}

/**
 * Returns all field-level validation messages from the error, if any.
 * Useful for mapping NestJS class-validator errors to form fields.
 */
export function getFieldErrors(error: AppError): Record<string, string> {
  return error.fieldErrors;
}

/**
 * Returns a single field's validation message, or null if not present.
 */
export function getFieldMessage(field: string, error: AppError): string | null {
  return error.fieldErrors[field] ?? null;
}
