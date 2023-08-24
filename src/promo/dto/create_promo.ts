import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreatePromoDto {
  @ApiProperty()
  @IsString()
  @IsOptional() 
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  active: boolean;
}
