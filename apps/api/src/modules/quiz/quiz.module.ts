import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AttemptService } from "./application/attempt.service";
import { QuizService } from "./application/quiz.service";
import { ATTEMPT_REPOSITORY, type AttemptRepository } from "./domain/attempt.repository";
import { QUIZ_REPOSITORY, type QuizRepository } from "./domain/quiz.repository";
import { InMemoryAttemptRepository } from "./infrastructure/persistence/in-memory-attempt.repository";
import { InMemoryQuizRepository } from "./infrastructure/persistence/in-memory-quiz.repository";
import { MongoAttemptRepository } from "./infrastructure/persistence/mongo-attempt.repository";
import { MongoQuizRepository } from "./infrastructure/persistence/mongo-quiz.repository";
import { QuizController } from "./presentation/quiz.controller";

@Module({
  controllers: [QuizController],
  providers: [
    QuizService,
    AttemptService,
    InMemoryQuizRepository,
    InMemoryAttemptRepository,
    MongoAttemptRepository,
    {
      provide: QUIZ_REPOSITORY,
      inject: [ConfigService, InMemoryQuizRepository],
      useFactory: async (
        configService: ConfigService,
        inMemoryRepository: InMemoryQuizRepository
      ): Promise<QuizRepository> => {
        if (!configService.get<string>("MONGODB_URI")) {
          return inMemoryRepository;
        }

        const mongoRepository = new MongoQuizRepository(configService);
        return (await mongoRepository.connect()) ? mongoRepository : inMemoryRepository;
      }
    },
    {
      provide: ATTEMPT_REPOSITORY,
      inject: [ConfigService, InMemoryAttemptRepository, MongoAttemptRepository],
      useFactory: async (
        configService: ConfigService,
        inMemoryRepository: InMemoryAttemptRepository,
        mongoRepository: MongoAttemptRepository
      ): Promise<AttemptRepository> => {
        if (!configService.get<string>("MONGODB_URI")) {
          return inMemoryRepository;
        }

        // Connect attempt repository using a fresh connection to the same DB
        return (await mongoRepository.connect(configService)) ? mongoRepository : inMemoryRepository;
      }
    }
  ]
})
export class QuizModule {}
