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
    try {
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (isPublic) return true;

      const request = context.switchToHttp().getRequest<Request>();
      const authHeader = request.headers.authorization;

      if (!authHeader?.startsWith('Bearer ')) {
        throw new UnauthorizedException('Missing or invalid token');
      }

      const token = authHeader.split(' ')[1];
      const { sub, role } = await this.authService.verifyToken(token);

      (request as any).user = { sub, role };

      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (requiredRoles?.length && !requiredRoles.includes(role)) {
        throw new ForbiddenException('You do not have the required role');
      }
      return true;
    } catch (error) {
      throw new ForbiddenException("You don't have permission to access this resource", error.message);
    }
  }
}
