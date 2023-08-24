import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateOrderDetailDto {
  @ApiProperty()
  @IsNotEmpty()
  productId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  special_note: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  discount: number;
}
