import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { QuizStatus, type Quiz } from "@quiz-app/shared";
import { CreateQuizDto } from "./dto/create-quiz.dto";
import { UpdateQuizDto } from "./dto/update-quiz.dto";
import { QUIZ_REPOSITORY, QuizRepository } from "../domain/quiz.repository";

@Injectable()
export class QuizService {
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: QuizRepository
  ) {}

  create(payload: CreateQuizDto) {
    return this.quizRepository.create(payload);
  }

  findAll() {
    return this.quizRepository.findAll();
  }

  async findById(id: string) {
    const quiz = await this.quizRepository.findById(id);
    return this.requireQuiz(quiz, id);
  }

  async update(id: string, payload: UpdateQuizDto) {
    const quiz = await this.quizRepository.update(id, payload);
    return this.requireQuiz(quiz, id);
  }

  async publish(id: string) {
    const quiz = await this.quizRepository.updateStatus(id, QuizStatus.PUBLISHED);
    return this.requireQuiz(quiz, id);
  }

  async unpublish(id: string) {
    const quiz = await this.quizRepository.updateStatus(id, QuizStatus.UNPUBLISHED);
    return this.requireQuiz(quiz, id);
  }

  private requireQuiz(quiz: Quiz | null, id: string) {
    if (!quiz) {
      throw new NotFoundException(`Quiz ${id} was not found.`);
    }

    return quiz;
  }
}
