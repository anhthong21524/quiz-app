import { Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SubjectDomainConfiguration } from "@quiz-app/shared";
import { Connection, Model, connect } from "mongoose";
import { ConfigurationRepository } from "../../domain/configuration.repository";
import { ConfigurationEntity, ConfigurationSchema } from "./configuration.schema";

@Injectable()
export class MongoConfigurationRepository implements ConfigurationRepository, OnModuleDestroy {
  private readonly logger = new Logger(MongoConfigurationRepository.name);
  private connection: Connection | null = null;
  private configurationModel: Model<ConfigurationEntity> | null = null;

  constructor(private readonly configService: ConfigService) {}

  async connect(): Promise<boolean> {
    const uri = this.configService.get<string>("MONGODB_URI");
    if (!uri) {
      return false;
    }

    const databaseName = this.configService.get<string>("DATABASE_NAME") ?? "quiz_app";
    try {
      const mongoose = await connect(uri, {
        dbName: databaseName,
        serverSelectionTimeoutMS: 2000
      });
      this.connection = mongoose.connection;
      this.configurationModel =
        this.connection.models.Configuration ??
        this.connection.model<ConfigurationEntity>(
          "Configuration",
          ConfigurationSchema,
          "qa_configurations"
        );
      this.logger.log(`Connected to MongoDB database "${databaseName}" for configurations.`);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown MongoDB connection error.";
      this.logger.warn(`MongoDB unavailable for configurations; using in-memory repository. ${message}`);
      return false;
    }
  }

  async onModuleDestroy() {
    if (this.connection) {
      await this.connection.close();
    }
  }

  private getModel(): Model<ConfigurationEntity> {
    if (!this.configurationModel) {
      throw new Error("Mongo configuration repository requested without an active connection.");
    }
    return this.configurationModel;
  }

  async getSubjectDomains(ownerId: string): Promise<SubjectDomainConfiguration | null> {
    const doc = await this.getModel().findOne({ ownerId }).lean();
    return doc ? { subjectDomains: doc.subjectDomains } : null;
  }

  async saveSubjectDomains(
    ownerId: string,
    subjectDomains: string[]
  ): Promise<SubjectDomainConfiguration> {
    const doc = await this.getModel()
      .findOneAndUpdate(
        { ownerId },
        { ownerId, subjectDomains },
        { new: true, runValidators: true, upsert: true }
      )
      .lean();

    return { subjectDomains: doc?.subjectDomains ?? subjectDomains };
  }
}
