import { applyDecorators, UseGuards } from '@nestjs/common';
import { RoleProtected } from './role-protected.decorator';
import { UserRoleGuard } from '../guard/roles.guard';
import { Role } from '../enums';

export function Auth(...roles: Role[]) {
  return applyDecorators(RoleProtected(...roles), UseGuards(UserRoleGuard));
}
