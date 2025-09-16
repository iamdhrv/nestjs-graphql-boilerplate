import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { v4 } from 'uuid';

import { EnvironmentVariables } from 'src/common/helper/env.validation';

/**
 * Utility service providing common helper methods
 * Includes configuration access, random number generation, object manipulation, etc.
 */
@Injectable()
export class UtilService {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}

  /**
   * Gets a configuration value as a number
   * @param key - Environment variable key
   * @returns Number value
   * @throws Error if value is not a valid number
   */
  getNumber(key: keyof EnvironmentVariables): number {
    const value = this.configService.get<string>(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + ' environment variable is not a number');
    }
  }

  /**
   * Gets a configuration value as a string with newline processing
   * @param key - Environment variable key
   * @returns String value with processed newlines
   */
  getString(key: keyof EnvironmentVariables): string {
    const value = this.configService.get<string>(key);

    return value.replace(/\\n/g, '\n');
  }

  /**
   * Generates a random number between min and max (inclusive)
   * @param min - Minimum value
   * @param max - Maximum value
   * @returns Random number
   */
  getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Picks specific properties from an object
   * @param instance - Source object
   * @param keys - Keys to pick
   * @returns New object with only the specified keys
   */
  pick<T extends object, K extends keyof T>(instance: T, keys: K[]) {
    return keys.reduce(
      (picked, key) => {
        if (key in instance) {
          picked[key] = instance[key];
        }

        return picked;
      },
      {} as Pick<T, K>,
    );
  }

  /**
   * Generates a random UUID
   * @returns UUID string
   */
  get getRandomUUID() {
    return v4();
  }

  /**
   * Gets the current NODE_ENV
   * @returns Environment string
   */
  get nodeEnv() {
    return this.getString('NODE_ENV') as 'development' | 'production' | 'test';
  }

  /**
   * Checks if running in development mode
   * @returns Boolean indicating development mode
   */
  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  /**
   * Checks if running in production mode
   * @returns Boolean indicating production mode
   */
  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }
}