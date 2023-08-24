import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PromoController } from './promo.controller';
import { PromoService } from './promo.service';

@Module({
  imports: [ConfigModule],
  controllers: [PromoController],
  providers: [PromoService],
  exports: [PromoService, ConfigModule],
})
export class PromoModule {}
