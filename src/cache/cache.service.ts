import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';

import { Cache } from 'cache-manager';

/**
 * Cache service providing utility methods for caching operations
 * Wraps cache-manager with additional functionality and error handling
 */
@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * Get value from cache
   * @param key - Cache key
   * @returns Promise<T | undefined> - Cached value or undefined
   */
  async get<T>(key: string): Promise<T | undefined> {
    try {
      const value = await this.cacheManager.get<T>(key);
      this.logger.debug(`Cache GET: ${key} - ${value ? 'HIT' : 'MISS'}`);
      return value;
    } catch (error) {
      this.logger.error(`Cache GET error for key ${key}:`, error);
      return undefined;
    }
  }

  /**
   * Set value in cache
   * @param key - Cache key
   * @param value - Value to cache
   * @param ttl - Time to live in milliseconds (optional)
   * @returns Promise<void>
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttl);
      this.logger.debug(`Cache SET: ${key} - TTL: ${ttl || 'default'}`);
    } catch (error) {
      this.logger.error(`Cache SET error for key ${key}:`, error);
    }
  }

  /**
   * Delete value from cache
   * @param key - Cache key
   * @returns Promise<void>
   */
  async del(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
      this.logger.debug(`Cache DEL: ${key}`);
    } catch (error) {
      this.logger.error(`Cache DEL error for key ${key}:`, error);
    }
  }

  /**
   * Clear all cache
   * @returns Promise<void>
   */
  async reset(): Promise<void> {
    try {
      // Note: reset() method may not be available in all cache stores
      if ('reset' in this.cacheManager && typeof this.cacheManager.reset === 'function') {
        await (this.cacheManager as any).reset();
        this.logger.debug('Cache RESET: All keys cleared');
      } else {
        this.logger.warn('Cache RESET: Method not available for this store');
      }
    } catch (error) {
      this.logger.error('Cache RESET error:', error);
    }
  }

  /**
   * Get or set pattern - retrieve from cache or execute function and cache result
   * @param key - Cache key
   * @param fn - Function to execute if cache miss
   * @param ttl - Time to live in milliseconds (optional)
   * @returns Promise<T> - Cached or computed value
   */
  async getOrSet<T>(
    key: string,
    fn: () => Promise<T>,
    ttl?: number,
  ): Promise<T> {
    try {
      let value = await this.get<T>(key);
      
      if (value === undefined) {
        this.logger.debug(`Cache MISS: ${key} - Computing value`);
        value = await fn();
        await this.set(key, value, ttl);
      }
      
      return value;
    } catch (error) {
      this.logger.error(`Cache getOrSet error for key ${key}:`, error);
      // Fallback to executing function without caching
      return await fn();
    }
  }

  /**
   * Generate cache key with prefix
   * @param prefix - Key prefix
   * @param ...parts - Key parts to join
   * @returns string - Generated cache key
   */
  generateKey(prefix: string, ...parts: (string | number)[]): string {
    return `${prefix}:${parts.join(':')}`;
  }
}