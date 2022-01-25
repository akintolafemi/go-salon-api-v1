import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ["*", "http://localhost:3131", "https://go-salon.heroku.app"],
    methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    }),
  )
  await app.listen(process.env.PORT || 3131);
}
bootstrap();
