import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { BlogService } from './blog.service';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  async findAll(
    @Query('status') status?: string,
    @Query('category') category?: string,
    @Query('limit') limit?: string,
    @Query('page') page?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.blogService.findAll({
      status,
      category,
      limit: limit ? parseInt(limit) : undefined,
      page: page ? parseInt(page) : undefined,
      sortBy,
      sortOrder,
    });
  }

  @Get('categories')
  async getCategories() {
    return this.blogService.getCategories();
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return this.blogService.findOne(slug);
  }

  @Get('id/:id')
  async findById(@Param('id') id: string) {
    return this.blogService.findById(id);
  }

  @Post()
  async create(@Body() data: any) {
    return this.blogService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.blogService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.blogService.delete(id);
  }
}
