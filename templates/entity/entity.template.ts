import { ObjectType, Field, ID } from '@nestjs/graphql';

/**
 * ENTITY_CLASS_NAME GraphQL entity
 * Represents ENTITY_DESCRIPTION in the system
 * Generated from Prisma schema
 */
@ObjectType()
export class ENTITY_CLASS_NAME {
  /**
   * Unique identifier for the ENTITY_CLASS_NAME
   */
  @Field(() => ID)
  id: string;

  /**
   * Name of the ENTITY_CLASS_NAME
   */
  @Field()
  name: string;

  /**
   * Description of the ENTITY_CLASS_NAME
   */
  @Field({ nullable: true })
  description?: string;

  /**
   * Creation timestamp
   */
  @Field()
  createdAt: Date;

  /**
   * Last update timestamp
   */
  @Field()
  updatedAt: Date;
}