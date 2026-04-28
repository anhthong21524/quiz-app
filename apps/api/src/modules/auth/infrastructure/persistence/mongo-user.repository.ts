import { Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Connection, Model, connect } from "mongoose";
import { CreateUserData, User, UserRepository } from "./user.repository";
import { UserEntity, UserSchema } from "./user.schema";

type MongoUserRecord = UserEntity & {
  _id: unknown;
};

@Injectable()
export class MongoUserRepository implements UserRepository, OnModuleDestroy {
  private readonly logger = new Logger(MongoUserRepository.name);
  private connection: Connection | null = null;
  private userModel: Model<UserEntity> | null = null;

  constructor(private readonly configService: ConfigService) {}

  async connect(): Promise<boolean> {
    const uri = this.configService.get<string>("MONGODB_URI");
    if (!uri) return false;

    const databaseName = this.configService.get<string>("DATABASE_NAME") ?? "quiz_app";
    try {
      const mongoose = await connect(uri, {
        dbName: databaseName,
        serverSelectionTimeoutMS: 2000
      });
      this.connection = mongoose.connection;
      this.userModel =
        this.connection.models.User ??
        this.connection.model<UserEntity>("User", UserSchema, "qa_users");
      this.logger.log(`Connected to MongoDB database "${databaseName}" for users.`);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown MongoDB connection error.";
      this.logger.warn(`MongoDB unavailable for users; using in-memory repository. ${message}`);
      return false;
    }
  }

  async onModuleDestroy() {
    if (this.connection) {
      await this.connection.close();
    }
  }

  private getModel(): Model<UserEntity> {
    if (!this.userModel) {
      throw new Error("Mongo user repository requested without an active connection.");
    }
    return this.userModel;
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await this.getModel().findOne({ email }).lean();
    return doc ? this.toUser(doc) : null;
  }

  async findById(id: string): Promise<User | null> {
    const doc = await this.getModel().findById(id).lean();
    return doc ? this.toUser(doc) : null;
  }

  async findByGoogleSub(googleSub: string): Promise<User | null> {
    const doc = await this.getModel().findOne({ googleSub }).lean();
    return doc ? this.toUser(doc) : null;
  }

  async create(data: CreateUserData): Promise<User> {
    const doc = await this.getModel().create(data);
    return this.toUser(doc.toObject());
  }

  async updateAvatar(id: string, avatarUrl: string): Promise<void> {
    await this.getModel().findByIdAndUpdate(id, { avatarUrl });
  }

  async updatePassword(id: string, passwordHash: string, passwordSalt: string): Promise<void> {
    await this.getModel().findByIdAndUpdate(id, { passwordHash, passwordSalt });
  }

  private toUser(doc: MongoUserRecord): User {
    return {
      id: String(doc._id),
      email: doc.email,
      passwordHash: doc.passwordHash,
      passwordSalt: doc.passwordSalt,
      googleSub: doc.googleSub,
      avatarUrl: doc.avatarUrl
    };
  }
}
