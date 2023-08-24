import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { ValidNationalID } from '../../lib/utils/validation-rules/nationalIDValidator';

export class CreatePaymentDto {
  @ApiProperty()
  @IsString()
  orderId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  transferImage?: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  @ValidNationalID({ message: 'Invalid national ID' })
  nationalId: string;
}
