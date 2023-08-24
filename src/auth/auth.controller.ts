import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/new-user';
import { SignInDto } from './dto/signin.dto';
import { AuthService } from './auth.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { Response as ExpressResponse } from 'express';
import { AccessTokenGuard } from './guard/accessToken.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @ApiParam({ name: 'dto', type: CreateUserDto })
  @Post('signup')
  signup(@Body() dto: CreateUserDto,
        @Res({ passthrough: true }) response: ExpressResponse
) {
    return this.authService.signup(dto,response);
  }
    
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Body() dto: SignInDto,
        @Res({ passthrough: true }) response: ExpressResponse
    ) {
        return await this.authService.signin(dto, response);
    };
    
    @UseGuards(AccessTokenGuard)
    @Post("signout")
    @HttpCode(HttpStatus.OK)
    async signout(
        @Req() request,
        @Res({ passthrough: true }) response: ExpressResponse
    ) {
        return this.authService.signout(request, response);
    }

    @Get("refresh")
    async refreshTokens(@Req() req) {
        return await this.authService.refresh(req);
    }
    
    
}
