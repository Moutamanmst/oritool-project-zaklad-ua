import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { EstablishmentsService } from './establishments.service';
import {
  CreateEstablishmentDto,
  UpdateEstablishmentDto,
  AdminUpdateEstablishmentDto,
  FilterEstablishmentDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Lang } from '../../common/decorators/lang.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('establishments')
@Controller('establishments')
export class EstablishmentsController {
  constructor(private readonly establishmentsService: EstablishmentsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all establishments with filters' })
  @ApiResponse({ status: 200, description: 'List of establishments' })
  async findAll(@Query() filters: FilterEstablishmentDto) {
    return this.establishmentsService.findAll(filters);
  }

  @Get('compare')
  @Public()
  @ApiOperation({ summary: 'Compare multiple establishments' })
  @ApiQuery({ name: 'ids', type: [String], description: 'Array of establishment IDs' })
  @ApiResponse({ status: 200, description: 'Comparison data' })
  async compare(@Query('ids') ids: string | string[], @Lang() lang: string) {
    const idArray = Array.isArray(ids) ? ids : ids.split(',');
    return this.establishmentsService.compare(idArray, lang);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current business establishments' })
  @ApiResponse({ status: 200, description: 'List of business establishments' })
  async findMyEstablishments(
    @CurrentUser() user: any,
    @Query() filters: FilterEstablishmentDto,
  ) {
    if (!user.businessProfile) {
      return { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0, hasNextPage: false, hasPrevPage: false } };
    }
    return this.establishmentsService.findByBusiness(user.businessProfile.id, filters);
  }

  @Get(':idOrSlug')
  @Public()
  @ApiOperation({ summary: 'Get establishment by ID or slug' })
  @ApiResponse({ status: 200, description: 'Establishment details' })
  @ApiResponse({ status: 404, description: 'Establishment not found' })
  async findOne(@Param('idOrSlug') idOrSlug: string, @Lang() lang: string) {
    return this.establishmentsService.findOne(idOrSlug, lang);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new establishment' })
  @ApiResponse({ status: 201, description: 'Establishment created' })
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateEstablishmentDto,
  ) {
    return this.establishmentsService.create(userId, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update establishment' })
  @ApiResponse({ status: 200, description: 'Establishment updated' })
  async update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateEstablishmentDto,
  ) {
    return this.establishmentsService.update(id, userId, dto);
  }

  @Patch(':id/admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin update establishment' })
  @ApiResponse({ status: 200, description: 'Establishment updated by admin' })
  async adminUpdate(
    @Param('id') id: string,
    @Body() dto: AdminUpdateEstablishmentDto,
  ) {
    return this.establishmentsService.adminUpdate(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete establishment' })
  @ApiResponse({ status: 200, description: 'Establishment deleted' })
  async delete(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole,
  ) {
    return this.establishmentsService.delete(id, userId, userRole);
  }
}

