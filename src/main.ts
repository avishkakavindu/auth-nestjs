import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT') ?? 4001;

  await app.listen(port);
  console.log(`============================================`);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`============================================`);
}
bootstrap();
