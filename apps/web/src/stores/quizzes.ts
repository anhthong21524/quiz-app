import { defineStore } from "pinia";
import type { Quiz } from "@quiz-app/shared";
import type { AppError } from "../lib/api/errors";
import { isAppError, normalizeApiError } from "../lib/api/errors";
import { getUserMessage, type MessageContext } from "../lib/api/error-messages";
import {
  createQuiz,
  deleteQuiz,
  duplicateQuiz,
  fetchQuiz,
  fetchQuizzes,
  publishQuiz,
  unpublishQuiz,
  updateQuiz,
  type QuizPayload
} from "../services/quiz-api";

interface QuizState {
  items: Quiz[];
  activeQuiz: Quiz | null;
  /** True only during loadQuizzes / loadQuiz — drives skeleton UI. */
  isLoading: boolean;
  /**
   * True during save, publish, unpublish, delete, duplicate.
   * Kept separate so skeleton never appears when an action button is pending.
   */
  isActionLoading: boolean;
  error: AppError | null;
}

// Attach a context-specific userMessage before storing the error.
// The interceptor guarantees the caught value is already an AppError,
// but normalizeApiError is a safe fallback for any unexpected throws.
function toAppError(error: unknown, context: MessageContext): AppError {
  const appError = isAppError(error) ? error : normalizeApiError(error);
  return { ...appError, userMessage: getUserMessage(appError, context) };
}

// Module-level counters guard against stale responses when the user navigates
// away and back before a load completes. Each new call increments the counter;
// the response is discarded if the counter has moved on by the time it settles.
let loadQuizzesGen = 0;
let loadQuizGen = 0;

export const useQuizStore = defineStore("quizzes", {
  state: (): QuizState => ({
    items: [],
    activeQuiz: null,
    isLoading: false,
    isActionLoading: false,
    error: null
  }),

  actions: {
    async loadQuizzes() {
      const gen = ++loadQuizzesGen;
      this.isLoading = true;
      this.error = null;
      try {
        const items = await fetchQuizzes();
        if (gen !== loadQuizzesGen) return;
        this.items = items;
      } catch (error) {
        if (gen !== loadQuizzesGen) return;
        this.error = toAppError(error, "quiz_list_load");
      } finally {
        if (gen === loadQuizzesGen) {
          this.isLoading = false;
        }
      }
    },

    async loadQuiz(id: string) {
      const gen = ++loadQuizGen;
      this.isLoading = true;
      this.error = null;
      try {
        const quiz = await fetchQuiz(id);
        if (gen !== loadQuizGen) return;
        this.activeQuiz = quiz;
        return this.activeQuiz;
      } catch (error) {
        if (gen !== loadQuizGen) return;
        this.error = toAppError(error, "quiz_load");
        throw this.error;
      } finally {
        if (gen === loadQuizGen) {
          this.isLoading = false;
        }
      }
    },

    async saveQuiz(payload: QuizPayload, id?: string) {
      this.isActionLoading = true;
      this.error = null;
      try {
        const savedQuiz = id
          ? await updateQuiz(id, payload)
          : await createQuiz(payload);

        const existingIndex = this.items.findIndex((quiz) => quiz.id === savedQuiz.id);
        if (existingIndex >= 0) {
          this.items.splice(existingIndex, 1, savedQuiz);
        } else {
          this.items.unshift(savedQuiz);
        }
        this.activeQuiz = savedQuiz;
        return savedQuiz;
      } catch (error) {
        this.error = toAppError(error, "quiz_save");
        throw this.error;
      } finally {
        this.isActionLoading = false;
      }
    },

    async setQuizPublished(id: string, published: boolean) {
      this.isActionLoading = true;
      this.error = null;
      try {
        const updatedQuiz = published ? await publishQuiz(id) : await unpublishQuiz(id);

        const existingIndex = this.items.findIndex((q) => q.id === id);
        if (existingIndex >= 0) {
          this.items.splice(existingIndex, 1, updatedQuiz);
        }
        if (this.activeQuiz?.id === id) {
          this.activeQuiz = updatedQuiz;
        }
        return updatedQuiz;
      } catch (error) {
        const context: MessageContext = published ? "quiz_publish" : "quiz_unpublish";
        this.error = toAppError(error, context);
        throw this.error;
      } finally {
        this.isActionLoading = false;
      }
    },

    async deleteQuiz(id: string) {
      this.isActionLoading = true;
      this.error = null;
      try {
        await deleteQuiz(id);
        this.items = this.items.filter((quiz) => quiz.id !== id);
      } catch (error) {
        this.error = toAppError(error, "quiz_delete");
        throw this.error;
      } finally {
        this.isActionLoading = false;
      }
    },

    async duplicateQuiz(id: string) {
      this.isActionLoading = true;
      this.error = null;
      try {
        const copy = await duplicateQuiz(id);
        this.items.unshift(copy);
        return copy;
      } catch (error) {
        this.error = toAppError(error, "quiz_duplicate");
        throw this.error;
      } finally {
        this.isActionLoading = false;
      }
    }
  }
});
