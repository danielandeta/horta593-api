import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { ProductService } from '../src/product/product.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { EditProductDto } from '../src/product/dto/edit-product';
import { ConfigService } from '@nestjs/config';
import { CreateProductDto } from '../src/product/dto/create-product';
import Decimal from 'decimal.js';
import { S3Service } from '../src/aws/s3/s3.service';

describe('ProductService', () => {
  let productService: ProductService;
  let prismaService: PrismaService;
  let httpService: DeepMocked<HttpService>;
  let s3Service: S3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        PrismaService,
        ConfigService,
        S3Service,
        {
          provide: HttpService,
          useValue: createMock<HttpService>(),
        },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    prismaService = module.get<PrismaService>(PrismaService);
    httpService = module.get(HttpService);
    s3Service = module.get<S3Service>(S3Service);
  });

  describe('createProduct', () => {
    it('should create a product and return it', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Hamburguesa',
        description: 'Delicious Burger',
        price: 15.99,
        image: 'www.google.com',
        categoryId: 'some-category-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockCreatedProduct = {
        ...createProductDto,
        id: 'new-product-id',
        createdAt: new Date(),
        updatedAt: new Date(),
        price: new Decimal(createProductDto.price.toString()),
        status: 'AVAILABLE',
      };

      jest
        .spyOn(prismaService.product, 'create')
        .mockResolvedValue(mockCreatedProduct);

      const result = await productService.createProduct(createProductDto);

      expect(result).toEqual(mockCreatedProduct);
    });
  });

  describe('editProduct', () => {
    it('should edit an existing product', async () => {
      const productId = 'new-product-id';
      const editProductDto: EditProductDto = {
        name: 'Hamburguesa',
        description: 'Edited description',
        price: 13.99,
        image: 'www.google.com',
      };

      const mockUpdatedProduct = {
        id: productId,
        name: editProductDto.name,
        description: editProductDto.description,
        price: new Decimal(editProductDto.price),
        image: editProductDto.image,
        status: 'AVAILABLE',
        createdAt: new Date(),
        updatedAt: new Date(),
        categoryId: 'some-category-id',
      };

      jest
        .spyOn(prismaService.product, 'update')
        .mockResolvedValue(mockUpdatedProduct as any);

      const result = await productService.editProduct(
        productId,
        editProductDto,
      );

      expect(result).toEqual(
        expect.objectContaining({
          name: 'Hamburguesa',
          description: 'Edited description',
        }),
      );
    });

    it('should throw NotFoundException when product is not found', async () => {
      const productId = 'non-existing-id';
      const editProductDto: EditProductDto = {
        name: 'Hamburguesa',
        description: 'Edited description',
        price: 15.99,
        image: 'www.google.com',
      };

      jest
        .spyOn(prismaService.product, 'update')
        .mockRejectedValue(new Error('Product not found'));

      await expect(
        productService.editProduct(productId, editProductDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getProductById', () => {
    it('valid product ID to return the product name', async () => {
      const mockProduct = {
        id: 'new-product-id',
        name: 'Hamburguesa',
        description: 'Description here',
        price: new Decimal('13.99'),
        image: 'image URL',
        status: 'AVAILABLE',
        createdAt: new Date(),
        updatedAt: new Date(),
        categoryId: 'category-id',
      };
      jest
        .spyOn(prismaService.product, 'findUnique')
        .mockResolvedValue(mockProduct);
    });
  });
});
