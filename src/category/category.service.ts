import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/category';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async createCategory(dto: CreateCategoryDto) {
    const { name } = dto;

    const newCategory = await this.prisma.category.create({
      data: {
        name,
      },
    });

    return newCategory;
  }

  async getCategoryById(categoryId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async getAllCategories() {
    const categories = await this.prisma.category.findMany();
    return categories;
  }

  async updateCategory(categoryId: string, dto: CreateCategoryDto) {
    const { name } = dto;

    const updatedCategory = await this.prisma.category.update({
      where: { id: categoryId },
      data: {
        name,
      },
    });
    return updatedCategory;
  }

  async deleteCategory(categoryId: string) {
    await this.prisma.category.delete({
      where: { id: categoryId },
    });
  }


    
}
