import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { CurrentUser } from 'src/common/decorators/user.decorator';
import { RefreshGuard } from 'src/common/guards/graphql-refresh.guard';
import { SignInGuard } from 'src/common/guards/graphql-signin.guard';
import { User } from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/user.service';

import { AuthService } from './auth.service';
import { JwtWithUser } from './entities/auth.entity';
import { SignInInput, SignUpInput } from './inputs/auth.input';

/**
 * Authentication resolver providing GraphQL mutations for user authentication
 * Handles sign-in, sign-up, sign-out, and token refresh operations
 */
@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  /**
   * Signs in a user with username and password
   * @param _ - Sign-in input (handled by guard)
   * @param user - Current user from guard
   * @returns JwtWithUser - JWT token and user data
   */
  @Mutation(() => JwtWithUser)
  @UseGuards(SignInGuard)
  signIn(@Args('input') _: SignInInput, @CurrentUser() user: User) {
    return this.authService.signIn(user);
  }

  /**
   * Registers a new user
   * @param input - Sign-up input data
   * @returns JwtWithUser - JWT token and user data
   */
  @Mutation(() => JwtWithUser)
  signUp(@Args('input') input: SignUpInput) {
    return this.authService.signUp(input);
  }

  /**
   * Signs out a user by clearing their refresh token
   * @param user - Current user from guard
   * @returns Boolean - Success status
   */
  @Mutation(() => Boolean)
  @UseGuards(RefreshGuard)
  async signOut(@CurrentUser() user: User) {
    await this.userService.update(user.id, { refreshToken: null });
    return true;
  }

  /**
   * Refreshes access token using refresh token
   * @param user - Current user from guard
   * @returns JwtWithUser - New JWT token and user data
   */
  @Mutation(() => JwtWithUser)
  @UseGuards(RefreshGuard)
  refreshAccessToken(@CurrentUser() user: User) {
    const jwt = this.authService.generateAccessToken(user, user.refreshToken);

    return { jwt, user };
  }
}