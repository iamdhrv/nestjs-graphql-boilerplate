import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import { join } from 'path';

import { AppCacheModule } from './cache';
import { EnvironmentVariables, envValidation } from './common/helper/env.validation';
import { UtilModule } from './common/util/util.module';
import { MonitoringModule } from './monitoring';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

/**
 * Main application module that configures all core modules and services
 * Sets up GraphQL, TypeORM, configuration, and authentication
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: envValidation,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
        // Add connection retry options
        retryAttempts: 3,
        retryDelay: 3000,
        // Make connection optional for development
        autoLoadEntities: true,
      }),
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => ({
        autoSchemaFile: true,
        sortSchema: true,
        playground: configService.get('NODE_ENV') === 'development',
        introspection: configService.get('NODE_ENV') === 'development',
        context: ({ req, res }) => ({ req, res }),
        formatError: (error) => {
          console.error('GraphQL Error:', error);
          return {
            message: error.message,
            code: error.extensions?.code,
            path: error.path,
          };
        },
      }),
    }),
    AppCacheModule,
    MonitoringModule,
    UtilModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}