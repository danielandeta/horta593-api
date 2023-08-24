import { Controller,
    Get, 
    Post, 
    Put, 
    Delete, 
    Param, 
    Body,
    UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/category';
import { Role } from '../auth/enums';
import { Auth } from '../auth/decorator';
import { ApiTags } from '@nestjs/swagger';
import { UserRoleGuard } from '../auth/guard/roles.guard';
import { ProductService } from '../product/product.service';
import { AccessTokenGuard } from '../auth/guard/accessToken.guard';

@ApiTags('Category')
@UseGuards(AccessTokenGuard)
@Controller('category')
export class CategoryController {
    constructor(
      private categoryService: CategoryService,
      private productService: ProductService) {}

  @UseGuards(JwtGuard, UserRoleGuard)
  @Auth(Role.ADMIN)
  @Post()
  async createCategory(@Body() dto: CreateCategoryDto) {
    const newCategory = await this.categoryService.createCategory(dto);
    return newCategory;
  }

  @Get(':id')
  async getCategoryById(@Param('id') categoryId: string) {
    const category = await this.categoryService.getCategoryById(categoryId);
    return category;
  }

  @Get()
  async getAllCategories() {
    const categories = await this.categoryService.getAllCategories();
    return categories;
  }

  @Put(':id')
  @Auth(Role.ADMIN, Role.EMPLOYEE)
  async updateCategory(
    @Param('id') categoryId: string,
    @Body() dto: CreateCategoryDto,
  ) {
    const updatedCategory = await this.categoryService.updateCategory(
      categoryId,
      dto,
    );
    return updatedCategory;
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  async deleteCategory(@Param('id') categoryId: string) {
      await this.categoryService.deleteCategory(categoryId);
      return { message: 'Category deleted successfully' };
  }

  @Get(':id/products')
  getProductsByCategoryId(@Param('id') id: string) {
      return this.productService.getProductsByCategoryId(id);
  }
}