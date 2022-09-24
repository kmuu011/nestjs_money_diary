import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Scope,
} from '@nestjs/common';
import { catchError, finalize, Observable, throwError } from 'rxjs';
import { SentryService } from './sentry.service';

/**
 * We must be in Request scope as we inject SentryService
 */
@Injectable({ scope: Scope.REQUEST })
export class SentryInterceptor implements NestInterceptor {
  constructor(private sentryService: SentryService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // start a child span for performance tracing
    const span = this.sentryService.startChild({ op: `route handler`, description: "Test" });

    return next.handle().pipe(
      catchError((error) => {
        // throw again the error
        return throwError(() => error);
      }),
      finalize(() => {
        span.finish();
        this.sentryService.span.finish();
      }),
    );
  }
}
