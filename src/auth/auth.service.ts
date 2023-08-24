import {
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/new-user';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { SignInDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaErrorCode } from '../prisma/prisma-error';
import { UserService } from '../user/user.service';
import { refreshExpireDate } from './utils/refreshExpireDate';
import { Response, response } from 'express';
import { Role } from './enums';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private configureService: ConfigService,
    private userService: UserService,
    private redisService: RedisService,
  ) {}

  @HttpCode(HttpStatus.ACCEPTED)
  async signup(dto: CreateUserDto, response: Response) {
    const hash = await argon.hash(dto.password);

    try {
      const user = await this.userService.create(dto);

      const tokens = await this.getTokens(user.id, user.email, user.role);

      await this.userService.addRefreshToken(user.id, tokens.refreshToken);

      response.cookie('refresh', tokens.refreshToken, {
        httpOnly: true,
        signed: true,
        secure: this.configureService.get('NODE_ENV') === 'production',
        expires: refreshExpireDate(),
      });

      return { accessToken: tokens.accessToken };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === PrismaErrorCode.UniqueConstraintViolation
      ) {
        throw new ForbiddenException('Credentials already exist');
      }
      throw error;
    }
  }

  async signin(dto: SignInDto, response: Response): Promise<any> {
    const user = await this.userService.findOne(dto.email);
    if (!user) throw new UnauthorizedException();

    const pwMatches = await argon.verify(user.hash, dto.password);

    if (pwMatches) {
      const tokens = await this.getTokens(user.id, user.email, user.role);
      await this.userService.addRefreshToken(user.id, tokens.refreshToken);
      response.cookie('refresh', tokens.refreshToken, {
        httpOnly: true,
        signed: true,
        secure: this.configureService.get('NODE_ENV') === 'production',
        expires: refreshExpireDate(),
      });
      return { accessToken: tokens.accessToken };
    }
    throw new UnauthorizedException();
  }

  async signout(request, response: Response) {
    if (request.signedCookies['refresh']) {
      const sub = await this.decodeIdFromRefresh(
        request.signedCookies['refresh'],
      );
      await this.userService.removeRefreshToken(
        sub,
        request.signedCookies['refresh'],
      );
    }
    response.clearCookie('refresh');
    return { message: 'signout successfully' };
  }

  async refresh(req) {
    const refreshToken = req.signedCookies['refresh'];
    const userId = await this.decodeIdFromRefresh(refreshToken);
    const user = await this.userService.findById(userId);
    const refreshTokenMatches = await this.redisService.get(
      `user${userId}:${refreshToken}`,
    );

    if (!user || !refreshToken || !refreshTokenMatches)
      throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.email, user.role);
    return { accessToken: tokens.accessToken };
  }

  async getTokens(userId: string, email: string, role: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(
        {
          sub: userId,
          email,
          role,
        },
        {
          secret: this.configureService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.configureService.get('ACCESS_EXPIRATION'),
        },
      ),
      this.jwt.signAsync(
        {
          sub: userId,
          email,
          role,
        },
        {
          secret: this.configureService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configureService.get('REFRESH_EXPIRATION'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async decodeIdFromRefresh(refreshToken: string) {
    if (refreshToken) return await this.jwt.decode(refreshToken).sub;
    throw new UnauthorizedException();
  }

  async getCurrentUser(email: string) {
    const user = await this.userService.findOne(email);
    const { hash, ...result } = user;
    return result;
  }
}
