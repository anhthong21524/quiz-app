import type {
  QuizResultSummary,
  QuizSubmission as SharedQuizSubmission,
  QuizSubmissionStatus
} from "@quiz-app/shared";

export type { QuizResultSummary, QuizSubmissionStatus };

export type QuizSubmissionAccent = "green" | "red" | "blue" | "purple" | "orange";

export interface QuizSubmissionAnswer {
  id: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  options?: string[];
  selectedIndex?: number | null;
  correctIndex?: number;
  explanation?: string;
}

export interface QuizSubmission extends SharedQuizSubmission {
  initials: string;
  accent: QuizSubmissionAccent;
  submittedAtIso: string;
  answers: QuizSubmissionAnswer[];
}

export interface QuizResultDetail {
  id: string;
  publishedAt: string;
  summary: QuizResultSummary;
  submissions: QuizSubmission[];
}
