import { Module } from '@nestjs/common';

import { UtilService } from './util.service';

/**
 * Utility module that provides common helper services
 * Exports UtilService for use across the application
 */
@Module({
  providers: [UtilService],
  exports: [UtilService],
})
export class UtilModule {}