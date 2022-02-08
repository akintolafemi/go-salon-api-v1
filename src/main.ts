import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

//sentry
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: "https://490145ca6de940e3ac57ed7ab416e7f8@o1125597.ingest.sentry.io/6165644",

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: Number(`${process.env.SENTRY_TRACESSAMPLERATE}`),
});

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
