import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';

/**
 * CreateENTITY_CLASS_NAMEInput
 * 
 * Input type for creating a new ENTITY_NAME
 * Includes validation rules and GraphQL field definitions
 */
@InputType()
export class CreateENTITY_CLASS_NAMEInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;
}