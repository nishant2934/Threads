import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { env } from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{cors:{origin:[env.FRONTEND_URL]}});
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(9000);
}

bootstrap();
