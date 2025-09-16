import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of, tap } from 'rxjs';

import { CacheService } from '../cache.service';
import { CACHE_KEY_METADATA, CACHE_TTL_METADATA } from '../decorators/cache.decorator';

/**
 * Cache interceptor that handles caching logic for methods decorated with @Cacheable
 * Automatically caches method results and returns cached values on subsequent calls
 */
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    private readonly cacheService: CacheService,
    private readonly reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const cacheKey = this.reflector.get<string | Function>(
      CACHE_KEY_METADATA,
      context.getHandler(),
    );

    if (!cacheKey) {
      return next.handle();
    }

    const cacheTtl = this.reflector.get<number>(
      CACHE_TTL_METADATA,
      context.getHandler(),
    );

    // Generate cache key
    const key = this.generateCacheKey(cacheKey, context);

    // Try to get from cache
    const cachedValue = await this.cacheService.get(key);
    if (cachedValue !== undefined) {
      return of(cachedValue);
    }

    // Execute method and cache result
    return next.handle().pipe(
      tap(async (result) => {
        if (result !== undefined && result !== null) {
          await this.cacheService.set(key, result, cacheTtl);
        }
      }),
    );
  }

  /**
   * Generate cache key from decorator metadata and execution context
   * @param cacheKey - Cache key or key generator function
   * @param context - Execution context
   * @returns string - Generated cache key
   */
  private generateCacheKey(
    cacheKey: string | Function,
    context: ExecutionContext,
  ): string {
    if (typeof cacheKey === 'string') {
      return cacheKey;
    }

    if (typeof cacheKey === 'function') {
      const args = context.getArgs();
      return cacheKey(...args);
    }

    // Fallback: use class and method name
    const className = context.getClass().name;
    const methodName = context.getHandler().name;
    return `${className}:${methodName}`;
  }
}