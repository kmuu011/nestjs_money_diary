import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';

import {TestModule} from "./test/test.module";
import {TodoModule} from './todo/todo.module';
import {MemberModule} from "./member/member.module";

import {PrefixMiddleware} from "middleware/prefix.middleware";
import {LoggerMiddleware} from "middleware/logger.middleware";

@Module({
    imports: [
        TestModule,
        MemberModule,
        TodoModule,
    ],
})

export class AppModule implements NestModule{
    configure(consumer: MiddlewareConsumer): any {

        // API 호출 로깅 미들웨어
        consumer.apply(LoggerMiddleware).forRoutes('*');

        // 데이터 파싱 미들웨어
        consumer.apply(PrefixMiddleware).forRoutes('*');
    }
}
