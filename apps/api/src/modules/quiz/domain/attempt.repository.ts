import { QuizAttempt } from "./quiz-attempt";

export interface AttemptRepository {
  create(quizId: string, takerName: string, timeLimit: number | null): Promise<QuizAttempt>;
  findById(id: string): Promise<QuizAttempt | null>;
  submit(
    id: string,
    answers: Record<string, number>,
    score: number,
    totalQuestions: number
  ): Promise<QuizAttempt | null>;
}

export const ATTEMPT_REPOSITORY = Symbol("ATTEMPT_REPOSITORY");
