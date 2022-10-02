import {ArgumentsHost, Catch, ExceptionFilter, HttpException} from '@nestjs/common';
import {Request, Response} from 'express';
import * as Sentry from '@sentry/node';
import {IncomingWebhook} from "@slack/client";
import {slack} from "../../../config/config";

const webhook = new IncomingWebhook(
    slack.apiLogHook //slack hook url
);

const errorLevelObject = {
    ...Sentry.Severity
}

function captureSentry (status: number, api: string, exception: HttpException, req: Request): void {
    const { query, params } = req;

    Sentry.setContext("desc", {
        exception,
        query, params, status
    });

    let errorLevel;

    if(status >= 500){
        errorLevel = errorLevelObject.Error;
    }else if(!status){
        errorLevel = errorLevelObject.Critical;
    }else{
        errorLevel = errorLevelObject.Info
    }

    Sentry.configureScope(function(scope){
        scope.setLevel(errorLevel);
    });

    Sentry.captureException(exception);

    if(status >= 500 || !status) {
        webhook.send({
            attachments: [
                {
                    color: "danger",
                    text: `🚨${api} 에러 발생`,
                    fields: [
                        {
                            title: `ㅡ${api}ㅡ`,
                            value: exception?.stack,
                            short: false
                        }
                    ],
                    ts: new Date().toString()
                }
            ]
        });
    }
}

@Catch(HttpException)
export class ControllableExceptionFilter implements ExceptionFilter {
    async catch(exception: HttpException, host: ArgumentsHost): Promise<void> {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const req = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const response: any = exception.getResponse();
        // const stack = exception?.stack.toString() || '';
        const api = req.originalUrl;
        const {error, message} = response;

        captureSentry(status, api, exception, req);

        res
            .status(status)
            .json({
                statusCode: status,
                error,
                message: message.toString().replace(/\,/g, '\n')
            });
    }
}

@Catch()
export class OutOfControlExceptionFilter implements ExceptionFilter {
    async catch(exception: any, host: ArgumentsHost): Promise<void> {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const req = ctx.getRequest<Request>();
        // const stack = exception?.stack?.toString() || '';
        const api = req.originalUrl;
        const status = exception?.status || 500;

        if(status === 404){
            res
                .status(status)
                .json({
                    statusCode: status,
                    error: 'not_found',
                    message: '요청하신 url을 찾을 수 없습니다.'
                });
            return;
        }

        captureSentry(status, api, exception, req);

        res
            .status(status)
            .json({
                statusCode: status,
                error: 'out_of_control_server_error',
                message: '지정되지 않은 오류가 발생했습니다.' +
                    '\n빠른 시일 내에 수정 될 예정입니다.' +
                    '\n이용해 주셔서 감사합니다.'
            });
    }
}