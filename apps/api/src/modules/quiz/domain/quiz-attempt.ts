export interface QuizAttempt {
  id: string;
  quizId: string;
  takerName: string;
  startedAt: string;
  submittedAt?: string;
  timeTaken?: number;
  answers?: Record<string, number>;
  score?: number;
}
