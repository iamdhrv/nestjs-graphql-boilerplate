import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { setTypeormConfig } from './ormconfig';

/**
 * TypeORM configuration service that implements TypeOrmOptionsFactory
 * Provides database configuration with proper error handling and logging
 */
@Injectable()
export class TypeORMConfigService implements TypeOrmOptionsFactory {
  private readonly logger = new Logger(TypeORMConfigService.name);

  constructor(private readonly configService: ConfigService) {}

  /**
   * Creates TypeORM options for the application
   * @returns TypeORM module options or promise of options
   */
  createTypeOrmOptions(): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    try {
      const config = setTypeormConfig(this.configService);

      // Log configuration (without sensitive data) for debugging
      this.logger.log(`Database configuration loaded for ${config.database}`);

      return config;
    } catch (error) {
      this.logger.error('Failed to create TypeORM configuration:', error);
      throw error;
    }
  }
}