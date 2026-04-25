import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { QuizStatus, type Quiz } from "@quiz-app/shared";
import { CreateQuizDto } from "./dto/create-quiz.dto";
import { UpdateQuizDto } from "./dto/update-quiz.dto";
import { QUIZ_REPOSITORY, QuizRepository } from "../domain/quiz.repository";

export interface AuthenticatedUser {
  id: string;
  email: string;
}

@Injectable()
export class QuizService {
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: QuizRepository
  ) {}

  create(payload: CreateQuizDto, user: AuthenticatedUser) {
    return this.quizRepository.create({
      ...payload,
      ownerId: user.id,
      ownerEmail: user.email
    });
  }

  findAll(user: AuthenticatedUser) {
    return this.quizRepository.findAll(user.id);
  }

  async findById(id: string) {
    const quiz = await this.quizRepository.findById(id);
    return this.requireQuiz(quiz, id);
  }

  async update(id: string, payload: UpdateQuizDto, user: AuthenticatedUser) {
    const quiz = await this.quizRepository.update(id, user.id, payload);
    return this.requireQuiz(quiz, id);
  }

  async publish(id: string, user: AuthenticatedUser) {
    const quiz = await this.quizRepository.updateStatus(id, user.id, QuizStatus.PUBLISHED);
    return this.requireQuiz(quiz, id);
  }

  async unpublish(id: string, user: AuthenticatedUser) {
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
