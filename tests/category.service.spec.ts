import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from '../src/category/category.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { CreateCategoryDto } from '../src/category/dto/category';
import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

describe('CategoryService', () => {
  let categoryService: CategoryService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        providers: [CategoryService, PrismaService, ConfigService],
    }).compile();

    categoryService = module.get<CategoryService>(CategoryService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getCategoryById', () => {
    it('should return a category by id', async () => {
      const categoryId = '1e148df0-b6a3-4e04-8f9b-ca0df58dee5a';

      jest.spyOn(prismaService.category, 'findUnique').mockResolvedValue({
        id: categoryId,
        name: 'Hamburguesa',
        icon: '', 
        createdAt: new Date(), 
        updatedAt: new Date()  
      });
      

      const result = await categoryService.getCategoryById(categoryId);

      expect(result).toEqual(
        expect.objectContaining({ name: 'Hamburguesa' }),
      );
    });

    it('should throw NotFoundException when category is not found', async () => {
      const categoryId = 'non-existing-id';

      jest
        .spyOn(prismaService.category, 'findUnique')
        .mockResolvedValue(null);

      await expect(categoryService.getCategoryById(categoryId)).rejects.toThrow(NotFoundException);
    });
  });

  
});
