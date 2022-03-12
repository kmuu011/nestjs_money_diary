import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {
    ControllableExceptionFilter,
    OutOfControlExceptionFilter
  } from 'filter/exception.filter';

import Config from 'config/config';

const port = Config.port;

const appOptions = {
    cors: true
};

async function bootstrap() {
    const app = await NestFactory.create(AppModule, appOptions);

    app.setGlobalPrefix('api');

    // 예상 범위 밖의 예외 필터
    app.useGlobalFilters(new OutOfControlExceptionFilter());

    // 예상 범위 내의 예외 필터
    app.useGlobalFilters(new ControllableExceptionFilter());

    await app.listen(port);
}

bootstrap();
