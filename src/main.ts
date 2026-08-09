import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './interceptors/loggin.interceptor';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import {
  HttpExceptionFilter,
  PrismaExceptionFilter,
  UncaughtExceptionFilter,
  ZodExceptionFilter,
} from './exceptions/exception';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

BigInt.prototype.toJSON = function () {
  return this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('trust proxy', 'loopback'); // Trust requests from the loopback address

  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ResponseInterceptor(),
  );

  app.useGlobalFilters(
    new UncaughtExceptionFilter(),
    new HttpExceptionFilter(),
    new ZodExceptionFilter(),
    new PrismaExceptionFilter(),
  );

  // Swagger OpenAPI Setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Simple Shop API')
    .setDescription(
      'Robust E-commerce RESTful API built with NestJS 11, Prisma ORM, MySQL, JWT Auth, Idempotent Operations, and ImageKit Asset Management.',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Simple Shop API Docs',
  });

  console.log(`Environment: ${process.env.NODE_ENV ?? 'development'}`);
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
