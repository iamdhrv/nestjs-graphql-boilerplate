import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy } from 'passport-local';

import { AuthService } from '../auth.service';
import { SignInInput } from '../inputs/auth.input';

/**
 * Local authentication strategy for Passport
 * Handles username/password authentication
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  /**
   * Validates user credentials using username and password
   * @param username - User's username
   * @param password - User's password
   * @returns Promise<SignInInput> - Validated user data
   * @throws UnauthorizedException if credentials are invalid
   */
  validate(username: string, password: string): Promise<SignInInput> {
    const user = this.authService.validateUser({ username, password });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}