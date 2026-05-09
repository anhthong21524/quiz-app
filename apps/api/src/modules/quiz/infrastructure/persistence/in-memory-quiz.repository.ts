import { Injectable } from "@nestjs/common";
import { Quiz, QuizStatus } from "@quiz-app/shared";
import { randomUUID } from "node:crypto";
import {
  CreateQuizData,
  QuizRepository,
  UpdateQuizData
} from "../../domain/quiz.repository";
import { slugifyTitle } from "../persistence/mappers";

@Injectable()
export class InMemoryQuizRepository implements QuizRepository {
  private readonly quizzes = new Map<string, Quiz>();

  async create(data: CreateQuizData): Promise<Quiz> {
    const timestamp = new Date().toISOString();
    const id = randomUUID();
    const slug = slugifyTitle(data.title) + "-" + id.replace(/-/g, "").slice(-6);
    const quiz: Quiz = {
      id,
      slug,
      title: data.title,
      description: data.description,
      ownerId: data.ownerId,
      ownerEmail: data.ownerEmail,
      subject: data.subject,
      difficulty: data.difficulty,
      timeLimit: data.timeLimit ?? null,
      status: QuizStatus.IN_PROGRESS,
      isPrivate: data.isPrivate ?? false,
      accessCode: data.accessCode,
      isExposed: data.isExposed ?? false,
      allowSummary: data.allowSummary ?? true,
      allowReviewAnswers: data.allowReviewAnswers ?? true,
      allowRetake: data.allowRetake ?? true,
      questions: data.questions.map((question) => ({
        ...question,
        id: question.id ?? randomUUID()
      })),
      createdAt: timestamp,
      updatedAt: timestamp
    };

    this.quizzes.set(id, quiz);
    return quiz;
  }

  async findAll(ownerId: string): Promise<Quiz[]> {
    return Array.from(this.quizzes.values())
      .filter((quiz) => quiz.ownerId === ownerId)
      .sort((left, right) =>
        (right.updatedAt ?? "").localeCompare(left.updatedAt ?? "")
      );
  }

  async findPublished(): Promise<Quiz[]> {
    return Array.from(this.quizzes.values())
      .filter((quiz) => quiz.status === QuizStatus.PUBLISHED && !quiz.isPrivate)
      .sort((left, right) =>
        (right.updatedAt ?? "").localeCompare(left.updatedAt ?? "")
      );
  }

  async findExposedByUsername(username: string): Promise<Quiz[]> {
    const prefix = username.toLowerCase() + "@";
    return Array.from(this.quizzes.values())
      .filter((quiz) => quiz.isExposed && (quiz.ownerEmail ?? "").startsWith(prefix))
      .sort((left, right) =>
        (right.updatedAt ?? "").localeCompare(left.updatedAt ?? "")
      );
  }

  async findByAccessCode(code: string): Promise<Quiz | null> {
    const upper = code.toUpperCase();
    for (const quiz of this.quizzes.values()) {
      if (quiz.accessCode === upper && quiz.status === QuizStatus.PUBLISHED && quiz.isPrivate) {
        return quiz;
      }
    }
    return null;
  }

  async findById(id: string): Promise<Quiz | null> {
    return this.quizzes.get(id) ?? null;
  }

  async findBySlug(slug: string): Promise<Quiz | null> {
    for (const quiz of this.quizzes.values()) {
      if ((quiz.slug ?? slugifyTitle(quiz.title)) === slug) return quiz;
    }
    return null;
  }

  async update(id: string, ownerId: string, data: UpdateQuizData): Promise<Quiz | null> {
    const current = this.quizzes.get(id);
    if (!current || current.ownerId !== ownerId) {
      return null;
    }

    const updated: Quiz = {
      ...current,
      ...data,
      slug: data.title ? slugifyTitle(data.title) + "-" + id.replace(/-/g, "").slice(-6) : current.slug,
      questions:
        data.questions?.map((question) => ({
          ...question,
          id: question.id ?? randomUUID()
        })) ?? current.questions,
      updatedAt: new Date().toISOString()
    };

    this.quizzes.set(id, updated);
    return updated;
  }

  async updateStatus(id: string, ownerId: string, status: QuizStatus): Promise<Quiz | null> {
    return this.update(id, ownerId, { status });
  }

  async delete(id: string, ownerId: string): Promise<boolean> {
    const current = this.quizzes.get(id);
    if (!current || current.ownerId !== ownerId) {
      return false;
    }

    return this.quizzes.delete(id);
  }

  async duplicate(id: string, ownerId: string): Promise<Quiz | null> {
    const quiz = this.quizzes.get(id);
    if (!quiz || quiz.ownerId !== ownerId) return null;

    const timestamp = new Date().toISOString();
    const newId = randomUUID();
    const copy: Quiz = {
      ...quiz,
      id: newId,
      title: `Copy of ${quiz.title}`,
      status: QuizStatus.IN_PROGRESS,
      isPrivate: false,
      accessCode: undefined,
      isExposed: false,
      questions: quiz.questions.map((q) => ({ ...q, id: randomUUID() })),
      createdAt: timestamp,
      updatedAt: timestamp
    };
    this.quizzes.set(newId, copy);
    return copy;
  }
}
