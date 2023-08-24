import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { META_ROLES } from '../decorator/role-protected.decorator';
import { User } from '@prisma/client';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles = this.reflector.getAllAndOverride<string[]>(META_ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!validRoles) return true;
    if (validRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if (!user) throw new BadRequestException('User not found');

    if (validRoles.includes(user.role)) {
      return true;
    }

    throw new ForbiddenException(
      `User ${user.email} need a valid role: [${validRoles}] and user has [${user.role}] role`,
    );
  }
}
