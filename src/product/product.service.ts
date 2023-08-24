import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditProductDto } from './dto/edit-product';
import { CreateProductDto } from './dto/create-product';
import { S3Service } from '../aws/s3/s3.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService, private s3Service: S3Service) {}

  async createProduct(createProductDto: CreateProductDto) {
    const { name, description, price, image, categoryId } = createProductDto;

    const newProduct = await this.prisma.product.create({
      data: {
        name,
        description,
        price,
        image,
        category: {
          connect: {
            id: categoryId,
          },
        },
      },
    });

    return newProduct;
  }

  async getProductById(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async getAllProducts() {
    const products = await this.prisma.product.findMany();
    return products;
  }

  async editProduct(productId: string, dto: EditProductDto) {
    try {
      const product = await this.prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          ...dto,
        },
      });

      return product;
    } catch (error) {
      throw new NotFoundException('Product not found');
    }
  }

  async deleteProduct(productId: string) {
    try {
      await this.prisma.product.delete({
        where: {
          id: productId,
        },
      });
    } catch (error) {
      throw new NotFoundException('Product not found');
    }
  }

  async getProductsByCategoryId(categoryId: string) {
    return this.prisma.product.findMany({
      where: {
        categoryId: categoryId,
      },
    });
  }

  async toggleAvailability(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const updatedStatus =
      product.status === 'AVAILABLE' ? 'UNAVAILABLE' : 'AVAILABLE';

    return this.prisma.product.update({
      where: { id: productId },
      data: { status: updatedStatus },
    });
  }

  async addFileToProduct(file: Express.Multer.File, productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const key = `${file.fieldname}${Date.now()}`;

    const response = await this.s3Service.uploadFile(file, key);

    if (response.success) {
      return await this.prisma.product.update({
        where: { id: productId },
        data: { image: response.imageURL },
      });
    }
    throw new HttpException(response.message, 400);
  }
}
