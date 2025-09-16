import { SetMetadata } from '@nestjs/common';

export const CACHE_KEY_METADATA = 'cache:key';
export const CACHE_TTL_METADATA = 'cache:ttl';

/**
 * Cache decorator for method-level caching
 * @param key - Cache key or key generator function
 * @param ttl - Time to live in milliseconds (optional)
 * @returns MethodDecorator
 */
export function Cacheable(
  key: string | ((...args: any[]) => string),
  ttl?: number,
): MethodDecorator {
  return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    SetMetadata(CACHE_KEY_METADATA, key)(target, propertyKey, descriptor);
    if (ttl) {
      SetMetadata(CACHE_TTL_METADATA, ttl)(target, propertyKey, descriptor);
    }
    return descriptor;
  };
}

/**
 * Cache evict decorator for invalidating cache entries
 * @param key - Cache key or key generator function to evict
 * @returns MethodDecorator
 */
export function CacheEvict(
  key: string | ((...args: any[]) => string),
): MethodDecorator {
  return SetMetadata('cache:evict', key);
}

/**
 * Cache put decorator for updating cache entries
 * @param key - Cache key or key generator function
 * @param ttl - Time to live in milliseconds (optional)
 * @returns MethodDecorator
 */
export function CachePut(
  key: string | ((...args: any[]) => string),
  ttl?: number,
): MethodDecorator {
  return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    SetMetadata('cache:put', key)(target, propertyKey, descriptor);
    if (ttl) {
      SetMetadata(CACHE_TTL_METADATA, ttl)(target, propertyKey, descriptor);
    }
    return descriptor;
  };
}