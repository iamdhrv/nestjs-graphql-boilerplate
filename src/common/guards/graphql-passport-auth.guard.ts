import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

import { GUARD_ROLE } from '../decorators/auth-guard.decorator';

/**
 * GraphQL authentication guard that extends Passport JWT strategy
 * Provides role-based access control for GraphQL resolvers
 */
@Injectable()
export class GraphqlPassportAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Determines if the current user can activate the route
   * @param context - Execution context
   * @returns Promise<boolean> - Whether access is granted
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      GUARD_ROLE,
      context.getHandler(),
    );
    await super.canActivate(context);
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    const { role } = req.user;

    if (role === 'admin') {
      return true;
    }

    return this.hasAccess(role, requiredRoles);
  }

  /**
   * Extracts request from GraphQL execution context
   * @param context - Execution context
   * @returns Request object
   */
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    return req;
  }

  /**
   * Checks if user role has access to required roles
   * @param role - User's role
   * @param requiredRoles - Required roles for access
   * @returns boolean - Whether user has access
   */
  private hasAccess(role: string, requiredRoles: string[]): boolean {
    return requiredRoles.some((v: string) => v === role);
  }
}