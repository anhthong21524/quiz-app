import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Quiz, QuizStatus } from "@quiz-app/shared";
import { Model, Connection, connect } from "mongoose";
import {
  CreateQuizData,
  QuizRepository,
  UpdateQuizData
} from "../../domain/quiz.repository";
import { normalizeQuiz } from "./mappers";
import { QuizEntity, QuizSchema } from "./quiz.schema";

@Injectable()
export class MongoQuizRepository
  implements QuizRepository, OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(MongoQuizRepository.name);
  private connection: Connection | null = null;
  private quizModel: Model<QuizEntity> | null = null;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const uri = this.configService.get<string>("MONGODB_URI");
    if (!uri) {
      return;
    }

    const databaseName =
      this.configService.get<string>("DATABASE_NAME") ?? "quiz_app";
    const mongoose = await connect(uri, { dbName: databaseName });
    this.connection = mongoose.connection;
    this.quizModel =
      this.connection.models.Quiz ??
      this.connection.model<QuizEntity>("Quiz", QuizSchema, "quizzes");
    this.logger.log(`Connected to MongoDB database "${databaseName}".`);
  }

  async onModuleDestroy() {
    if (this.connection) {
      await this.connection.close();
    }
  }

  private getModel(): Model<QuizEntity> {
    if (!this.quizModel) {
      throw new Error("Mongo repository requested without an active connection.");
    }
    return this.quizModel;
  }

  async create(data: CreateQuizData): Promise<Quiz> {
    const quiz = await this.getModel().create({
      ...data,
      status: QuizStatus.IN_PROGRESS
    });
    return normalizeQuiz(quiz.toObject());
  }

  async findAll(): Promise<Quiz[]> {
    const quizzes = await this.getModel().find().sort({ updatedAt: -1 }).lean();
    return quizzes.map((quiz) => normalizeQuiz(quiz));
  }

  async findById(id: string): Promise<Quiz | null> {
    const quiz = await this.getModel().findById(id).lean();
    return quiz ? normalizeQuiz(quiz) : null;
  }

  async update(id: string, data: UpdateQuizData): Promise<Quiz | null> {
    const quiz = await this.getModel()
      .findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
      })
      .lean();

    return quiz ? normalizeQuiz(quiz) : null;
  }

  async updateStatus(id: string, status: QuizStatus): Promise<Quiz | null> {
    return this.update(id, { status });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.getModel().findByIdAndDelete(id).lean();
    return !!result;
  }

  async duplicate(id: string): Promise<Quiz | null> {
    const quiz = await this.getModel().findById(id).lean();
    if (!quiz) return null;

    const { _id, __v, createdAt: _c, updatedAt: _u, ...rest } = quiz as any;
    const copy = await this.getModel().create({
      ...rest,
      title: `Copy of ${quiz.title ?? rest.title}`,
      status: QuizStatus.IN_PROGRESS
    });
    return normalizeQuiz(copy.toObject());
  }
}
