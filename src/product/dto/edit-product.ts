import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class EditProductDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  price?: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  image?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  status?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  categoryId?: string;

  //updatedAt: Date;
}
