import { Field, InputType } from '@nestjs/graphql';

import { IsNotEmpty } from 'class-validator';

/**
 * Input type for user sign-in
 * Contains username and password fields with validation
 */
@InputType()
export class SignInInput {
  @Field(() => String)
  @IsNotEmpty()
  username: string;

  @Field(() => String)
  @IsNotEmpty()
  password: string;
}

/**
 * Input type for user sign-up
 * Extends SignInInput with additional nickname field
 */
@InputType()
export class SignUpInput extends SignInInput {
  @Field(() => String)
  @IsNotEmpty()
  nickname: string;
}