import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { AuthModule } from "./modules/auth/auth.module";
import { ConfigurationModule } from "./modules/configuration/configuration.module";
import { JwtAuthGuard } from "./modules/auth/guards/jwt-auth.guard";
import { QuizModule } from "./modules/quiz/quiz.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", "../../.env"]
    }),
    AuthModule,
    ConfigurationModule,
    QuizModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ]
})
export class AppModule {}
