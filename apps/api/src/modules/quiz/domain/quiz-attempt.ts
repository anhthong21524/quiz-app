export interface QuizAttempt {
  id: string;
  quizId: string;
  takerName: string;
  startedAt: string;
  timeLimit: number | null;
  submittedAt?: string;
  answers?: Record<string, number>;
  score?: number;
  totalQuestions?: number;
}
