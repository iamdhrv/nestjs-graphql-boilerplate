import { resolve } from 'path';

/**
 * Gets the appropriate environment file path based on NODE_ENV
 * @param dest - Destination directory path
 * @returns Full path to the environment file
 */
export function getEnvPath(dest: string): string {
  const env: string | undefined = process.env.NODE_ENV;
  const filename: string = env ? `.${env}.env` : '.development.env';
  return resolve(`${dest}/${filename}`);
}
