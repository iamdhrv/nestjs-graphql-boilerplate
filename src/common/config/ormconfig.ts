import { ConfigService } from '@nestjs/config';

import { DataSource, DataSourceOptions } from 'typeorm';

import { config } from 'dotenv';
import { join } from 'path';
import { cwd, env } from 'process';

import { getEnvPath } from '../helper/env.helper';

config({
  path: getEnvPath(cwd()),
});

/**
 * Creates TypeORM configuration based on environment variables
 * @param conf - Configuration service or process environment
 * @returns TypeORM DataSource options
 */
export const setTypeormConfig = (
  conf: NodeJS.ProcessEnv | ConfigService,
): DataSourceOptions => {
  const getConfigValue =
    conf instanceof ConfigService
      ? conf.get.bind(conf)
      : (key: string) => conf[key];

  const isProduction = getConfigValue('NODE_ENV') === 'production';
  const isDevelopment = getConfigValue('NODE_ENV') === 'development';
  const isTest = getConfigValue('NODE_ENV') === 'test';

  return {
    type: 'postgres',
    host: getConfigValue('DB_HOST'),
    port: Number(getConfigValue('DB_PORT')) || 5432,
    username: getConfigValue('DB_USER'),
    password: getConfigValue('DB_PASSWORD'),
    database: getConfigValue('DB_NAME'),
    entities: isDevelopment
      ? [join(__dirname, '../../modules/**/*.entity.{ts,js}')]
      : [join(__dirname, '../../**/*.entity.js')],
    synchronize: !isProduction,
    dropSchema: isTest,
    migrations: [join(__dirname, '../database/migrations/*{.ts,.js}')],
    migrationsRun: false,
    logging: isDevelopment ? true : false,
    // Add these for better error handling
    extra: {
      charset: 'utf8mb4_unicode_ci',
    },
    connectTimeoutMS: 60000,
  };
};

export default new DataSource(setTypeormConfig(env));
