import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ConfigurationService } from "./application/configuration.service";
import {
  CONFIGURATION_REPOSITORY,
  type ConfigurationRepository
} from "./domain/configuration.repository";
import { InMemoryConfigurationRepository } from "./infrastructure/persistence/in-memory-configuration.repository";
import { MongoConfigurationRepository } from "./infrastructure/persistence/mongo-configuration.repository";
import { ConfigurationController } from "./presentation/configuration.controller";

@Module({
  controllers: [ConfigurationController],
  providers: [
    ConfigurationService,
    InMemoryConfigurationRepository,
    {
      provide: CONFIGURATION_REPOSITORY,
      inject: [ConfigService, InMemoryConfigurationRepository],
      useFactory: async (
        configService: ConfigService,
        inMemoryRepository: InMemoryConfigurationRepository
      ): Promise<ConfigurationRepository> => {
        if (!configService.get<string>("MONGODB_URI")) {
          return inMemoryRepository;
        }

        const mongoRepository = new MongoConfigurationRepository(configService);
        return (await mongoRepository.connect()) ? mongoRepository : inMemoryRepository;
      }
    }
  ]
})
export class ConfigurationModule {}
