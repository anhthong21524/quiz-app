import type { QuizDifficulty } from "@quiz-app/shared";

export type CreateQuizStep = 1 | 2;

export type DifficultyLevel = QuizDifficulty;

export type QuestionStatus = "empty" | "in_progress" | "completed";
export type QuestionReviewStatus = "correct" | "incorrect";

export interface QuestionOption {
  id: string;
  label: string;
  text: string;
  isCorrect: boolean;
}

export interface CreateQuizQuestion {
  id: string;
  questionText: string;
  options: QuestionOption[];
  multipleCorrect: boolean;
  explanation: string;
  status: QuestionStatus;
  reviewStatus?: QuestionReviewStatus;
}
