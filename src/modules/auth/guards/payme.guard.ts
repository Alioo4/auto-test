import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as base64 from 'base-64';

@Injectable()
export class PaymeAuthGuard implements CanActivate {
  private readonly PAYME_MERCHANT_KEY = process.env.PAYME_MERCHANT_KEY || '';

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;
    const token = authHeader?.split(' ')[1];
    const id = request.body?.id ?? null;

    if (!token) {
      throw new UnauthorizedException({
        code: -32504,
        message: 'Authorization required',
        data: { id },
      });
    }

    const decoded = base64.decode(token);

    if (!decoded.includes(this.PAYME_MERCHANT_KEY)) {
      throw new UnauthorizedException({
        code: -32504,
        message: 'Invalid authorization',
        data: { id },
      });
    }

    return true;
  }
}
