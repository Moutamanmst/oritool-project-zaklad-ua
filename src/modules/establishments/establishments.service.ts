import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateEstablishmentDto,
  UpdateEstablishmentDto,
  AdminUpdateEstablishmentDto,
  FilterEstablishmentDto,
} from './dto';
import { EntityStatus, UserRole, Prisma } from '@prisma/client';
import { PaginatedResult } from '../../common/interfaces/pagination.interface';

@Injectable()
export class EstablishmentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateEstablishmentDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { businessProfile: true },
    });

    if (!user?.businessProfile) {
      throw new ForbiddenException('Business profile required');
    }

    const slug = this.generateSlug(dto.name);

    const establishment = await this.prisma.establishment.create({
      data: {
        ...dto,
        slug,
        businessProfileId: user.businessProfile.id,
        status: EntityStatus.PENDING,
      },
      include: {
        category: true,
        city: true,
        businessProfile: true,
      },
    });

    return establishment;
  }

  async findAll(filters: FilterEstablishmentDto): Promise<PaginatedResult<any>> {
    const {
      page = 1,
      limit = 10,
      search,
      businessType,
      categoryId,
      cityId,
      minPrice,
      maxPrice,
      minRating,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      lang = 'uk',
    } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.EstablishmentWhereInput = {
      ...(status ? { status } : { status: EntityStatus.ACTIVE }),
      ...(businessType && { businessType }),
      ...(categoryId && { categoryId }),
      ...(cityId && { cityId }),
      ...(minPrice && { priceRange: { gte: minPrice } }),
      ...(maxPrice && { priceRange: { lte: maxPrice } }),
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

    const [establishments, total] = await Promise.all([
      this.prisma.establishment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          category: true,
          city: true,
          images: { take: 5, orderBy: { order: 'asc' } },
        },
      }),
      this.prisma.establishment.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: establishments.map((e) => this.transformWithLang(e, lang)),
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
    const establishment = await this.prisma.establishment.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        category: true,
        city: true,
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

    if (!establishment) {
      throw new NotFoundException('establishment.notFound');
    }

    await this.prisma.establishment.update({
      where: { id: establishment.id },
      data: { viewCount: { increment: 1 } },
    });

    return this.transformWithLang(establishment, lang);
  }

  async findByBusiness(businessProfileId: string, filters: FilterEstablishmentDto) {
    const { page = 1, limit = 10, lang = 'uk' } = filters;
    const skip = (page - 1) * limit;

    const [establishments, total] = await Promise.all([
      this.prisma.establishment.findMany({
        where: { businessProfileId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          city: true,
          images: { take: 3 },
        },
      }),
      this.prisma.establishment.count({ where: { businessProfileId } }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: establishments.map((e) => this.transformWithLang(e, lang)),
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

  async update(id: string, userId: string, dto: UpdateEstablishmentDto) {
    const establishment = await this.prisma.establishment.findUnique({
      where: { id },
      include: { businessProfile: true },
    });

    if (!establishment) {
      throw new NotFoundException('establishment.notFound');
    }

    if (establishment.businessProfile?.userId !== userId) {
      throw new ForbiddenException('Not authorized to update this establishment');
    }

    const updated = await this.prisma.establishment.update({
      where: { id },
      data: dto,
      include: {
        category: true,
        city: true,
        images: true,
      },
    });

    return updated;
  }

  async adminUpdate(id: string, dto: AdminUpdateEstablishmentDto) {
    const establishment = await this.prisma.establishment.findUnique({
      where: { id },
    });

    if (!establishment) {
      throw new NotFoundException('establishment.notFound');
    }

    const updated = await this.prisma.establishment.update({
      where: { id },
      data: dto,
      include: {
        category: true,
        city: true,
        businessProfile: true,
      },
    });

    return updated;
  }

  async delete(id: string, userId: string, userRole: UserRole) {
    const establishment = await this.prisma.establishment.findUnique({
      where: { id },
      include: { businessProfile: true },
    });

    if (!establishment) {
      throw new NotFoundException('establishment.notFound');
    }

    if (userRole !== UserRole.ADMIN && establishment.businessProfile?.userId !== userId) {
      throw new ForbiddenException('Not authorized to delete this establishment');
    }

    await this.prisma.establishment.delete({
      where: { id },
    });

    return { message: 'establishment.deleted' };
  }

  async compare(ids: string[], lang: string = 'uk') {
    const establishments = await this.prisma.establishment.findMany({
      where: {
        id: { in: ids },
        status: EntityStatus.ACTIVE,
      },
      include: {
        category: true,
        city: true,
        images: { take: 1 },
      },
    });

    return establishments.map((e) => this.transformWithLang(e, lang));
  }

  private generateSlug(name: string): string {
    const translitMap: Record<string, string> = {
      а: 'a', б: 'b', в: 'v', г: 'h', ґ: 'g', д: 'd', е: 'e', є: 'ye',
      ж: 'zh', з: 'z', и: 'y', і: 'i', ї: 'yi', й: 'y', к: 'k', л: 'l',
      м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u',
      ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ь: '',
      ю: 'yu', я: 'ya', ' ': '-',
    };

    const slug = name
      .toLowerCase()
      .split('')
      .map((char) => translitMap[char] || char)
      .join('')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    return `${slug}-${Date.now().toString(36)}`;
  }

  private transformWithLang(establishment: any, lang: string) {
    const isRu = lang === 'ru';

    return {
      ...establishment,
      name: isRu && establishment.nameRu ? establishment.nameRu : establishment.name,
      description: isRu && establishment.descriptionRu ? establishment.descriptionRu : establishment.description,
      address: isRu && establishment.addressRu ? establishment.addressRu : establishment.address,
      category: establishment.category
        ? {
            ...establishment.category,
            name: isRu && establishment.category.nameRu ? establishment.category.nameRu : establishment.category.name,
          }
        : null,
      city: establishment.city
        ? {
            ...establishment.city,
            name: isRu && establishment.city.nameRu ? establishment.city.nameRu : establishment.city.name,
          }
        : null,
    };
  }
}

