import { QuizAttempt } from "./quiz-attempt";

export interface AttemptRepository {
  create(quizId: string, takerName: string): Promise<QuizAttempt>;
  findById(id: string): Promise<QuizAttempt | null>;
  findByQuizId(quizId: string): Promise<QuizAttempt[]>;
  findByQuizIds(quizIds: string[]): Promise<QuizAttempt[]>;
  findRecent(quizIds: string[], limit: number): Promise<QuizAttempt[]>;
  submit(
    id: string,
    answers: Record<string, number>,
    score: number,
    timeTaken: number
  ): Promise<QuizAttempt | null>;
}

export const ATTEMPT_REPOSITORY = Symbol("ATTEMPT_REPOSITORY");
