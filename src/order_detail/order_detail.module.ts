import { Module } from '@nestjs/common';
import { OrderDetailService } from './order_detail.service';
import { OrderDetailController } from './order_detail.controller';
import { PrismaService } from "../prisma/prisma.service";
import { OrderModule } from '../order/order.module';



@Module({
  providers: [OrderDetailService,  PrismaService],
  controllers: [OrderDetailController],
  imports: [OrderModule]
})
export class OrderDetailModule {}
