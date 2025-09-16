import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';

import { GraphqlPassportAuthGuard } from '../guards/graphql-passport-auth.guard';

export const GUARD_ROLE = Symbol('GUARD_ROLE');

/**
 * Authentication guard decorator that applies role-based access control
 * @param roles - Required roles for access (string or array of strings)
 * @returns Decorator that applies metadata and guard
 */
export const UseAuthGuard = (roles?: string | string[]) =>
  applyDecorators(
    SetMetadata(
      GUARD_ROLE,
      roles ? (Array.isArray(roles) ? roles : [roles]) : ['user'],
    ),
    UseGuards(GraphqlPassportAuthGuard),
  );