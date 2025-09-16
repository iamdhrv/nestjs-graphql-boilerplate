import { Module } from '@nestjs/common';
import { DatabaseModule } from '../common/database/database.module';
import { RESOLVER_CLASS_NAME } from './RESOLVER_FILE_NAME';
import { SERVICE_CLASS_NAME } from './SERVICE_FILE_NAME';

/**
 * MODULE_CLASS_NAME module
 * Provides ENTITY_CLASS_NAME functionality including GraphQL resolvers and business services
 */
@Module({
  imports: [DatabaseModule],
  providers: [RESOLVER_CLASS_NAME, SERVICE_CLASS_NAME],
  exports: [SERVICE_CLASS_NAME],
})
export class MODULE_CLASS_NAME {}