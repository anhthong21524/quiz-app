export type CreateQuizStep = 1 | 2;

export type DifficultyLevel = "Easy" | "Medium" | "Hard";

export type QuestionStatus = "empty" | "in_progress" | "completed";

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
}
