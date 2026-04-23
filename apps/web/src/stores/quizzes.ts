import { defineStore } from "pinia";
import type { Quiz } from "@quiz-app/shared";
import {
  createQuiz,
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
        this.error = error instanceof Error ? error.message : "Failed to load quizzes.";
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
        this.error = error instanceof Error ? error.message : "Failed to load quiz.";
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
        this.error = error instanceof Error ? error.message : "Failed to save quiz.";
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
        this.error = error instanceof Error ? error.message : "Failed to update quiz status.";
        throw error;
      } finally {
        this.isLoading = false;
      }
    }
  }
});

