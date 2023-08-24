import { ApiProperty } from '@nestjs/swagger';
import { 
    IsString, 
    IsNumber, 
    IsNotEmpty, 
    IsOptional } from 'class-validator';
    
export class CreateScoreDto {
    @ApiProperty()
    @IsNotEmpty()
    userId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    points: number;

}
