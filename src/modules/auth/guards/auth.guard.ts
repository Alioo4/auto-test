import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { Role } from '@prisma/client';
import { ROLES_KEY } from './roles.decorator';
import { IS_PUBLIC_KEY } from './is-public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (token) {
      try {
        const payload = await this.authService.verifyToken(token);
        (request as any).user = payload;
        
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
          ROLES_KEY,
          [context.getHandler(), context.getClass()],
        );

        if (requiredRoles?.length && !requiredRoles.includes(payload.role)) {
          throw new ForbiddenException({
            message: 'You do not have the required role',
            code: 11,
          });
        }

        return true;
      } catch (err) {
        if (!isPublic) {
          throw new UnauthorizedException({
            message: 'Invalid or expired token',
            code: 10,
          });
        }
        return true;
      }
    }

    if (isPublic) return true;

    throw new UnauthorizedException({
      message: 'Token is required',
      code: 10,
    });
  }
}

