import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { AILogsService } from './ai-logs.service';

@Controller('ai-logs')
export class AILogsController {
  constructor(private readonly aiLogsService: AILogsService) {}

  @Post()
  async create(@Body() data: any) {
    return this.aiLogsService.create(data);
  }

  @Get()
  async findAll(
    @Query('category') category?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('helpful') helpful?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.aiLogsService.findAll({
      category,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined,
      helpful: helpful === 'true' ? true : helpful === 'false' ? false : undefined,
      search,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 50,
    });
  }

  @Get('stats')
  async getStats() {
    return this.aiLogsService.getStats();
  }

  @Get('categories')
  async getCategories() {
    return this.aiLogsService.getCategories();
  }

  @Patch(':id/helpful')
  async updateHelpful(
    @Param('id') id: string,
    @Body('helpful') helpful: boolean,
  ) {
    return this.aiLogsService.updateHelpful(id, helpful);
  }
}
