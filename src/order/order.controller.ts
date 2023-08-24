import {
  Controller,
  Delete,
  Param,
  Patch,
  Body,
  Get,
  Post,
  Put,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { OrderService } from './order.service';
import { PrismaClient, Product, Order, OrderStatus } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { Role } from '../auth/enums';
import { Auth } from '../auth/decorator';
import { Request } from 'express';
import { AccessTokenGuard } from '../auth/guard/accessToken.guard';

@ApiTags('Order')
@UseGuards(AccessTokenGuard)
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @ApiParam({ name: 'dto', type: CreateOrderDto })
  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  @Get()
  async getAllOrders() {
    return this.orderService.getAllOrders();
  }

  @Get('all')
  async getPaginatedOrders(
    @Query('skip') skip: string,
    @Query('take') take: string,
  ) {
    return this.orderService.getAllOrders();
  }

  @Get(':id/orders/all')
  async getAllOrdersForUser(@Param('id') userId: string) {
    return this.orderService.findAllOrdersForUser(userId);
  }

  @Auth(Role.ADMIN)
  @Put(':orderId/updateStatus/:status')
  async updateStatus(
    @Param('orderId') orderId: string,
    @Param('status') status: OrderStatus,
  ) {
    const updatedOrder = await this.orderService.updateStatus(orderId, status);
    return { message: 'Status updated successfully.', order: updatedOrder };
  }

  @Put(':orderId/updateOrderStatus/')
  async updateOrderStatus(@Param('orderId') orderId: string) {
    const status: OrderStatus = OrderStatus.COMPLETED;
    const updatedOrder = await this.orderService.updateStatus(orderId, status);
    return { message: 'Order is completed.', order: updatedOrder };
  }

  @Get(':orderId/status')
  async getStatus(@Param('orderId') orderId: string) {
    const status = await this.orderService.getOrderStatus(orderId);
    return { status };
  }

  @Get('status/finished')
  async findOrdersWithStatusFinished() {
    const orders = await this.orderService.findOrdersWithStatusFinished();
    return { message: 'Orders retrieved successfully.', orders: orders };
  }

  @Put(':id/shipmentType')
  updateShipmentType(
    @Param('id') id: string,
    @Body('shipmentType') shipmentType: 'delivery' | 'pickup',
  ) {
    return this.orderService.updateShipmentType(id, shipmentType);
  }
}
