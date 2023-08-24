import {
  Controller,
  Delete,
  Param,
  Patch,
  Body,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrderDetailService } from './order_detail.service';
import { CreateOrderDetailDto } from './dto/create_order_detail';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { Role } from '../auth/enums';
import { Auth } from '../auth/decorator';
import { AccessTokenGuard } from '../auth/guard/accessToken.guard';

@ApiTags('OrderDetail')
@UseGuards(AccessTokenGuard)
@Controller('order-detail')
export class OrderDetailController {
  constructor(private orderDetailService: OrderDetailService) {}

  @Post()
  @ApiParam({ name: 'dto', type: CreateOrderDetailDto })
  createOrderDetail(
    @Body() createOrderDetailDto: CreateOrderDetailDto,
    @Body('orderId') orderId: string,
  ) {
    return this.orderDetailService.createOrderDetail(
      orderId,
      createOrderDetailDto,
    );
  }

  @Patch(':id')
  @Auth(Role.ADMIN, Role.EMPLOYEE)
  async updateQuantity(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
  ) {
    return this.orderDetailService.updateOrderDetailQuantity(id, quantity);
  }

  @Get('order/:orderId')
  async getOrderDetailsByOrderId(@Param('orderId') orderId: string) {
    return this.orderDetailService.getOrderDetailsByOrderId(orderId);
  }

  @Delete(':id/delete')
  deleteOrderDetail(@Param('id') id: string) {
    return this.orderDetailService.deleteOrderDetail(id);
  }
}
