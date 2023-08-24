import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { HealthController } from './health/health.controller';
import { HealthModule } from './health/health.module';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { RedisModule } from './redis/redis.module';
import { OrderModule } from './order/order.module';
import { OrderDetailController } from './order_detail/order_detail.controller';
import { OrderDetailModule } from './order_detail/order_detail.module';
import { ScoreModule } from './score/score.module';
import { PromoService } from './promo/promo.service';
import { PromoController } from './promo/promo.controller';
import { PromoModule } from './promo/promo.module';
import { PaymentService } from './payment/payment.service';
import { PaymentController } from './payment/payment.controller';
import { PaymentModule } from './payment/payment.module';
import { AppController } from './app.controller';
import { S3Module } from './aws/s3/s3.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    S3Module,
    TerminusModule,
    HttpModule,
    HealthModule,
    AuthModule,
    UserModule,
    PrismaModule,
    ProductModule,
    CategoryModule,
    RedisModule,
    HealthModule,
    OrderModule,
    OrderDetailModule,
    ScoreModule,
    PromoModule,
    PaymentModule,
  ],
  controllers: [HealthController, AppController],
})
export class AppModule {}
