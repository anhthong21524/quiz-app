import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { QuizService } from "./application/quiz.service";
import { QUIZ_REPOSITORY, type QuizRepository } from "./domain/quiz.repository";
import { InMemoryQuizRepository } from "./infrastructure/persistence/in-memory-quiz.repository";
import { MongoQuizRepository } from "./infrastructure/persistence/mongo-quiz.repository";
import { QuizController } from "./presentation/quiz.controller";

@Module({
  controllers: [QuizController],
  providers: [
    QuizService,
    InMemoryQuizRepository,
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
    }
  ]
})
export class QuizModule {}
