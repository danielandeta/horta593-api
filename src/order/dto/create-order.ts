import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';
import { CreateOrderDetailDto } from '../../order_detail/dto/create_order_detail';
import { Product } from '@prisma/client';

export class CreateOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ type: () => [CreateOrderDetailDto] })
  @IsOptional()
  @IsNotEmpty()
  @Type(() => CreateOrderDetailDto)
  @ValidateNested({ each: true })
  orderDetails: CreateOrderDetailDto[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  special_note: string;
}
