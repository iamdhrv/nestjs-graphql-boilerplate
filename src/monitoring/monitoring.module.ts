import { Module } from '@nestjs/common';

import { MonitoringService } from './monitoring.service';
import { MetricsController } from './metrics.controller';

/**
 * Monitoring module providing custom metrics and health checks
 * Provides application monitoring without external dependencies
 */
@Module({
  providers: [MonitoringService],
  controllers: [MetricsController],
  exports: [MonitoringService],
})
export class MonitoringModule {}