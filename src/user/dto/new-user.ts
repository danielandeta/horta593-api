import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength,  } from "class-validator"

export class CreateUserDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(255)
    firstName: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(255)
    lastName: string
 
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(100)
    email: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string
}