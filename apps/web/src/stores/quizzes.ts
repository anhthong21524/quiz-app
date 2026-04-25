import { defineStore } from "pinia";
import { isAxiosError } from "axios";
import type { Quiz } from "@quiz-app/shared";
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
  isLoading: boolean;
  error: string | null;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (isAxiosError(error)) {
    const responseMessage = error.response?.data?.message;
    if (Array.isArray(responseMessage)) {
      return responseMessage.join(" ");
    }

    if (typeof responseMessage === "string") {
      return responseMessage;
    }

    if (error.message === "Network Error") {
      return "API server is not reachable. Make sure the backend is running on http://localhost:3001.";
    }
  }

  return error instanceof Error ? error.message : fallback;
}

export const useQuizStore = defineStore("quizzes", {
  state: (): QuizState => ({
    items: [],
    activeQuiz: null,
    isLoading: false,
    error: null
  }),
  actions: {
    async loadQuizzes() {
      this.isLoading = true;
      this.error = null;
      try {
        this.items = await fetchQuizzes();
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to load quizzes.");
      } finally {
        this.isLoading = false;
      }
    },
    async loadQuiz(id: string) {
      this.isLoading = true;
      this.error = null;
      try {
        this.activeQuiz = await fetchQuiz(id);
        return this.activeQuiz;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to load quiz.");
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async saveQuiz(payload: QuizPayload, id?: string) {
      this.isLoading = true;
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
        this.error = getErrorMessage(error, "Failed to save quiz.");
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async setQuizPublished(id: string, published: boolean) {
      this.isLoading = true;
      this.error = null;
      try {
        const updatedQuiz = published
          ? await publishQuiz(id)
          : await unpublishQuiz(id);
        const existingIndex = this.items.findIndex((quiz) => quiz.id === id);
        if (existingIndex >= 0) {
          this.items.splice(existingIndex, 1, updatedQuiz);
        }
        if (this.activeQuiz?.id === id) {
          this.activeQuiz = updatedQuiz;
        }
        return updatedQuiz;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to update quiz status.");
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteQuiz(id: string) {
      this.error = null;
      try {
        await deleteQuiz(id);
        this.items = this.items.filter((quiz) => quiz.id !== id);
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to delete quiz.");
        throw error;
      }
    },
    async duplicateQuiz(id: string) {
      this.error = null;
      try {
        const copy = await duplicateQuiz(id);
        this.items.unshift(copy);
        return copy;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to duplicate quiz.");
        throw error;
      }
    }
  }
});
