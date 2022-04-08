import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HEROKU_PORT } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(HEROKU_PORT || 3000);
}
bootstrap();
