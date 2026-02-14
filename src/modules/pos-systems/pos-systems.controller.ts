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
import { PosSystemsService } from './pos-systems.service';
import {
  CreatePosSystemDto,
  UpdatePosSystemDto,
  AdminUpdatePosSystemDto,
  FilterPosSystemDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Lang } from '../../common/decorators/lang.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('pos-systems')
@Controller('pos-systems')
export class PosSystemsController {
  constructor(private readonly posSystemsService: PosSystemsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all POS systems with filters' })
  @ApiResponse({ status: 200, description: 'List of POS systems' })
  async findAll(@Query() filters: FilterPosSystemDto) {
    return this.posSystemsService.findAll(filters);
  }

  @Get('compare')
  @Public()
  @ApiOperation({ summary: 'Compare multiple POS systems' })
  @ApiQuery({ name: 'ids', type: [String], description: 'Array of POS system IDs' })
  @ApiResponse({ status: 200, description: 'Comparison data' })
  async compare(@Query('ids') ids: string | string[], @Lang() lang: string) {
    const idArray = Array.isArray(ids) ? ids : ids.split(',');
    return this.posSystemsService.compare(idArray, lang);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current business POS systems' })
  @ApiResponse({ status: 200, description: 'List of business POS systems' })
  async findMyPosSystems(
    @CurrentUser() user: any,
    @Query() filters: FilterPosSystemDto,
  ) {
    if (!user.businessProfile) {
      return { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0, hasNextPage: false, hasPrevPage: false } };
    }
    return this.posSystemsService.findByBusiness(user.businessProfile.id, filters);
  }

  @Get(':idOrSlug')
  @Public()
  @ApiOperation({ summary: 'Get POS system by ID or slug' })
  @ApiResponse({ status: 200, description: 'POS system details' })
  @ApiResponse({ status: 404, description: 'POS system not found' })
  async findOne(@Param('idOrSlug') idOrSlug: string, @Lang() lang: string) {
    return this.posSystemsService.findOne(idOrSlug, lang);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new POS system' })
  @ApiResponse({ status: 201, description: 'POS system created' })
  async create(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole,
    @Body() dto: CreatePosSystemDto,
  ) {
    return this.posSystemsService.create(userId, dto, userRole);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update POS system' })
  @ApiResponse({ status: 200, description: 'POS system updated' })
  async update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole,
    @Body() dto: UpdatePosSystemDto,
  ) {
    return this.posSystemsService.update(id, userId, dto, userRole);
  }

  @Patch(':id/admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin update POS system' })
  @ApiResponse({ status: 200, description: 'POS system updated by admin' })
  async adminUpdate(
    @Param('id') id: string,
    @Body() dto: AdminUpdatePosSystemDto,
  ) {
    return this.posSystemsService.adminUpdate(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete POS system' })
  @ApiResponse({ status: 200, description: 'POS system deleted' })
  async delete(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole,
  ) {
    return this.posSystemsService.delete(id, userId, userRole);
  }
}

