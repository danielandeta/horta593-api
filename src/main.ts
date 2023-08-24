import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
//import * as basicAuth from 'express-basic-auth';
import basicAuth from 'express-basic-auth';
//import * as cookieParser from "cookie-parser";
import cookieParser from 'cookie-parser';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(
    ['/docs'],
    basicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER as string]: process.env
          .SWAGGER_PASSWORD as string,
      },
    }),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const config = new DocumentBuilder()
    .setTitle('Horta593 API Documentation')
    .setDescription('This is the API documentation for the Horta593.')
    .setVersion('0.1')
    .build();
  const option: SwaggerDocumentOptions = {
    include: [AppModule],
    deepScanRoutes: true,
  };

  const document = SwaggerModule.createDocument(app, config, option);
  SwaggerModule.setup('docs', app, document);

  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.enableCors({
    allowedHeaders: ['Content-Type', 'Authorization'],
    origin: [process.env.CLIENT_URL, process.env.MOBILE_URL],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    preflightContinue: false,
  });
  await app.listen(process.env.PORT || 3001);
}
bootstrap();
