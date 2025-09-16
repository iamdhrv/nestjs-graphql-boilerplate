import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { IsUUID, IsOptional } from 'class-validator';
// Template placeholder - will be replaced during code generation
// import { CreateENTITY_CLASS_NAMEInput } from './create-ENTITY_FILE_NAME.input';

/**
 * UpdateENTITY_CLASS_NAMEInput DTO
 * 
 * Input type for updating ENTITY_NAME records.
 * Extends the create input with an ID field for identification.
 * All fields except ID are optional for partial updates.
 */
@InputType()
export class UpdateENTITY_CLASS_NAMEInput {
  /**
   * The unique identifier of the ENTITY_NAME to update
   */
  @Field(() => ID, { description: 'The unique identifier of the ENTITY_NAME to update' })
  @IsUUID('4', { message: 'ID must be a valid UUID' })
  id: string;

  // Additional fields would be added here during code generation
  // extending from CreateENTITY_CLASS_NAMEInput with @IsOptional() decorators
}