import {Global, MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';

import {TodoGroupModule} from './modules/todoGroup/todoGroup.module';
import {MemberModule} from "./modules/member/member.module";

import {PrefixMiddleware} from "./common/middleware/prefix.middleware";
import {LoggerMiddleware} from "./common/middleware/logger.middleware";

import {TypeOrmModule} from "@nestjs/typeorm";
import {sentry, typeOrmOptions} from "../config/config";
import {MemberRepository} from "./modules/member/member.repository";
import {TokenRepository} from "./modules/member/token/token.repository";
import {TodoGroupRepository} from "./modules/todoGroup/todoGroup.repository";
import * as Sentry from '@sentry/node';
import { SentryModule } from './sentry/sentry.module';
import '@sentry/tracing';
import { ServeStaticModule } from '@nestjs/serve-static';
import {join} from "path";

@Global()
@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..','..', 'static'),
            exclude: ['/api*']
        }),
        SentryModule.forRoot(sentry),
        TypeOrmModule.forRoot(typeOrmOptions),
        TypeOrmModule.forFeature([
            MemberRepository,
            TokenRepository,
        ]),
        MemberModule,
        TodoGroupModule,
    ],
    exports: [
        TypeOrmModule.forFeature([
            MemberRepository,
            TokenRepository,
            TodoGroupRepository,
        ]),
    ]
})

export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(Sentry.Handlers.requestHandler()).forRoutes({
            path: '*',
            method: RequestMethod.ALL,
        });

        // API 호출 로깅 미들웨어
        consumer.apply(LoggerMiddleware).forRoutes('*');

        // 데이터 파싱 미들웨어
        consumer.apply(PrefixMiddleware).forRoutes('*');
    }
}
