import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment';
import { S3Service } from '../aws/s3/s3.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => S3Service))
    private readonly s3Service: S3Service,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    return this.prisma.payment.create({ data: createPaymentDto });
  }

  async edit(id: string, createPaymentDto: CreatePaymentDto) {
    const payment = await this.prisma.payment.findUnique({ where: { id } });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return this.prisma.payment.update({
      where: { id },
      data: createPaymentDto,
    });
  }

  async remove(id: string) {
    const payment = await this.prisma.payment.findUnique({ where: { id } });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return this.prisma.payment.delete({ where: { id } });
  }

  async addFileToPayment(file: Express.Multer.File, paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    const key = `payment-${file.fieldname}${Date.now()}`;

    const response = await this.s3Service.uploadFile(file, key);

    if (response.success) {
      return await this.prisma.payment.update({
        where: { id: paymentId },
        data: { transferImage: response.imageURL },
      });
    }
    throw new HttpException(response.message, 400);
  }
}
