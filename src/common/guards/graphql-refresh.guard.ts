import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

/**
 * GraphQL refresh guard that extends Passport JWT refresh strategy
 * Handles authentication for refresh token operations
 */
@Injectable()
export class RefreshGuard extends AuthGuard('jwt-refresh') {
  constructor() {
    super();
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
}