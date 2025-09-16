import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { EnvironmentVariables } from 'src/common/helper/env.validation';

import { CacheService } from './cache.service';

/**
 * Cache module providing memory-based caching functionality
 * Uses in-memory cache store for development (can be extended to Redis)
 */
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<EnvironmentVariables>) => {
        return {
          ttl: 60 * 60 * 1000, // 1 hour
          max: 1000, // Maximum number of items in cache
        };
      },
    }),
  ],
  providers: [CacheService],
  exports: [CacheService, CacheModule],
})
export class AppCacheModule {}