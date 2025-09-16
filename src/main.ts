import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { EnvironmentVariables } from './common/helper/env.validation';

/**
 * Bootstrap function to start the NestJS application
 * Configures global pipes, CORS, and starts the server
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService<EnvironmentVariables>);
  const port = configService.get('PORT') || 3000;

  // Enable CORS for GraphQL playground and frontend
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Global validation pipe for input validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}/graphql`);
}

bootstrap();
