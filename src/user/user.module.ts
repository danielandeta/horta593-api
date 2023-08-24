import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { OrderModule } from '../order/order.module';
import { OrderService } from '../order/order.service';

@Module({
  imports: [OrderModule],
  controllers: [UserController],
  providers: [UserService, OrderService, OrderService]
})
export class UserModule {}
