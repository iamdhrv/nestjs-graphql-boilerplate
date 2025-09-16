import { Controller, Get } from '@nestjs/common';

import { MonitoringService } from './monitoring.service';

/**
 * Metrics controller providing health check and metrics endpoints
 * Exposes application health status and custom metrics
 */
@Controller('health')
export class MetricsController {
  constructor(private readonly monitoringService: MonitoringService) {}

  /**
   * Health check endpoint
   * @returns Health status information
   */
  @Get()
  getHealth() {
    return this.monitoringService.getHealthStatus();
  }

  /**
   * Detailed health check with system metrics
   * @returns Detailed health and system information
   */
  @Get('detailed')
  getDetailedHealth() {
    const health = this.monitoringService.getHealthStatus();
    const system = this.monitoringService.getSystemMetrics();
    const customMetrics = Object.fromEntries(this.monitoringService.getMetrics());

    return {
      ...health,
      system,
      customMetrics,
    };
  }

  /**
   * System metrics endpoint
   * @returns System performance metrics
   */
  @Get('metrics')
  getMetrics() {
    return {
      system: this.monitoringService.getSystemMetrics(),
      custom: Object.fromEntries(this.monitoringService.getMetrics()),
    };
  }
}