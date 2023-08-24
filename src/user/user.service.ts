import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto/edit-user';
import { PrismaErrorCode } from '../prisma/prisma-error';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { EditRoleDto } from './dto/edit-role';
import { RedisService } from '../redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/new-user';
import { UserRole } from '@prisma/client';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private config: ConfigService,
  ) {}

  async create(dto: CreateUserDto) {
    const hash = await argon.hash(dto.password);
    const user = await this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        hash,
      },
    });

    delete user.hash;

    return user;
  }

  async editRole(userId: string, dto: EditRoleDto) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          role: UserRole[dto.role],
        },
      });
      delete user.hash;

      return user;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === PrismaErrorCode.RecordDoesNotExist
      ) {
        throw new ForbiddenException('Record does not exist');
      }
      throw error;
    }
  }
  async getUserLocation(userId: string) {
    if (!userId) {
      throw new Error('User ID must be provided');
    }
    const user = await this.prisma.user.findUnique({
      where: { email: userId },
    });
    if (!user) {
      throw new Error('User not found');
    }
    return {
      latitude: user.latitude,
      longitude: user.longitude,
      address: user.address,
    };
  }

  async getUsersByRole(role: string) {
    const users = await this.prisma.user.findMany({
      where: {
        role: UserRole[role],
      },
    });
    return users;
  }

  async getUserProfile(userId: string) {
    if (!userId) {
      throw new Error('User ID must be provided');
    }
    const user = await this.prisma.user.findUnique({
      where: { email: userId },
    });
    if (!user) {
      throw new Error('User not found');
    }
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      latitude: user.latitude,
      longitude: user.longitude,
      address: user.address,
      role: user.role,
    };
  }

  async editUser(userId: string, dto: EditUserDto) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          ...dto,
        },
      });
      delete user.hash;
      return user;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === PrismaErrorCode.RecordDoesNotExist
      ) {
        throw new ForbiddenException('Record does not exist');
      }
      throw error;
    }
  }

  async findOne(email: string) {
    return await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
  }

  async findById(id: string) {
    return await this.prisma.user.findFirst({
      where: {
        id,
      },
    });
  }

  async addRefreshToken(userId: string, refreshToken: string) {
    await this.redis.set({
      key: `user${userId}:${refreshToken}`,
      value: 1,
      time:
        parseInt(this.config.get('REFRESH_EXPIRATION').slice(0, -1), 10) *
        (24 * 60 * 60),
    });
  }

  async removeRefreshToken(userId: string, refreshToken: string) {
    await this.redis.del(`user${userId}:${refreshToken}`);
  }
  async deleteUser(userId: string) {
    return await this.prisma.user.delete({
      where: { id: userId },
    });
  }

  async updateAddress(
    userId: string,
    latitude: number,
    longitude: number,
    address: string,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        latitude: latitude,
        longitude: longitude,
        address: address,
      },
    });
  }
}
