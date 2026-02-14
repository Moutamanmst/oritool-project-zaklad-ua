import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingsService {
  constructor(private prisma: PrismaService) {}

  async createOrUpdate(userId: string, dto: CreateRatingDto) {
    if (!dto.establishmentId && !dto.posSystemId) {
      throw new BadRequestException('Either establishmentId or posSystemId is required');
    }

    if (dto.establishmentId && dto.posSystemId) {
      throw new BadRequestException('Only one of establishmentId or posSystemId should be provided');
    }

    if (dto.establishmentId) {
      return this.rateEstablishment(userId, dto.establishmentId, dto.score);
    }

    return this.ratePosSystem(userId, dto.posSystemId!, dto.score);
  }

  private async rateEstablishment(userId: string, establishmentId: string, score: number) {
    const existingRating = await this.prisma.rating.findUnique({
      where: { userId_establishmentId: { userId, establishmentId } },
    });

    let rating;

    if (existingRating) {
      rating = await this.prisma.rating.update({
        where: { id: existingRating.id },
        data: { score },
      });
    } else {
      rating = await this.prisma.rating.create({
        data: { userId, establishmentId, score },
      });
    }

    await this.updateEstablishmentAverageRating(establishmentId);

    return rating;
  }

  private async ratePosSystem(userId: string, posSystemId: string, score: number) {
    const existingRating = await this.prisma.rating.findUnique({
      where: { userId_posSystemId: { userId, posSystemId } },
    });

    let rating;

    if (existingRating) {
      rating = await this.prisma.rating.update({
        where: { id: existingRating.id },
        data: { score },
      });
    } else {
      rating = await this.prisma.rating.create({
        data: { userId, posSystemId, score },
      });
    }

    await this.updatePosSystemAverageRating(posSystemId);

    return rating;
  }

  private async updateEstablishmentAverageRating(establishmentId: string) {
    const result = await this.prisma.rating.aggregate({
      where: { establishmentId },
      _avg: { score: true },
      _count: { score: true },
    });

    await this.prisma.establishment.update({
      where: { id: establishmentId },
      data: {
        averageRating: result._avg.score || 0,
      },
    });
  }

  private async updatePosSystemAverageRating(posSystemId: string) {
    const result = await this.prisma.rating.aggregate({
      where: { posSystemId },
      _avg: { score: true },
      _count: { score: true },
    });

    await this.prisma.posSystem.update({
      where: { id: posSystemId },
      data: {
        averageRating: result._avg.score || 0,
      },
    });
  }

  async getUserRating(userId: string, entityType: 'establishment' | 'posSystem', entityId: string) {
    const where = entityType === 'establishment'
      ? { userId, establishmentId: entityId }
      : { userId, posSystemId: entityId };

    const rating = await this.prisma.rating.findFirst({ where });

    return rating || { score: 0 };
  }

  async getEntityRatingStats(entityType: 'establishment' | 'posSystem', entityId: string) {
    const where = entityType === 'establishment'
      ? { establishmentId: entityId }
      : { posSystemId: entityId };

    const [stats, distribution] = await Promise.all([
      this.prisma.rating.aggregate({
        where,
        _avg: { score: true },
        _count: { score: true },
      }),
      this.prisma.rating.groupBy({
        by: ['score'],
        where,
        _count: { score: true },
      }),
    ]);

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    distribution.forEach((d) => {
      ratingDistribution[d.score as keyof typeof ratingDistribution] = d._count.score;
    });

    return {
      averageRating: stats._avg.score || 0,
      totalRatings: stats._count.score,
      distribution: ratingDistribution,
    };
  }
}

