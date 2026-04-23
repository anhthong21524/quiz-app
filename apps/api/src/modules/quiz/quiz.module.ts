import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { QuizService } from "./application/quiz.service";
import { QUIZ_REPOSITORY } from "./domain/quiz.repository";
import { InMemoryQuizRepository } from "./infrastructure/persistence/in-memory-quiz.repository";
import { MongoQuizRepository } from "./infrastructure/persistence/mongo-quiz.repository";
import { QuizController } from "./presentation/quiz.controller";

@Module({
  controllers: [QuizController],
  providers: [
    QuizService,
    InMemoryQuizRepository,
    MongoQuizRepository,
    {
      provide: QUIZ_REPOSITORY,
      inject: [ConfigService, InMemoryQuizRepository, MongoQuizRepository],
      useFactory: (
        configService: ConfigService,
        inMemoryRepository: InMemoryQuizRepository,
        mongoRepository: MongoQuizRepository
      ) => {
        return configService.get<string>("MONGODB_URI")
          ? mongoRepository
          : inMemoryRepository;
      }
    }
  ]
})
export class QuizModule {}

