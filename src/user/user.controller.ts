import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser, Auth, RoleProtected } from '../auth/decorator';
import { EditUserDto } from './dto/edit-user';
import { UserService } from './user.service';
import { EditRoleDto } from './dto';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { Role } from '../auth/enums';
import { OrderService } from '../order/order.service';
import { AccessTokenGuard } from '../auth/guard/accessToken.guard';

@ApiTags('User')
@UseGuards(AccessTokenGuard)
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly orderService: OrderService,
  ) {}

  @Get('me')
  getMe(@GetUser() user: User) {
    return this.userService.getUserProfile(user.email);
  }

  @ApiParam({ name: 'dto', type: EditUserDto })
  @Patch(':id')
  editUser(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
    @Body() dto: EditUserDto,
  ) {
    return this.userService.editUser(user.id, dto);
  }

  @Get('role/employees')
  @Auth(Role.ADMIN)
  async getEmployees() {
    return this.userService.getUsersByRole('EMPLOYEE');
  }

  @Get('role/users')
  @Auth(Role.ADMIN)
  async getUsers() {
    return this.userService.getUsersByRole('USER');
  }

  @ApiParam({ name: 'dto', type: EditRoleDto })
  @Patch('role/:id')
  @Auth(Role.ADMIN)
  editRole(@Param('id', ParseUUIDPipe) id: string, @Body() dto: EditRoleDto) {
    return this.userService.editRole(id, dto);
  }

  @Get(':userId/orders/:orderId')
  async getOrderForUser(
    @Param('userId') userId: string,
    @Param('orderId') orderId: string,
  ) {
    return this.orderService.findOrderForUser(userId, orderId);
  }

  @Get('me/location')
  getUserLocation(@GetUser() user: User) {
    const userId = user.email;
    return this.userService.getUserLocation(userId);
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.deleteUser(id);
  }

  @Patch(':userId/address')
  @Auth(Role.ADMIN, Role.USER)
  async updateAddress(
    @Param('userId') userId: string,
    @Body('latitude') latitude: number,
    @Body('longitude') longitude: number,
    @Body('address') address: string,
  ) {
    const updatedUser = await this.userService.updateAddress(
      userId,
      latitude,
      longitude,
      address,
    );
    return { message: 'Address updated successfully.', user: updatedUser };
  }
}
