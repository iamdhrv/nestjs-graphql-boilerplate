import { Field, ObjectType } from '@nestjs/graphql';

import { User } from 'src/modules/user/entities/user.entity';

/**
 * JWT with User response type for authentication mutations
 * Contains JWT token and user information
 */
@ObjectType()
export class JwtWithUser {
  @Field(() => String)
  jwt: string;

  @Field(() => User)
  user: User;
}