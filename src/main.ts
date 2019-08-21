import csurf from 'csurf';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.use(csurf({ cookie: true }));
  app.use(helmet());
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));

  await app.listen(4000);
}

bootstrap();
