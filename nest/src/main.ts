import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import Config from 'config/config';

const port = Config.port;

async function bootstrap() {
  const appOptions = {cors: true};
  const app = await NestFactory.create(AppModule, appOptions);
  app.setGlobalPrefix('api');

  await app.listen(port);
}

bootstrap();
