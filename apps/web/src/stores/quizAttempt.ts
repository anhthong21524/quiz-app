import { defineStore } from "pinia";

const storageKey = "quiz-app-public-attempt";

export interface QuizAttemptSession {
  sessionId: string;
  quizId: string;
  quizSlug: string;
  attemptId?: string;
  takerName?: string;
  startedAt: string;
  accessCode?: string;
}

interface QuizAttemptState {
  currentAttempt: QuizAttemptSession | null;
}

function loadStoredAttempt(): QuizAttemptSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.localStorage.getItem(storageKey);
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as QuizAttemptSession;
  } catch {
    window.localStorage.removeItem(storageKey);
    return null;
  }
}

function persistAttempt(attempt: QuizAttemptSession | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (!attempt) {
    window.localStorage.removeItem(storageKey);
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(attempt));
}

export const useQuizAttemptStore = defineStore("quizAttempt", {
  state: (): QuizAttemptState => ({
    currentAttempt: loadStoredAttempt()
  }),
  actions: {
    setAttempt(attempt: QuizAttemptSession) {
      this.currentAttempt = attempt;
      persistAttempt(attempt);
    },
    clearAttempt() {
      this.currentAttempt = null;
      persistAttempt(null);
    }
  }
});
