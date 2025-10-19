import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // override to not throw if no token
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || info) {
      // no token, invalid token, or expired → just return null
      return null;
    }
    return user; // valid token → attach user
  }
}
