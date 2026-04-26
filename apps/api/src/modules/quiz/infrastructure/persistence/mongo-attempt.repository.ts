import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Connection, Model, Types, connect } from "mongoose";
import { QuizAttempt } from "../../domain/quiz-attempt";
import { AttemptRepository } from "../../domain/attempt.repository";
import { QuizAttemptEntity, QuizAttemptSchema } from "./quiz-attempt.schema";

function normalizeAttempt(doc: Record<string, unknown>): QuizAttempt {
  const id = doc._id instanceof Types.ObjectId ? doc._id.toString() : String(doc._id ?? "");
  return {
    id,
    quizId: doc.quizId as string,
    takerName: doc.takerName as string,
    startedAt: doc.startedAt as string,
    timeLimit: (doc.timeLimit as number | null) ?? null,
    submittedAt: doc.submittedAt as string | undefined,
    answers: doc.answers as Record<string, number> | undefined,
    score: doc.score as number | undefined,
    totalQuestions: doc.totalQuestions as number | undefined
  };
}

@Injectable()
export class MongoAttemptRepository implements AttemptRepository {
  private readonly logger = new Logger(MongoAttemptRepository.name);
  private connection: Connection | null = null;
  private attemptModel: Model<QuizAttemptEntity> | null = null;

  async connect(configService: ConfigService): Promise<boolean> {
    const uri = configService.get<string>("MONGODB_URI");
    if (!uri) return false;

    const databaseName = configService.get<string>("DATABASE_NAME") ?? "quiz_app";
    try {
      const mongoose = await connect(uri, {
        dbName: databaseName,
        serverSelectionTimeoutMS: 2000
      });
      this.connection = mongoose.connection;
      this.attemptModel =
        this.connection.models.QuizAttempt ??
        this.connection.model<QuizAttemptEntity>("QuizAttempt", QuizAttemptSchema, "quiz_attempts");
      this.logger.log("MongoAttemptRepository connected.");
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error.";
      this.logger.warn(`MongoDB unavailable for attempts; using in-memory repository. ${message}`);
      return false;
    }
  }

  private getModel(): Model<QuizAttemptEntity> {
    if (!this.attemptModel) {
      throw new Error("Mongo attempt repository used without an active connection.");
    }
    return this.attemptModel;
  }

  async create(quizId: string, takerName: string, timeLimit: number | null): Promise<QuizAttempt> {
    const doc = await this.getModel().create({
      quizId,
      takerName,
      startedAt: new Date().toISOString(),
      timeLimit
    });
    return normalizeAttempt(doc.toObject() as unknown as Record<string, unknown>);
  }

  async findById(id: string): Promise<QuizAttempt | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await this.getModel().findById(id).lean();
    if (!doc) return null;
    return normalizeAttempt(doc as Record<string, unknown>);
  }

  async submit(
    id: string,
    answers: Record<string, number>,
    score: number,
    totalQuestions: number
  ): Promise<QuizAttempt | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await this.getModel()
      .findByIdAndUpdate(
        id,
        { submittedAt: new Date().toISOString(), answers, score, totalQuestions },
        { new: true }
      )
      .lean();
    if (!doc) return null;
    return normalizeAttempt(doc as Record<string, unknown>);
  }
}
