import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { Quiz } from "@quiz-app/shared";
import { ATTEMPT_REPOSITORY, AttemptRepository } from "../domain/attempt.repository";
import { QuizAttempt } from "../domain/quiz-attempt";
import { QUIZ_REPOSITORY, QuizRepository } from "../domain/quiz.repository";

@Injectable()
export class AttemptService {
  constructor(
    @Inject(ATTEMPT_REPOSITORY)
    private readonly attemptRepository: AttemptRepository,
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: QuizRepository
  ) {}

  async createAttempt(quizId: string, takerName: string): Promise<QuizAttempt> {
    const quiz = await this.quizRepository.findById(quizId);
    if (!quiz) throw new NotFoundException(`Quiz ${quizId} was not found.`);
    return this.attemptRepository.create(quizId, takerName, quiz.timeLimit ?? null);
  }

  async submitAttempt(
    quizId: string,
    attemptId: string,
    answers: Record<string, number>
  ): Promise<QuizAttempt> {
    const attempt = await this.attemptRepository.findById(attemptId);
    if (!attempt || attempt.quizId !== quizId) {
      throw new NotFoundException(`Attempt ${attemptId} was not found.`);
    }

    const quiz = await this.quizRepository.findById(quizId);
    if (!quiz) throw new NotFoundException(`Quiz ${quizId} was not found.`);

    const score = this.calculateScore(quiz, answers);
    const submitted = await this.attemptRepository.submit(attemptId, answers, score, quiz.questions.length);
    if (!submitted) throw new NotFoundException(`Attempt ${attemptId} was not found.`);
    return submitted;
  }

  private calculateScore(quiz: Quiz, answers: Record<string, number>): number {
    return quiz.questions.reduce((count, question, index) => {
      const key = question.id ?? `question-${index}`;
      return answers[key] === question.correctOptionIndex ? count + 1 : count;
    }, 0);
  }
}
