import { isAxiosError } from "axios";

export type AppErrorCategory =
  | "network"
  | "timeout"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "validation"
  | "conflict"
  | "rate_limited"
  | "server"
  | "cancelled"
  | "unknown";

export interface AppError {
  /** Machine-readable code, e.g. HTTP_404, ERR_NETWORK */
  code: string;
  category: AppErrorCategory;
  /** Safe, human-readable message ready to display. Filled by getUserMessage(). */
  userMessage: string;
  /** Raw technical detail for logging — never shown to users */
  technicalMessage: string;
  httpStatus: number | null;
  isRetryable: boolean;
  /** Keyed validation messages extracted from the response, e.g. { title: "required" } */
  fieldErrors: Record<string, string>;
  source: "api" | "network" | "client";
  originalError: unknown;
}

export function isAppError(value: unknown): value is AppError {
  return (
    typeof value === "object" &&
    value !== null &&
    "category" in value &&
    "isRetryable" in value &&
    "userMessage" in value &&
    "code" in value
  );
}

// ─── Retryability ───────────────────────────────────────────────────────────

const RETRYABLE: ReadonlySet<AppErrorCategory> = new Set([
  "network",
  "timeout",
  "server",
  "unknown",
]);

function isRetryableCategory(category: AppErrorCategory): boolean {
  return RETRYABLE.has(category);
}

// ─── HTTP status → category ──────────────────────────────────────────────────

function categoryFromStatus(status: number): AppErrorCategory {
  if (status === 400) return "validation";
  if (status === 401) return "unauthorized";
  if (status === 403) return "forbidden";
  if (status === 404) return "not_found";
  if (status === 409) return "conflict";
  if (status === 422) return "validation";
  if (status === 429) return "rate_limited";
  if (status >= 500) return "server";
  return "unknown";
}

// ─── NestJS payload extraction ───────────────────────────────────────────────

function extractNestMessage(data: unknown): string {
  if (typeof data !== "object" || data === null) return "";
  const d = data as Record<string, unknown>;
  const msg = d.message;
  if (Array.isArray(msg)) return msg.join("; ");
  if (typeof msg === "string") return msg;
  if (typeof d.error === "string") return d.error;
  return "";
}

function extractFieldErrors(data: unknown): Record<string, string> {
  if (typeof data !== "object" || data === null) return {};
  const d = data as Record<string, unknown>;
  const errors: Record<string, string> = {};
  if (typeof d.errors === "object" && d.errors !== null) {
    for (const [key, val] of Object.entries(d.errors as Record<string, unknown>)) {
      errors[key] = Array.isArray(val) ? (val as string[]).join("; ") : String(val);
    }
  }
  return errors;
}

function safeBodyText(data: unknown): string {
  if (typeof data === "string") {
    if (data.trim().startsWith("<")) return "Server returned an HTML error page.";
    return data.trim().slice(0, 300);
  }
  try {
    return JSON.stringify(data).slice(0, 300);
  } catch {
    return "Unknown response body.";
  }
}

// ─── Main normalization ──────────────────────────────────────────────────────

export function normalizeApiError(error: unknown): AppError {
  if (isAppError(error)) return error;

  if (isAxiosError(error)) {
    // Cancelled by AbortController or CancelToken
    if (error.code === "ERR_CANCELED" || error.name === "CanceledError") {
      return {
        code: "ERR_CANCELED",
        category: "cancelled",
        userMessage: "",
        technicalMessage: "Request was cancelled.",
        httpStatus: null,
        isRetryable: false,
        fieldErrors: {},
        source: "client",
        originalError: error,
      };
    }

    // Timeout (ECONNABORTED = axios timeout; ERR_NETWORK with timeout message)
    if (
      error.code === "ECONNABORTED" ||
      (error.code === "ERR_NETWORK" && error.message.toLowerCase().includes("timeout"))
    ) {
      return {
        code: "ERR_TIMEOUT",
        category: "timeout",
        userMessage: "The request took too long. Please try again.",
        technicalMessage: error.message,
        httpStatus: null,
        isRetryable: true,
        fieldErrors: {},
        source: "network",
        originalError: error,
      };
    }

    // No response — network failure / server unreachable / offline
    if (!error.response) {
      return {
        code: "ERR_NETWORK",
        category: "network",
        userMessage: "Unable to reach the server. Check your connection and try again.",
        technicalMessage: error.message,
        httpStatus: null,
        isRetryable: true,
        fieldErrors: {},
        source: "network",
        originalError: error,
      };
    }

    // HTTP error response
    const { status, data } = error.response;
    const category = categoryFromStatus(status);
    const technicalMessage = extractNestMessage(data) || safeBodyText(data);
    const fieldErrors = extractFieldErrors(data);

    return {
      code: `HTTP_${status}`,
      category,
      userMessage: "", // filled by getUserMessage() at display time
      technicalMessage,
      httpStatus: status,
      isRetryable: isRetryableCategory(category),
      fieldErrors,
      source: "api",
      originalError: error,
    };
  }

  // Non-Axios / completely unknown error
  const msg = error instanceof Error ? error.message : String(error);
  return {
    code: "ERR_UNKNOWN",
    category: "unknown",
    userMessage: "Something went wrong. Please try again.",
    technicalMessage: msg,
    httpStatus: null,
    isRetryable: true,
    fieldErrors: {},
    source: "client",
    originalError: error,
  };
}
