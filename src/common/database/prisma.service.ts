import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Prisma service for database operations
 * Handles connection lifecycle and provides database client
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  /**
   * Initialize database connection when module starts
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Close database connection when module is destroyed
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }

  /**
   * Clean all data from database (for testing purposes only)
   * Only works in non-production environments
   */
  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') return;
    
    const models = Reflect.ownKeys(this)
      .filter((key): key is string => typeof key === 'string' && key[0] !== '_')
      .filter(key => typeof this[key as keyof this] === 'object' && this[key as keyof this] !== null);
    
    return Promise.all(
      models.map((modelKey) => (this[modelKey as keyof this] as any).deleteMany())
    );
  }
}