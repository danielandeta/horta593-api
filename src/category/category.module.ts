import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { ProductModule } from '../product/product.module'

@Module({
  imports: [ProductModule],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
