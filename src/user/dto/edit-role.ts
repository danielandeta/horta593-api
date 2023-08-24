import { IsIn, IsString } from 'class-validator';
import { Role } from '../../auth/enums';
import { ApiProperty } from '@nestjs/swagger';

export class EditRoleDto {
  @ApiProperty()
  @IsString()
  @IsIn([Role.ADMIN, Role.EMPLOYEE, Role.USER])
  role: string;
}
