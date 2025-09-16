import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';

import { EnvironmentVariables } from 'src/common/helper/env.validation';
import { UserService } from 'src/modules/user/user.service';

/**
 * JWT authentication strategy for Passport
 * Validates JWT tokens and retrieves user information
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  /**
   * Validates JWT payload and returns user data
   * @param payload - JWT payload containing user ID
   * @param done - Passport callback function
   */
  async validate(payload: { id: string }, done: VerifiedCallback) {
    try {
      const userData = await this.userService.getOne({
        where: { id: payload.id },
        select: { id: true, role: true },
      });

      done(null, userData);
    } catch (err) {
      throw new UnauthorizedException('Error', err.message);
    }
  }
}