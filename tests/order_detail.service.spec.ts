import { Test, TestingModule } from '@nestjs/testing';
import { OrderDetailService } from '../src/order_detail/order_detail.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { OrderService } from '../src/order/order.service';
import { CreateOrderDetailDto } from '../src/order_detail/dto/create_order_detail';
import Decimal from 'decimal.js';
import { OrderStatus } from '@prisma/client';

describe('OrderDetailService', () => {
    let service: OrderDetailService;
    let prismaService: PrismaService;
    let orderService: OrderService;

    beforeEach(async () => {
        prismaService = {
          orderDetail: {
            create: jest.fn(),
            update: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            delete: jest.fn()
          },
          product: {
            findUnique: jest.fn().mockResolvedValue({ price: 100 }), 
          },
        } as unknown as PrismaService;
    
        orderService = {
          updateOrderAmount: jest.fn(),
        } as unknown as OrderService;
    
        service = new OrderDetailService(prismaService, orderService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createOrderDetail', () => {
      it('should create an order detail', async () => {
        const orderId = '2f7c8907-608c-44c1-b876-0b301feb3367'; 
        const createOrderDetailDto: CreateOrderDetailDto = {
          "productId": "3ffb55f7-2bc4-451d-9700-51f180dae0d2",
          "quantity": 2,
          "special_note": null, 
          "discount": 0   
        };
    
        const expectedTotal = new Decimal(100).times(new Decimal(2)); 
        const expectedOrderDetail = {
          id: "fakeid",
          orderId: orderId,
          productId: '3ffb55f7-2bc4-451d-9700-51f180dae0d2',
          status: OrderStatus.SENT, 
          quantity: 2,
          discount: new Decimal(0),
          total: expectedTotal,
          special_note: null,
        };
    
        prismaService.product.findUnique = jest.fn().mockResolvedValue({
          id: "3ffb55f7-2bc4-451d-9700-51f180dae0d2",
          price: 100,
        });    
        jest.spyOn(prismaService.orderDetail, 'create').mockResolvedValue(expectedOrderDetail);
        jest.spyOn(orderService, 'updateOrderAmount').mockResolvedValue(undefined);
    
        const result = await service.createOrderDetail(orderId, createOrderDetailDto);
    
        expect(result).toEqual(expect.objectContaining(expectedOrderDetail));
      });
    });
    
      

    describe('updateOrderDetailQuantity', () => {
        it('should update order detail quantity', async () => {
          const id = '73b4967a-89d6-42dc-8da2-c4ccc5f52e3e';
          const quantity = 2;
    
          const expectedOrderDetail = {
            id,
            orderId: '2f7c8907-608c-44c1-b876-0b301feb3367',
            productId: 'b5c35469-068d-4854-885b-fb502538c29f',
            status: OrderStatus.SENT, 
            quantity,
            discount: new Decimal(0),
            total: new Decimal(0),
            special_note: null,
          };
    
          jest.spyOn(prismaService.orderDetail, 'update').mockResolvedValue(expectedOrderDetail); 
          jest.spyOn(service, 'updateOrderDetailTotal').mockResolvedValue();
          jest.spyOn(orderService, 'updateOrderAmount').mockResolvedValue();
    
          const result = await service.updateOrderDetailQuantity(id, quantity);
    
          expect(result).toEqual(expectedOrderDetail);
        });
      });

    describe('getOrderDetailsByOrderId', () => {
        it('should get order details by order ID', async () => {
            const orderId = '2f7c8907-608c-44c1-b876-0b301feb3367';
            const expectedOrderDetails = [
                {
                    id: '73b4967a-89d6-42dc-8da2-c4ccc5f52e3e',
                    orderId: '2f7c8907-608c-44c1-b876-0b301feb3367',
                    productId: 'b5c35469-068d-4854-885b-fb502538c29f',
                    status: OrderStatus.SENT,
                    quantity: 2,
                    discount: new Decimal(0),
                    total: new Decimal(0),
                    special_note: null,
                }
            ];
            
        
            jest.spyOn(prismaService.orderDetail, 'findMany').mockResolvedValue(expectedOrderDetails as any);

        
            const result = await service.getOrderDetailsByOrderId(orderId);
        
            expect(result).toEqual(expectedOrderDetails);
        });
    });

    describe('deleteOrderDetail', () => {
        it('should delete an order detail', async () => {
            const id = '73b4967a-89d6-42dc-8da2-c4ccc5f52e3e';
            const expectedDeletedOrderDetail = { 
                id,
                orderId: '2f7c8907-608c-44c1-b876-0b301feb3367',
                productId: 'b5c35469-068d-4854-885b-fb502538c29f',
                status: OrderStatus.SENT, 
                quantity: 2,
                discount: new Decimal(0),
                total: new Decimal(0),
                special_note: null,
            };
        
            jest.spyOn(prismaService.orderDetail, 'findUnique').mockResolvedValue(expectedDeletedOrderDetail);
            jest.spyOn(prismaService.orderDetail, 'delete').mockResolvedValue(expectedDeletedOrderDetail);
        
            const result = await service.deleteOrderDetail(id);
        
            expect(result).toEqual(expectedDeletedOrderDetail);
        });
      });
      
    
    });