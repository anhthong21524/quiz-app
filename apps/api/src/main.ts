import { INestApplication, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import express, { json } from "express";
import { IncomingMessage, ServerResponse } from "node:http";
import { AppModule } from "./app.module";
import { createCorsOriginResolver } from "./frontend-origin";

function configureApp(app: INestApplication) {
  app.use(json({ limit: "5mb" }));
  app.setGlobalPrefix("api");
  app.enableCors({
    origin: createCorsOriginResolver(process.env.FRONTEND_URL)
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true
    })
  );
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApp(app);

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
}

let handlerPromise:
  | Promise<ReturnType<typeof express>>
  | undefined;

async function getHandler() {
  if (!handlerPromise) {
    handlerPromise = (async () => {
      const server = express();
      const app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(server)
      );

      configureApp(app);
      await app.init();

      return server;
    })();
  }

  return handlerPromise;
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
) {
  const server = await getHandler();
  return server(req as never, res as never);
}

if (!process.env.VERCEL) {
  void bootstrap();
}
