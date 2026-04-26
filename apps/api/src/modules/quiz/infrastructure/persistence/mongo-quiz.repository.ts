import { Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Quiz, QuizStatus } from "@quiz-app/shared";
import { Model, Connection, Types, connect } from "mongoose";
import {
  CreateQuizData,
  QuizRepository,
  UpdateQuizData
} from "../../domain/quiz.repository";
import { normalizeQuiz, slugifyTitle } from "./mappers";
import { QuizEntity, QuizSchema } from "./quiz.schema";

@Injectable()
export class MongoQuizRepository
  implements QuizRepository, OnModuleDestroy
{
  private readonly logger = new Logger(MongoQuizRepository.name);
  connection: Connection | null = null;
  private quizModel: Model<QuizEntity> | null = null;

  constructor(private readonly configService: ConfigService) {}

  async connect(): Promise<boolean> {
    const uri = this.configService.get<string>("MONGODB_URI");
    if (!uri) {
      return false;
    }

    const databaseName =
      this.configService.get<string>("DATABASE_NAME") ?? "quiz_app";
    try {
      const mongoose = await connect(uri, {
        dbName: databaseName,
        serverSelectionTimeoutMS: 2000
      });
      this.connection = mongoose.connection;
      this.quizModel =
        this.connection.models.Quiz ??
        this.connection.model<QuizEntity>("Quiz", QuizSchema, "quizzes");
      this.logger.log(`Connected to MongoDB database "${databaseName}".`);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown MongoDB connection error.";
      this.logger.warn(`MongoDB unavailable for quizzes; using in-memory repository. ${message}`);
      return false;
    }
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
    const id = new Types.ObjectId();
    const slug = slugifyTitle(data.title) + "-" + id.toString().slice(-6);
    const quiz = await this.getModel().create({
      _id: id,
      ...data,
      slug,
      status: QuizStatus.IN_PROGRESS
    });
    return normalizeQuiz(quiz.toObject());
  }

  async findAll(ownerId: string): Promise<Quiz[]> {
    const quizzes = await this.getModel().find({ ownerId }).sort({ updatedAt: -1 }).lean();
    return quizzes.map((quiz) => normalizeQuiz(quiz));
  }

  async findPublished(): Promise<Quiz[]> {
    const quizzes = await this.getModel()
      .find({ status: QuizStatus.PUBLISHED })
      .sort({ updatedAt: -1 })
      .lean();
    return quizzes.map((quiz) => normalizeQuiz(quiz));
  }

  async findById(id: string): Promise<Quiz | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const quiz = await this.getModel().findById(id).lean();
    return quiz ? normalizeQuiz(quiz) : null;
  }

  async findBySlug(slug: string): Promise<Quiz | null> {
    const bySlug = await this.getModel().findOne({ slug }).lean();
    if (bySlug) return normalizeQuiz(bySlug);

    // Fallback: find published quizzes whose title produces the same slug
    const candidates = await this.getModel()
      .find({ slug: { $exists: false } })
      .lean();
    const match = candidates.find((q) => slugifyTitle(q.title) === slug);
    return match ? normalizeQuiz(match) : null;
  }

  async update(id: string, ownerId: string, data: UpdateQuizData): Promise<Quiz | null> {
    const updateData = {
      ...data,
      ...(data.title ? { slug: slugifyTitle(data.title) + "-" + id.slice(-6) } : {})
    };
    const quiz = await this.getModel()
      .findOneAndUpdate({ _id: id, ownerId }, updateData, {
        new: true,
        runValidators: true
      })
      .lean();

    return quiz ? normalizeQuiz(quiz) : null;
  }

  async updateStatus(id: string, ownerId: string, status: QuizStatus): Promise<Quiz | null> {
    return this.update(id, ownerId, { status });
  }

  async delete(id: string, ownerId: string): Promise<boolean> {
    const result = await this.getModel().findOneAndDelete({ _id: id, ownerId }).lean();
    return !!result;
  }

  async duplicate(id: string, ownerId: string): Promise<Quiz | null> {
    const quiz = await this.getModel().findOne({ _id: id, ownerId }).lean();
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
