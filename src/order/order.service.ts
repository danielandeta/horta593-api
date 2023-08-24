import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClient, Prisma, OrderStatus } from '@prisma/client';
import Decimal from 'decimal.js';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const { userId, orderDetails, special_note } = createOrderDto;

    try {
      const order = await this.prisma.order.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          special_note: special_note,
          orderDetails: {
            create: orderDetails.map((detail) => ({
              product: { connect: { id: detail.productId } },
              quantity: detail.quantity,
              special_note: detail.special_note,
            })),
          },
        },
        include: {
          orderDetails: true,
        },
      });

      return order;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to create order.');
    }
  }

  async getAllOrders() {
    const orders = await this.prisma.order.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        payment: {
          select: {
            id: true,
            transferImage: true,
          },
        },
      },
    });
    return orders;
  }

  async getPaginatedOrders(params: { skip?: number; take?: number }) {
    const { skip, take } = params;
    if (skip < 0 || take < 0) {
      throw new BadRequestException('Skip and take must be positive numbers.');
    }
    if (isNaN(skip)) {
      const orders = await this.prisma.order.findMany({
        take: take,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });
      return orders;
    } else {
      return this.prisma.order.findMany({
        skip: skip,
        take: take,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });
    }
  }

  async updateOrderAmount(orderId: string) {
    const orderDetails = await this.prisma.orderDetail.findMany({
      where: {
        orderId: orderId,
      },
      include: {
        product: true,
      },
    });

    const amount = orderDetails.reduce(async (sum, orderDetail) => {
      const productPrice = new Decimal(orderDetail.product.price);
      const quantities = new Decimal(orderDetail.quantity);
      const totalPrice = productPrice.times(quantities);
      return (await sum) + totalPrice.toNumber();
    }, Promise.resolve(0));

    await this.prisma.order.update({
      where: { id: orderId },
      data: { amount: new Prisma.Decimal((await amount).toString()) },
    });
  }

  async findAllOrdersForUser(userId: string) {
    return this.prisma.order.findMany({
      where: {
        userId: userId,
      },
    });
  }

  async findOrderForUser(userId: string, orderId: string) {
    return this.prisma.order.findFirst({
      where: {
        AND: [{ id: orderId }, { userId: userId }],
      },
    });
  }

  async updateStatus(orderId: string, status: OrderStatus) {
    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus[status] },
    });
    return updatedOrder;
  }

  async getOrderStatus(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    return order.status;
  }

  async findOrdersWithStatusFinished() {
    return this.prisma.order.findMany({
      where: {
        status: OrderStatus.COMPLETED,
      },
    });
  }

  async updateShipmentType(
    orderId: string,
    shipmentType: 'delivery' | 'pickup',
  ) {
    if (shipmentType !== 'delivery' && shipmentType !== 'pickup') {
      throw new BadRequestException('Invalid shipment type');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { shipmentType },
    });
  }
}
