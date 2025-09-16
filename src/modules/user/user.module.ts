import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../common/database/database.module';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

/**
 * User module providing user-related functionality
 * Includes GraphQL resolvers and business services using Prisma
 */
@Module({
  imports: [DatabaseModule],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}