import { Injectable } from '@nestjs/common';
import { CreateOrderDetailDto } from './dto/create_order_detail';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClient, Prisma } from '@prisma/client';
import Decimal from 'decimal.js';
import { OrderService } from '../order/order.service';

@Injectable()
export class OrderDetailService {
  constructor(
    private prisma: PrismaService,
    private orderService: OrderService,
  ) {}

  async createOrderDetail(
    orderId: string,
    createOrderDetailDto: CreateOrderDetailDto,
  ) {
    const { productId, quantity, special_note, discount } =
      createOrderDetailDto;
    let orderDetail;

    try {
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
        select: { price: true },
      });

      if (!product) {
        throw new Error(`Product with ID ${productId} not found`);
      }

      const total = new Decimal(product.price).times(new Decimal(quantity));

      orderDetail = await this.prisma.orderDetail.create({
        data: {
          order: {
            connect: {
              id: orderId,
            },
          },
          product: {
            connect: {
              id: productId,
            },
          },
          quantity: quantity,
          total: new Prisma.Decimal(total.toString()),
          special_note: special_note,
          discount: discount,
        },
      });

      await this.orderService.updateOrderAmount(orderId);
    } catch (error) {
      console.error(error);
      throw error;
    }

    return orderDetail;
  }

  async updateOrderDetailQuantity(id: string, quantity: number) {
    const orderDetail = await this.prisma.orderDetail.update({
      where: { id },
      data: { quantity },
    });

    await this.updateOrderDetailTotal(id);
    await this.orderService.updateOrderAmount(orderDetail.orderId);

    return orderDetail;
  }

  async updateOrderDetailTotal(id: string) {
    const orderDetail = await this.prisma.orderDetail.findUnique({
      where: { id },
      include: { product: true },
    });

    if (!orderDetail) {
      throw new Error(`OrderDetail with ID ${id} not found`);
    }

    const total = new Decimal(orderDetail.product.price).times(
      new Decimal(orderDetail.quantity),
    );

    await this.prisma.orderDetail.update({
      where: { id },
      data: { total: new Prisma.Decimal(total.toString()) },
    });
  }

  async getOrderDetailsByOrderId(orderId: string) {
    return this.prisma.orderDetail.findMany({
      where: { orderId },
    });
  }

  async deleteOrderDetail(id: string) {
    const orderDetail = await this.prisma.orderDetail.findUnique({
      where: { id },
    });

    if (!orderDetail) {
      throw new Error(`OrderDetail with ID ${id} not found`);
    }

    return this.prisma.orderDetail.delete({ where: { id } });
  }
}
