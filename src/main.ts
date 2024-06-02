import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = configService.get<number>('PORT') ?? 4001;

  await app.listen(port);
  console.log(`============================================`);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`============================================`);
}
bootstrap();
