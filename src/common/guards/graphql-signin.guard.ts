import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

/**
 * GraphQL sign-in guard that extends Passport local strategy
 * Handles authentication for sign-in mutations
 */
@Injectable()
export class SignInGuard extends AuthGuard('local') {
  constructor() {
    super();
  }

  /**
   * Extracts request from GraphQL execution context and sets body for local strategy
   * @param context - Execution context
   * @returns Request object with body set to GraphQL input
   */
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    request.body = ctx.getArgs().input;
    return request;
  }
}