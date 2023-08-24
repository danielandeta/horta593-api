import {
  Controller,
  Delete,
  Param,
  Patch,
  Body,
  Get,
  Post,
  Request,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { ProductService } from './product.service';
import { EditProductDto } from './dto/edit-product';
import { CreateProductDto } from './dto/create-product';
import { Role } from '../auth/enums';
import { Auth } from '../auth/decorator';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../auth/guard/accessToken.guard';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express/multer';

@ApiTags('Product')
@UseGuards(AccessTokenGuard)
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @ApiParam({ name: 'dto', type: CreateProductDto })
  @Post()
  @Auth(Role.ADMIN, Role.EMPLOYEE)
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @Get(':id')
  getProductById(@Param('id') productId: string) {
    return this.productService.getProductById(productId);
  }

  @Get()
  async getAllProducts() {
    return this.productService.getAllProducts();
  }

  @ApiParam({ name: 'dto', type: EditProductDto })
  @Patch(':id')
  @Auth(Role.ADMIN, Role.EMPLOYEE)
  editProduct(@Param('id') productId: string, @Body() dto: EditProductDto) {
    return this.productService.editProduct(productId, dto);
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  deleteProduct(@Param('id') productId: string) {
    return this.productService.deleteProduct(productId);
  }

  @Patch('changeStatus/:id')
  @Auth(Role.ADMIN, Role.EMPLOYEE)
  toggleAvailability(@Param('id') productId: string) {
    return this.productService.toggleAvailability(productId);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('/:id/upload-file')
  async addImageToProduct(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') productId: string,
    @Request() req,
  ) {
    const { sub: email } = req.user;
    await this.productService.addFileToProduct(file, productId);
  }
}
