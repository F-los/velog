import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import {
  HttpExceptionFilter,
  AllExceptionsFilter,
} from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Helmet Security Headers
  app.use(
    helmet({
      contentSecurityPolicy:
        process.env.NODE_ENV === 'production' ? undefined : false,
      crossOriginEmbedderPolicy: process.env.NODE_ENV === 'production',
    }),
  );

  // ✅ Global Exception Filters
  // 순서: AllExceptions → HttpException (구체적인 것이 나중)
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

  // CORS 설정 - 여러 프론트엔드 URL 허용
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONTEND_URL,
  ].filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // origin이 없는 경우 (same-origin 요청) 또는 허용된 origin인 경우
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // 전역 validation pipe 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const port = process.env.PORT ?? 8000;
  const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1';

  await app.listen(Number(process.env.PORT) || 8000, '0.0.0.0');
  console.log(`Application is running on: http://${host}:${port}`);
}
bootstrap();
