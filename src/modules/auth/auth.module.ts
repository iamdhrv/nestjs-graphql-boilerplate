import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { EnvironmentVariables } from 'src/common/helper/env.validation';
import { UtilModule } from 'src/common/util/util.module';
import { UserModule } from 'src/modules/user/user.module';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

/**
 * Authentication module providing JWT-based authentication
 * Configures Passport strategies, JWT module, and authentication services
 */
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          algorithm: 'HS256',
          expiresIn: '1d',
        },
        verifyOptions: {
          algorithms: ['HS256'],
        },
      }),
    }),
    ConfigModule,
    UserModule,
    UtilModule,
  ],
  providers: [
    AuthResolver,
    AuthService,
    JwtStrategy,
    LocalStrategy,
    JwtRefreshStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}