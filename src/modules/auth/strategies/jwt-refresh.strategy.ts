import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';

import { EnvironmentVariables } from 'src/common/helper/env.validation';

import { AuthService } from '../auth.service';

/**
 * JWT refresh token strategy for Passport
 * Handles refresh token validation and user verification
 */
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  /**
   * Validates refresh token payload and verifies token with user
   * @param payload - JWT payload containing user ID and refresh token
   * @param done - Passport callback function
   */
  async validate(
    payload: { id: string; refreshToken: string },
    done: VerifiedCallback,
  ) {
    try {
      const userData = await this.authService.verifyRefreshToken(
        payload.id,
        payload.refreshToken,
      );

      done(null, userData);
    } catch (err) {
      throw new UnauthorizedException('Error', err.message);
    }
  }
}