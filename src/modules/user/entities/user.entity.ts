import { Field, ID, ObjectType } from '@nestjs/graphql';

/**
 * User entity representing users in the system
 * Includes authentication and profile information
 * Generated from Prisma schema
 */
@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  username: string;

  // Password is not exposed in GraphQL for security
  password: string;

  @Field(() => String)
  nickname: string;

  @Field(() => String)
  role: string;

  // Refresh token is not exposed in GraphQL for security
  refreshToken?: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}