import { Injectable } from "@nestjs/common";
import { Quiz, QuizStatus } from "@quiz-app/shared";
import { randomUUID } from "node:crypto";
import {
  CreateQuizData,
  QuizRepository,
  UpdateQuizData
} from "../../domain/quiz.repository";

@Injectable()
export class InMemoryQuizRepository implements QuizRepository {
  private readonly quizzes = new Map<string, Quiz>();

  async create(data: CreateQuizData): Promise<Quiz> {
    const timestamp = new Date().toISOString();
    const id = randomUUID();
    const quiz: Quiz = {
      id,
      title: data.title,
      description: data.description,
      status: QuizStatus.IN_PROGRESS,
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

  async findAll(): Promise<Quiz[]> {
    return Array.from(this.quizzes.values()).sort((left, right) =>
      (right.updatedAt ?? "").localeCompare(left.updatedAt ?? "")
    );
  }

  async findById(id: string): Promise<Quiz | null> {
    return this.quizzes.get(id) ?? null;
  }

  async update(id: string, data: UpdateQuizData): Promise<Quiz | null> {
    const current = this.quizzes.get(id);
    if (!current) {
      return null;
    }

    const updated: Quiz = {
      ...current,
      ...data,
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

  async updateStatus(id: string, status: QuizStatus): Promise<Quiz | null> {
    return this.update(id, { status });
  }

  async delete(id: string): Promise<boolean> {
    return this.quizzes.delete(id);
  }

  async duplicate(id: string): Promise<Quiz | null> {
    const quiz = this.quizzes.get(id);
    if (!quiz) return null;

    const timestamp = new Date().toISOString();
    const newId = randomUUID();
    const copy: Quiz = {
      ...quiz,
      id: newId,
      title: `Copy of ${quiz.title}`,
      status: QuizStatus.IN_PROGRESS,
      questions: quiz.questions.map((q) => ({ ...q, id: randomUUID() })),
      createdAt: timestamp,
      updatedAt: timestamp
    };
    this.quizzes.set(newId, copy);
    return copy;
  }
}
