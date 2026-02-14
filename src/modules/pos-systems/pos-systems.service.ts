import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreatePosSystemDto,
  UpdatePosSystemDto,
  AdminUpdatePosSystemDto,
  FilterPosSystemDto,
} from './dto';
import { EntityStatus, UserRole, Prisma } from '@prisma/client';
import { PaginatedResult } from '../../common/interfaces/pagination.interface';

@Injectable()
export class PosSystemsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreatePosSystemDto, userRole?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { businessProfile: true },
    });

    // Admins don't need business profile
    if (userRole !== 'ADMIN' && !user?.businessProfile) {
      throw new ForbiddenException('Business profile required');
    }

    const slug = this.generateSlug(dto.name);

    const posSystem = await this.prisma.posSystem.create({
      data: {
        ...dto,
        slug,
        businessProfileId: user?.businessProfile?.id || null,
        // Admins can create with ACTIVE status
        status: userRole === 'ADMIN' ? EntityStatus.ACTIVE : EntityStatus.PENDING,
      },
      include: {
        category: true,
        businessProfile: true,
      },
    });

    return posSystem;
  }

  async findAll(filters: FilterPosSystemDto): Promise<PaginatedResult<any>> {
    const {
      page = 1,
      limit = 10,
      search,
      categoryId,
      minPrice,
      maxPrice,
      minRating,
      features,
      integrations,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      lang = 'uk',
    } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.PosSystemWhereInput = {
      status: EntityStatus.ACTIVE,
      ...(categoryId && { categoryId }),
      ...(minPrice !== undefined && { priceFrom: { gte: minPrice } }),
      ...(maxPrice !== undefined && { priceTo: { lte: maxPrice } }),
      ...(minRating && { averageRating: { gte: minRating } }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { nameRu: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { descriptionRu: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [posSystems, total] = await Promise.all([
      this.prisma.posSystem.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          category: true,
          images: { take: 3, orderBy: { order: 'asc' } },
        },
      }),
      this.prisma.posSystem.count({ where }),
    ]);

    let filteredSystems = posSystems;

    if (features?.length) {
      filteredSystems = filteredSystems.filter((pos) => {
        const posFeatures = (pos.features as string[]) || [];
        return features.some((f) => posFeatures.includes(f));
      });
    }

    if (integrations?.length) {
      filteredSystems = filteredSystems.filter((pos) => {
        const posIntegrations = (pos.integrations as string[]) || [];
        return integrations.some((i) => posIntegrations.includes(i));
      });
    }

    const totalPages = Math.ceil(total / limit);

    return {
      data: filteredSystems.map((p) => this.transformWithLang(p, lang)),
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

  async findOne(idOrSlug: string, lang: string = 'uk') {
    const posSystem = await this.prisma.posSystem.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        category: true,
        businessProfile: {
          select: {
            id: true,
            companyName: true,
            companyNameRu: true,
            logoUrl: true,
            isVerified: true,
          },
        },
        images: { orderBy: { order: 'asc' } },
        reviews: {
          where: { status: 'APPROVED' },
          take: 5,
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
          },
        },
      },
    });

    if (!posSystem) {
      throw new NotFoundException('posSystem.notFound');
    }

    await this.prisma.posSystem.update({
      where: { id: posSystem.id },
      data: { viewCount: { increment: 1 } },
    });

    return this.transformWithLang(posSystem, lang);
  }

  async findByBusiness(businessProfileId: string, filters: FilterPosSystemDto) {
    const { page = 1, limit = 10, lang = 'uk' } = filters;
    const skip = (page - 1) * limit;

    const [posSystems, total] = await Promise.all([
      this.prisma.posSystem.findMany({
        where: { businessProfileId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          images: { take: 1 },
        },
      }),
      this.prisma.posSystem.count({ where: { businessProfileId } }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: posSystems.map((p) => this.transformWithLang(p, lang)),
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

  async update(id: string, userId: string, dto: UpdatePosSystemDto, userRole?: string) {
    const posSystem = await this.prisma.posSystem.findUnique({
      where: { id },
      include: { businessProfile: true },
    });

    if (!posSystem) {
      throw new NotFoundException('posSystem.notFound');
    }

    // Allow admins to update any POS system
    if (userRole !== 'ADMIN' && posSystem.businessProfile?.userId !== userId) {
      throw new ForbiddenException('Not authorized to update this POS system');
    }

    const updated = await this.prisma.posSystem.update({
      where: { id },
      data: dto,
      include: {
        category: true,
        images: true,
      },
    });

    return updated;
  }

  async adminUpdate(id: string, dto: AdminUpdatePosSystemDto) {
    const posSystem = await this.prisma.posSystem.findUnique({
      where: { id },
    });

    if (!posSystem) {
      throw new NotFoundException('posSystem.notFound');
    }

    const updated = await this.prisma.posSystem.update({
      where: { id },
      data: dto,
      include: {
        category: true,
        businessProfile: true,
      },
    });

    return updated;
  }

  async delete(id: string, userId: string, userRole: UserRole) {
    const posSystem = await this.prisma.posSystem.findUnique({
      where: { id },
      include: { businessProfile: true },
    });

    if (!posSystem) {
      throw new NotFoundException('posSystem.notFound');
    }

    if (userRole !== UserRole.ADMIN && posSystem.businessProfile?.userId !== userId) {
      throw new ForbiddenException('Not authorized to delete this POS system');
    }

    await this.prisma.posSystem.delete({
      where: { id },
    });

    return { message: 'posSystem.deleted' };
  }

  async compare(ids: string[], lang: string = 'uk') {
    const posSystems = await this.prisma.posSystem.findMany({
      where: {
        id: { in: ids },
        status: EntityStatus.ACTIVE,
      },
      include: {
        category: true,
        images: { take: 1 },
      },
    });

    return posSystems.map((p) => this.transformWithLang(p, lang));
  }

  private generateSlug(name: string): string {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9а-яіїєґ\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    return `${slug}-${Date.now().toString(36)}`;
  }

  private transformWithLang(posSystem: any, lang: string) {
    const isRu = lang === 'ru';

    return {
      ...posSystem,
      name: isRu && posSystem.nameRu ? posSystem.nameRu : posSystem.name,
      description: isRu && posSystem.descriptionRu ? posSystem.descriptionRu : posSystem.description,
      shortDescription: isRu && posSystem.shortDescriptionRu ? posSystem.shortDescriptionRu : posSystem.shortDescription,
      category: posSystem.category
        ? {
            ...posSystem.category,
            name: isRu && posSystem.category.nameRu ? posSystem.category.nameRu : posSystem.category.name,
          }
        : null,
    };
  }
}

