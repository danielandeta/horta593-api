import { ApiProperty } from '@nestjs/swagger';
import { DecimalDatasetParameter } from 'aws-sdk/clients/quicksight';
import { 
    IsString, 
    IsNumber, 
    IsNotEmpty, 
    IsOptional } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsString()
  image: string;

  @ApiProperty()
  @IsString()
  categoryId: string;

  @IsString()
  @IsOptional()
  status?: string;

  createdAt: Date;

  updatedAt: Date;
}