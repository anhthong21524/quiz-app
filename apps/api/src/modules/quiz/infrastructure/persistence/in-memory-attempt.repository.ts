import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { QuizAttempt } from "../../domain/quiz-attempt";
import { AttemptRepository } from "../../domain/attempt.repository";

@Injectable()
export class InMemoryAttemptRepository implements AttemptRepository {
  private readonly attempts = new Map<string, QuizAttempt>();

  async create(quizId: string, takerName: string, timeLimit: number | null): Promise<QuizAttempt> {
    const attempt: QuizAttempt = {
      id: randomUUID(),
      quizId,
      takerName,
      startedAt: new Date().toISOString(),
      timeLimit
    };
    this.attempts.set(attempt.id, attempt);
    return attempt;
  }

  async findById(id: string): Promise<QuizAttempt | null> {
    return this.attempts.get(id) ?? null;
  }

  async submit(
    id: string,
    answers: Record<string, number>,
    score: number,
    totalQuestions: number
  ): Promise<QuizAttempt | null> {
    const attempt = this.attempts.get(id);
    if (!attempt) return null;
    const updated: QuizAttempt = {
      ...attempt,
      submittedAt: new Date().toISOString(),
      answers,
      score,
      totalQuestions
    };
    this.attempts.set(id, updated);
    return updated;
  }
}
