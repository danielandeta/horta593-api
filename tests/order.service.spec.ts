import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '../src/order/order.controller';
import { OrderService } from '../src/order/order.service';
import { CreateOrderDto } from '../src/order/dto/create-order';

describe('Order Controller', () => {
  let controller: OrderController;
  let service: OrderService;

  beforeEach(async () => {
    service = { createOrder: jest.fn().mockReturnValue('test') } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [{ provide: OrderService, useValue: service }],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should create an order', async () => {
    const createOrderDto: CreateOrderDto = {
      userId: '8c0da445-0065-4a34-b1c8-49dfca205d0e',
      orderDetails: [],
      special_note: 'note',
    };
    expect(await controller.createOrder(createOrderDto)).toBe('test');
  });
});
