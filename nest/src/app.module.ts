import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';

import {TodoModule} from './todo/todo.module';
import {MemberModule} from "./member/member.module";
import {PrefixMiddleware} from "middleware/prefixMiddleware";

@Module({
    imports: [
        MemberModule,
        TodoModule,
    ]
})

export class AppModule implements NestModule{
    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(PrefixMiddleware).forRoutes('*');
    }
}
