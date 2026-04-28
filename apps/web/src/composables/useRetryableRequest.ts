import { onUnmounted, ref, type Ref } from "vue";
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
 * - Stale responses from a previous `execute()` call are discarded automatically.
 * - The in-flight generation is invalidated on component unmount, preventing
 *   state writes after the component is gone.
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

  let generation = 0;

  async function execute(): Promise<void> {
    const currentGen = ++generation;
    isLoading.value = true;
    error.value = null;

    try {
      const result = await requestFn();
      if (currentGen !== generation) return;
      data.value = result;
    } catch (caught) {
      if (currentGen !== generation) return;
      const appError = isAppError(caught) ? caught : normalizeApiError(caught);
      error.value = { ...appError, userMessage: getUserMessage(appError, context) };
    } finally {
      if (currentGen === generation) {
        isLoading.value = false;
      }
    }
  }

  // Invalidate any in-flight request when the owning component is destroyed.
  onUnmounted(() => {
    generation++;
  });

  return { data, isLoading, error, execute };
}
