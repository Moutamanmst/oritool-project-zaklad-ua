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
import { TechniciansService } from './technicians.service';

@Controller('technicians')
export class TechniciansController {
  constructor(private readonly techniciansService: TechniciansService) {}

  @Get()
  async findAll(
    @Query('city') city?: string,
    @Query('specialization') specialization?: string,
    @Query('status') status?: string,
    @Query('limit') limit?: string,
    @Query('page') page?: string,
  ) {
    return this.techniciansService.findAll({
      city,
      specialization,
      status,
      limit: limit ? parseInt(limit) : undefined,
      page: page ? parseInt(page) : undefined,
    });
  }

  @Get('specializations')
  async getSpecializations() {
    return this.techniciansService.getSpecializations();
  }

  @Get('cities')
  async getCities() {
    return this.techniciansService.getCities();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.techniciansService.findOne(id);
  }

  @Post()
  async create(@Body() data: any) {
    return this.techniciansService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.techniciansService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.techniciansService.delete(id);
  }
}
