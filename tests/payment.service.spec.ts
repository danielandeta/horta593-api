import { PaymentService } from '../src/payment/payment.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { CreatePaymentDto } from '../src/payment/dto/create-payment';
import { S3Service } from '../src/aws/s3/s3.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';

const paymentMock = {
  id: 'payment-id',
  orderId: '2f7c8907-608c-44c1-b876-0b301feb3367',
  transferImage: 'transfer-image',
  firstName: 'John',
  lastName: 'Doe',
  nationalId: '123456',
  paymentDate: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
};
describe('PaymentService', () => {
  let paymentService: PaymentService;
  let prismaService: PrismaService;
  let httpService: DeepMocked<HttpService>;
  let s3Service: S3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        PrismaService,
        ConfigService,
        S3Service,
        {
          provide: HttpService,
          useValue: createMock<HttpService>(),
        },
      ],
    }).compile();

    paymentService = module.get<PaymentService>(PaymentService);
    prismaService = module.get<PrismaService>(PrismaService);
    httpService = module.get(HttpService);
    s3Service = module.get<S3Service>(S3Service);
  });

  describe('create', () => {
    it('should create a payment', async () => {
      const createPaymentDto: CreatePaymentDto = {
        orderId: '2f7c8907-608c-44c1-b876-0b301feb3367',
        firstName: 'John',
        lastName: 'Doe',
        nationalId: '123456',
      };

      jest
        .spyOn(prismaService.payment, 'create')
        .mockResolvedValue(paymentMock);

      const result = await paymentService.create(createPaymentDto);

      expect(result).toEqual(paymentMock);
    });
  });

  describe('edit', () => {
    it('should edit a payment', async () => {
      const id = 'payment-id';
      const createPaymentDto: CreatePaymentDto = {
        orderId: 'new-order-id',
        firstName: 'Jane',
        lastName: 'Doe',
        nationalId: '654321',
      };

      jest
        .spyOn(prismaService.payment, 'findUnique')
        .mockResolvedValue(paymentMock);
      jest
        .spyOn(prismaService.payment, 'update')
        .mockResolvedValue(paymentMock);

      const result = await paymentService.edit(id, createPaymentDto);

      expect(result).toEqual(paymentMock);
    });
  });

  describe('remove', () => {
    it('should remove a payment', async () => {
      const id = 'payment-id';

      jest
        .spyOn(prismaService.payment, 'findUnique')
        .mockResolvedValue(paymentMock);
      jest
        .spyOn(prismaService.payment, 'delete')
        .mockResolvedValue(paymentMock);

      const result = await paymentService.remove(id);

      expect(result).toEqual(paymentMock);
    });
  });
});
