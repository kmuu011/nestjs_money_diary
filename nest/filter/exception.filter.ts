import {ArgumentsHost, Catch, ExceptionFilter, HttpException} from '@nestjs/common';
import {Request, Response} from 'express';

@Catch(HttpException)
export class ControllableExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const req = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const response = exception.getResponse();
        const stack = exception?.stack.toString() || '';

        // @ts-ignore
        const {error, message} = response;

        console.log('HttpExceptionFilter log');

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
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const req = ctx.getRequest<Request>();
        const stack = exception?.stack.toString() || '';

        console.log('EveryExceptionFilter log');
        console.log(exception);

        res
            .status(500)
            .json({
                statusCode: 500,
                code: 'out_of_control_serve_error',
                message: '지정되지 않은 오류가 발생했습니다.' +
                    '\n빠른 시일 내에 수정 될 예정입니다.' +
                    '\n이용해 주셔서 감사합니다.'
            });
    }
}