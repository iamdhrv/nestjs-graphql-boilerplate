import { Injectable, Logger } from '@nestjs/common';

/**
 * Monitoring service providing application metrics and health checks
 * Tracks performance metrics, error rates, and system health
 */
@Injectable()
export class MonitoringService {
  private readonly logger = new Logger(MonitoringService.name);
  private readonly metrics = new Map<string, number>();
  private readonly startTime = Date.now();

  /**
   * Record a custom metric
   * @param name - Metric name
   * @param value - Metric value
   * @param labels - Optional labels for the metric
   */
  recordMetric(name: string, value: number, labels?: Record<string, string>): void {
    const key = labels ? `${name}_${JSON.stringify(labels)}` : name;
    this.metrics.set(key, value);
    this.logger.debug(`Metric recorded: ${key} = ${value}`);
  }

  /**
   * Increment a counter metric
   * @param name - Counter name
   * @param labels - Optional labels for the counter
   */
  incrementCounter(name: string, labels?: Record<string, string>): void {
    const key = labels ? `${name}_${JSON.stringify(labels)}` : name;
    const current = this.metrics.get(key) || 0;
    this.metrics.set(key, current + 1);
    this.logger.debug(`Counter incremented: ${key} = ${current + 1}`);
  }

  /**
   * Record timing metric
   * @param name - Timer name
   * @param duration - Duration in milliseconds
   * @param labels - Optional labels for the timer
   */
  recordTiming(name: string, duration: number, labels?: Record<string, string>): void {
    const key = labels ? `${name}_duration_${JSON.stringify(labels)}` : `${name}_duration`;
    this.metrics.set(key, duration);
    this.logger.debug(`Timing recorded: ${key} = ${duration}ms`);
  }

  /**
   * Get all recorded metrics
   * @returns Map<string, number> - All metrics
   */
  getMetrics(): Map<string, number> {
    return new Map(this.metrics);
  }

  /**
   * Get application health status
   * @returns Object containing health information
   */
  getHealthStatus(): {
    status: string;
    uptime: number;
    timestamp: number;
    memory: NodeJS.MemoryUsage;
    pid: number;
  } {
    const uptime = Date.now() - this.startTime;
    
    return {
      status: 'healthy',
      uptime,
      timestamp: Date.now(),
      memory: process.memoryUsage(),
      pid: process.pid,
    };
  }

  /**
   * Get system metrics
   * @returns Object containing system metrics
   */
  getSystemMetrics(): {
    memory: NodeJS.MemoryUsage;
    uptime: number;
    cpuUsage: NodeJS.CpuUsage;
    version: string;
  } {
    return {
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      cpuUsage: process.cpuUsage(),
      version: process.version,
    };
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics.clear();
    this.logger.debug('All metrics cleared');
  }
}