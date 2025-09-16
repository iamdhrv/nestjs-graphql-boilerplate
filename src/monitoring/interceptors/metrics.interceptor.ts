import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap, catchError, throwError } from 'rxjs';

import { MonitoringService } from '../monitoring.service';

/**
 * Metrics interceptor that automatically tracks request metrics
 * Records request duration, success/error rates, and endpoint usage
 */
@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly monitoringService: MonitoringService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const request = context.switchToHttp().getRequest();
    const method = request?.method || 'UNKNOWN';
    const url = request?.url || 'UNKNOWN';
    const endpoint = `${method} ${url}`;

    // Increment request counter
    this.monitoringService.incrementCounter('http_requests_total', {
      method,
      endpoint: url,
    });

    return next.handle().pipe(
      tap(() => {
        // Record successful request
        const duration = Date.now() - startTime;
        this.monitoringService.recordTiming('http_request_duration', duration, {
          method,
          endpoint: url,
          status: 'success',
        });

        this.monitoringService.incrementCounter('http_requests_success_total', {
          method,
          endpoint: url,
        });
      }),
      catchError((error) => {
        // Record failed request
        const duration = Date.now() - startTime;
        this.monitoringService.recordTiming('http_request_duration', duration, {
          method,
          endpoint: url,
          status: 'error',
        });

        this.monitoringService.incrementCounter('http_requests_error_total', {
          method,
          endpoint: url,
          error: error.constructor.name,
        });

        return throwError(() => error);
      }),
    );
  }
}