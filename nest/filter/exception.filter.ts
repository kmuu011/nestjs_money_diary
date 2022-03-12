import {ExceptionFilter, Catch, ArgumentsHost, HttpException} from '@nestjs/common';
import {Request, Response} from 'express';

@Catch(HttpException)
export class ControllableExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const req = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const message = exception.getResponse();
        console.log('HttpExceptionFilter log');

        console.log(message);

        console.log(exception);

        res
            .status(status)
            .json({
                statusCode: status,
                message
            });
    }
}

@Catch()
export class OutOfControlExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const req = ctx.getRequest<Request>();
        const err = exception;

        const stack = err?.stack.toString();

        console.log(stack)

        console.log('EveryExceptionFilter log');
        // console.log(err);

        res
            .status(500)
            .json({
                statusCode: 'SERVER_ERROR',
                message: stack
            });
    }
}