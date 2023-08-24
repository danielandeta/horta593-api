import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ConfigModule } from '@nestjs/config';
import { S3Module } from '../aws/s3/s3.module';

@Module({
  imports: [ConfigModule, S3Module],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService, ConfigModule],
})
export class ProductModule {}
