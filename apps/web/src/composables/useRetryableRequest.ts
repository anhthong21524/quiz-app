import { ref, type Ref } from "vue";
import type { AppError } from "../lib/api/errors";
import { isAppError, normalizeApiError } from "../lib/api/errors";
import { getUserMessage, type MessageContext } from "../lib/api/error-messages";

export interface RetryableRequestState<T> {
  data: Ref<T | null>;
  isLoading: Ref<boolean>;
  error: Ref<AppError | null>;
  execute: () => Promise<void>;
}

/**
 * Wraps an async data-fetch in loading / error / data state.
 *
 * - Errors are normalized to AppError via the shared utility.
 * - Pass `context` to get a feature-specific userMessage on the error.
 * - Call `execute()` to (re)load; it always resets loading and error first.
 * - Use `error.value.isRetryable` in the template to decide whether to show retry UI.
 *
 * Does NOT debounce or rate-limit retries — the component is responsible for
 * disabling the retry button while isLoading is true.
 */
export function useRetryableRequest<T>(
  requestFn: () => Promise<T>,
  context: MessageContext = "default"
): RetryableRequestState<T> {
  const data = ref<T | null>(null) as Ref<T | null>;
  const isLoading = ref(false);
  const error = ref<AppError | null>(null);

  async function execute(): Promise<void> {
    isLoading.value = true;
    error.value = null;

    try {
      data.value = await requestFn();
    } catch (caught) {
      const appError = isAppError(caught) ? caught : normalizeApiError(caught);
      error.value = { ...appError, userMessage: getUserMessage(appError, context) };
    } finally {
      isLoading.value = false;
    }
  }

  return { data, isLoading, error, execute };
}
