import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('ratings')
@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rate an establishment or POS system' })
  @ApiResponse({ status: 200, description: 'Rating created or updated' })
  async rate(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateRatingDto,
  ) {
    return this.ratingsService.createOrUpdate(userId, dto);
  }

  @Get('my/establishment/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my rating for an establishment' })
  async getMyEstablishmentRating(
    @CurrentUser('id') userId: string,
    @Param('id') establishmentId: string,
  ) {
    return this.ratingsService.getUserRating(userId, 'establishment', establishmentId);
  }

  @Get('my/pos-system/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my rating for a POS system' })
  async getMyPosSystemRating(
    @CurrentUser('id') userId: string,
    @Param('id') posSystemId: string,
  ) {
    return this.ratingsService.getUserRating(userId, 'posSystem', posSystemId);
  }

  @Get('stats/establishment/:id')
  @Public()
  @ApiOperation({ summary: 'Get rating statistics for an establishment' })
  async getEstablishmentStats(@Param('id') id: string) {
    return this.ratingsService.getEntityRatingStats('establishment', id);
  }

  @Get('stats/pos-system/:id')
  @Public()
  @ApiOperation({ summary: 'Get rating statistics for a POS system' })
  async getPosSystemStats(@Param('id') id: string) {
    return this.ratingsService.getEntityRatingStats('posSystem', id);
  }
}

