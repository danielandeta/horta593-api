import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ConfigModule } from '@nestjs/config';
import { PaymentController } from './payment.controller';
import { S3Module } from '../aws/s3/s3.module';

@Module({
  imports: [ConfigModule, S3Module],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService, ConfigModule],
})
export class PaymentModule {}
