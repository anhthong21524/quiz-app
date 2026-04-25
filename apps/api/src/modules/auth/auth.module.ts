import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { GoogleAuthGuard } from "./guards/google-auth.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { InMemoryUserRepository } from "./infrastructure/persistence/in-memory-user.repository";
import { MongoUserRepository } from "./infrastructure/persistence/mongo-user.repository";
import { USER_REPOSITORY, type UserRepository } from "./infrastructure/persistence/user.repository";
import { GoogleStrategy } from "./strategies/google.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET") ?? "default-secret-change-in-production",
        signOptions: { expiresIn: "15m" }
      })
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    JwtAuthGuard,
    GoogleAuthGuard,
    InMemoryUserRepository,
    {
      provide: USER_REPOSITORY,
      inject: [ConfigService, InMemoryUserRepository],
      useFactory: async (
        configService: ConfigService,
        inMemory: InMemoryUserRepository
      ): Promise<UserRepository> => {
        if (!configService.get<string>("MONGODB_URI")) {
          return inMemory;
        }

        const mongo = new MongoUserRepository(configService);
        return (await mongo.connect()) ? mongo : inMemory;
      }
    }
  ],
  exports: [JwtAuthGuard]
})
export class AuthModule {}
