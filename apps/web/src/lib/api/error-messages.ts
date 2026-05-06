import type { AppError, AppErrorCategory } from "./errors";
import { t } from "../../i18n";

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

function defaultMessages(): Record<AppErrorCategory, string> {
  return {
    network: t("errors.api.defaults.network"),
    timeout: t("errors.api.defaults.timeout"),
    unauthorized: t("errors.api.defaults.unauthorized"),
    forbidden: t("errors.api.defaults.forbidden"),
    not_found: t("errors.api.defaults.notFound"),
    validation: t("errors.api.defaults.validation"),
    conflict: t("errors.api.defaults.conflict"),
    rate_limited: t("errors.api.defaults.rateLimited"),
    server: t("errors.api.defaults.server"),
    cancelled: "",
    unknown: t("errors.api.defaults.unknown")
  };
}

function contextOverrides(): Record<MessageContext, Partial<Record<AppErrorCategory, string>>> {
  return {
    quiz_list_load: {
      network: t("errors.api.contexts.quizListLoad.network"),
      server: t("errors.api.contexts.quizListLoad.server"),
      not_found: t("errors.api.contexts.quizListLoad.notFound")
    },
    quiz_load: {
      not_found: t("errors.api.contexts.quizLoad.notFound"),
      network: t("errors.api.contexts.quizLoad.network"),
      server: t("errors.api.contexts.quizLoad.server"),
      forbidden: t("errors.api.contexts.quizLoad.forbidden")
    },
    quiz_save: {
      validation: t("errors.api.contexts.quizSave.validation"),
      server: t("errors.api.contexts.quizSave.server"),
      conflict: t("errors.api.contexts.quizSave.conflict"),
      not_found: t("errors.api.contexts.quizSave.notFound"),
      network: t("errors.api.contexts.quizSave.network")
    },
    quiz_publish: {
      not_found: t("errors.api.contexts.quizPublish.notFound"),
      server: t("errors.api.contexts.quizPublish.server"),
      forbidden: t("errors.api.contexts.quizPublish.forbidden"),
      conflict: t("errors.api.contexts.quizPublish.conflict"),
      validation: t("errors.api.contexts.quizPublish.validation")
    },
    quiz_unpublish: {
      not_found: t("errors.api.contexts.quizUnpublish.notFound"),
      server: t("errors.api.contexts.quizUnpublish.server"),
      forbidden: t("errors.api.contexts.quizUnpublish.forbidden"),
      conflict: t("errors.api.contexts.quizUnpublish.conflict")
    },
    quiz_delete: {
      not_found: t("errors.api.contexts.quizDelete.notFound"),
      server: t("errors.api.contexts.quizDelete.server"),
      forbidden: t("errors.api.contexts.quizDelete.forbidden")
    },
    quiz_duplicate: {
      not_found: t("errors.api.contexts.quizDuplicate.notFound"),
      server: t("errors.api.contexts.quizDuplicate.server")
    },
    login: {
      unauthorized: t("errors.api.contexts.login.unauthorized"),
      validation: t("errors.api.contexts.login.validation"),
      server: t("errors.api.contexts.login.server"),
      network: t("errors.api.contexts.login.network"),
      conflict: t("errors.api.contexts.login.conflict")
    },
    register: {
      conflict: t("errors.api.contexts.register.conflict"),
      validation: t("errors.api.contexts.register.validation"),
      server: t("errors.api.contexts.register.server"),
      network: t("errors.api.contexts.register.network")
    },
    default: {}
  };
}

export function getUserMessage(error: AppError, context: MessageContext = "default"): string {
  if (error.userMessage) {
    return error.userMessage;
  }

  if (
    (context === "quiz_save" || context === "quiz_delete") &&
    error.category === "conflict" &&
    error.technicalMessage
  ) {
    return error.technicalMessage;
  }

  const override = contextOverrides()[context]?.[error.category];

  if (override) {
    return override;
  }

  return defaultMessages()[error.category] ?? t("errors.api.defaults.unknown");
}

export function getFieldErrors(error: AppError): Record<string, string> {
  return error.fieldErrors;
}

export function getFieldMessage(field: string, error: AppError): string | null {
  return error.fieldErrors[field] ?? null;
}
