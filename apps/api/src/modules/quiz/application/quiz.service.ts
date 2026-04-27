import { ConflictException, ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { QuizStatus, type Quiz } from "@quiz-app/shared";
import { randomBytes } from "node:crypto";
import { CreateQuizDto } from "./dto/create-quiz.dto";
import { UpdateQuizDto } from "./dto/update-quiz.dto";
import { ATTEMPT_REPOSITORY, AttemptRepository } from "../domain/attempt.repository";
import { QUIZ_REPOSITORY, QuizRepository } from "../domain/quiz.repository";

export interface AuthenticatedUser {
  id: string;
  email: string;
}

@Injectable()
export class QuizService {
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: QuizRepository,
    @Inject(ATTEMPT_REPOSITORY)
    private readonly attemptRepository: AttemptRepository
  ) {}

  create(payload: CreateQuizDto, user: AuthenticatedUser) {
    return this.quizRepository.create({
      ...payload,
      ownerId: user.id,
      ownerEmail: user.email,
      ...(payload.isPrivate
        ? { accessCode: payload.accessCode?.toUpperCase() || this.generateAccessCode() }
        : {}
      )
    });
  }

  private generateAccessCode(): string {
    return randomBytes(3).toString("hex").toUpperCase();
  }

  findAll(user: AuthenticatedUser) {
    return this.quizRepository.findAll(user.id);
  }

  findPublished() {
    return this.quizRepository.findPublished();
  }

  async findBySlug(slug: string, accessCode?: string) {
    const quiz = await this.quizRepository.findBySlug(slug);
    if (!quiz) throw new NotFoundException(`Quiz ${slug} was not found.`);
    if (quiz.isPrivate) {
      if (!accessCode || accessCode.toUpperCase() !== quiz.accessCode) {
        throw new ForbiddenException("A valid access code is required for this quiz.");
      }
    }
    return quiz;
  }

  async validateAccessCode(code: string): Promise<Quiz> {
    const quiz = await this.quizRepository.findByAccessCode(code);
    if (!quiz) throw new NotFoundException("No published private quiz found with that code.");
    return quiz;
  }

  async findById(id: string) {
    const quiz = await this.quizRepository.findById(id);
    return this.requireQuiz(quiz, id);
  }

  async update(id: string, payload: UpdateQuizDto, user: AuthenticatedUser) {
    const existing = await this.quizRepository.findById(id);
    if (existing?.status === QuizStatus.PUBLISHED) {
      const attempts = await this.attemptRepository.findByQuizId(id);
      const activeCount    = attempts.filter((a) => !a.submittedAt).length;
      const submittedCount = attempts.filter((a) =>  a.submittedAt).length;

      if (activeCount > 0 || submittedCount > 0) {
        const parts: string[] = [];
        if (activeCount > 0)
          parts.push(`${activeCount} participant${activeCount > 1 ? "s" : ""} currently taking it`);
        if (submittedCount > 0)
          parts.push(`${submittedCount} submission${submittedCount > 1 ? "s" : ""}`);
        throw new ConflictException(
          `Cannot edit: this quiz has ${parts.join(" and ")}.`
        );
      }
    }

    const updateData = { ...payload } as typeof payload & { accessCode?: string };
    if (payload.isPrivate && !existing?.accessCode) {
      updateData.accessCode = payload.accessCode?.toUpperCase() || this.generateAccessCode();
    } else if (payload.isPrivate === false) {
      updateData.accessCode = undefined;
    }

    const quiz = await this.quizRepository.update(id, user.id, updateData);
    return this.requireQuiz(quiz, id);
  }

  async publish(id: string, user: AuthenticatedUser) {
    const quiz = await this.quizRepository.updateStatus(id, user.id, QuizStatus.PUBLISHED);
    return this.requireQuiz(quiz, id);
  }

  async unpublish(id: string, user: AuthenticatedUser) {
    const attempts = await this.attemptRepository.findByQuizId(id);

    const activeCount   = attempts.filter((a) => !a.submittedAt).length;
    const submittedCount = attempts.filter((a) => a.submittedAt).length;

    if (activeCount > 0 || submittedCount > 0) {
      const parts: string[] = [];
      if (activeCount > 0)
        parts.push(`${activeCount} participant${activeCount > 1 ? "s" : ""} currently taking it`);
      if (submittedCount > 0)
        parts.push(`${submittedCount} submission${submittedCount > 1 ? "s" : ""}`);
      throw new ConflictException(
        `Cannot unpublish: this quiz has ${parts.join(" and ")}.`
      );
    }

    const quiz = await this.quizRepository.updateStatus(id, user.id, QuizStatus.UNPUBLISHED);
    return this.requireQuiz(quiz, id);
  }

  async delete(id: string, user: AuthenticatedUser): Promise<void> {
    const deleted = await this.quizRepository.delete(id, user.id);
    if (!deleted) {
      throw new NotFoundException(`Quiz ${id} was not found.`);
    }
  }

  async duplicate(id: string, user: AuthenticatedUser): Promise<Quiz> {
    const copy = await this.quizRepository.duplicate(id, user.id);
    return this.requireQuiz(copy, id);
  }

  private requireQuiz(quiz: Quiz | null, id: string) {
    if (!quiz) {
      throw new NotFoundException(`Quiz ${id} was not found.`);
    }

    return quiz;
  }
}
