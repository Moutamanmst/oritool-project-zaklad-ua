import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserProfileDto, UpdateBusinessProfileDto, AdminUpdateUserDto } from './dto';
import { UserRole } from '@prisma/client';
import { PaginationParams, PaginatedResult } from '../../common/interfaces/pagination.interface';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: PaginationParams): Promise<PaginatedResult<any>> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = params;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          profile: true,
          businessProfile: true,
        },
        where: { role: { not: UserRole.ADMIN } },
      }),
      this.prisma.user.count({ where: { role: { not: UserRole.ADMIN } } }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: users.map((user) => this.sanitizeUser(user)),
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

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        businessProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('user.notFound');
    }

    return this.sanitizeUser(user);
  }

  async updateProfile(userId: string, dto: UpdateUserProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException('user.notFound');
    }

    if (user.profile) {
      await this.prisma.userProfile.update({
        where: { userId },
        data: dto,
      });
    } else {
      await this.prisma.userProfile.create({
        data: {
          userId,
          ...dto,
        },
      });
    }

    return this.findOne(userId);
  }

  async updateBusinessProfile(userId: string, dto: UpdateBusinessProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { businessProfile: true },
    });

    if (!user) {
      throw new NotFoundException('user.notFound');
    }

    if (user.role !== UserRole.BUSINESS) {
      throw new ForbiddenException('Only business users can update business profile');
    }

    if (user.businessProfile) {
      await this.prisma.businessProfile.update({
        where: { userId },
        data: dto,
      });
    }

    return this.findOne(userId);
  }

  async adminUpdate(userId: string, dto: AdminUpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('user.notFound');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });

    return this.findOne(userId);
  }

  async verifyBusiness(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { businessProfile: true },
    });

    if (!user) {
      throw new NotFoundException('user.notFound');
    }

    if (user.role !== UserRole.BUSINESS) {
      throw new ForbiddenException('User is not a business account');
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { isVerified: true },
      }),
      this.prisma.businessProfile.update({
        where: { userId },
        data: { isVerified: true, verifiedAt: new Date() },
      }),
    ]);

    return this.findOne(userId);
  }

  async delete(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('user.notFound');
    }

    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'user.deleted' };
  }

  private sanitizeUser(user: any) {
    const { password, ...result } = user;
    return result;
  }
}

