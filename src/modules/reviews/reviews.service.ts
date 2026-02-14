import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewStatus, UserRole } from '@prisma/client';
import { PaginationParams, PaginatedResult } from '../../common/interfaces/pagination.interface';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateReviewDto) {
    if (!dto.establishmentId && !dto.posSystemId) {
      throw new BadRequestException('Either establishmentId or posSystemId is required');
    }

    if (dto.establishmentId && dto.posSystemId) {
      throw new BadRequestException('Only one of establishmentId or posSystemId should be provided');
    }

    const review = await this.prisma.review.create({
      data: {
        content: dto.content,
        pros: dto.pros,
        cons: dto.cons,
        userId,
        establishmentId: dto.establishmentId,
        posSystemId: dto.posSystemId,
        status: ReviewStatus.PENDING,
      },
      include: {
        user: {
          select: {
            id: true,
            profile: {
              select: { firstName: true, lastName: true, avatarUrl: true },
            },
          },
        },
      },
    });

    return review;
  }

  async findByEntity(entityType: 'establishment' | 'posSystem', entityId: string, params: PaginationParams): Promise<PaginatedResult<any>> {
    const { page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const where = {
      status: ReviewStatus.APPROVED,
      ...(entityType === 'establishment' ? { establishmentId: entityId } : { posSystemId: entityId }),
    };

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              profile: {
                select: { firstName: true, lastName: true, avatarUrl: true },
              },
            },
          },
          responses: {
            include: {
              user: {
                select: {
                  id: true,
                  role: true,
                  businessProfile: {
                    select: { companyName: true, logoUrl: true },
                  },
                },
              },
            },
          },
        },
      }),
      this.prisma.review.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: reviews,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async findPending(params: PaginationParams): Promise<PaginatedResult<any>> {
    const { page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const where = { status: ReviewStatus.PENDING };

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'asc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              profile: {
                select: { firstName: true, lastName: true },
              },
            },
          },
          establishment: { select: { id: true, name: true, slug: true } },
          posSystem: { select: { id: true, name: true, slug: true } },
        },
      }),
      this.prisma.review.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: reviews,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async moderate(id: string, status: ReviewStatus) {
    const review = await this.prisma.review.findUnique({ where: { id } });

    if (!review) {
      throw new NotFoundException('review.notFound');
    }

    const updated = await this.prisma.review.update({
      where: { id },
      data: { status },
    });

    if (status === ReviewStatus.APPROVED) {
      await this.updateEntityReviewCount(review);
    }

    return updated;
  }

  async respondToReview(reviewId: string, userId: string, content: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        establishment: { include: { businessProfile: true } },
        posSystem: { include: { businessProfile: true } },
      },
    });

    if (!review) {
      throw new NotFoundException('review.notFound');
    }

    const businessProfileUserId = review.establishment?.businessProfile?.userId || review.posSystem?.businessProfile?.userId;

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (user?.role !== UserRole.ADMIN && businessProfileUserId !== userId) {
      throw new ForbiddenException('Not authorized to respond to this review');
    }

    const response = await this.prisma.reviewResponse.create({
      data: {
        content,
        reviewId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            role: true,
            businessProfile: {
              select: { companyName: true, logoUrl: true },
            },
          },
        },
      },
    });

    return response;
  }

  async delete(id: string, userId: string, userRole: UserRole) {
    const review = await this.prisma.review.findUnique({ where: { id } });

    if (!review) {
      throw new NotFoundException('review.notFound');
    }

    if (userRole !== UserRole.ADMIN && review.userId !== userId) {
      throw new ForbiddenException('Not authorized to delete this review');
    }

    await this.prisma.review.delete({ where: { id } });

    return { message: 'review.deleted' };
  }

  private async updateEntityReviewCount(review: { establishmentId: string | null; posSystemId: string | null }) {
    if (review.establishmentId) {
      const count = await this.prisma.review.count({
        where: { establishmentId: review.establishmentId, status: ReviewStatus.APPROVED },
      });
      await this.prisma.establishment.update({
        where: { id: review.establishmentId },
        data: { reviewCount: count },
      });
    }

    if (review.posSystemId) {
      const count = await this.prisma.review.count({
        where: { posSystemId: review.posSystemId, status: ReviewStatus.APPROVED },
      });
      await this.prisma.posSystem.update({
        where: { id: review.posSystemId },
        data: { reviewCount: count },
      });
    }
  }
}

