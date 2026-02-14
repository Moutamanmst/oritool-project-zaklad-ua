"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstablishmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let EstablishmentsService = class EstablishmentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { businessProfile: true },
        });
        if (!user?.businessProfile) {
            throw new common_1.ForbiddenException('Business profile required');
        }
        const slug = this.generateSlug(dto.name);
        const establishment = await this.prisma.establishment.create({
            data: {
                ...dto,
                slug,
                businessProfileId: user.businessProfile.id,
                status: client_1.EntityStatus.PENDING,
            },
            include: {
                category: true,
                city: true,
                businessProfile: true,
            },
        });
        return establishment;
    }
    async findAll(filters) {
        const { page = 1, limit = 10, search, businessType, categoryId, cityId, minPrice, maxPrice, minRating, status, sortBy = 'createdAt', sortOrder = 'desc', lang = 'uk', } = filters;
        const skip = (page - 1) * limit;
        const where = {
            ...(status ? { status } : { status: client_1.EntityStatus.ACTIVE }),
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
    async findOne(idOrSlug, lang = 'uk') {
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
            throw new common_1.NotFoundException('establishment.notFound');
        }
        await this.prisma.establishment.update({
            where: { id: establishment.id },
            data: { viewCount: { increment: 1 } },
        });
        return this.transformWithLang(establishment, lang);
    }
    async findByBusiness(businessProfileId, filters) {
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
    async update(id, userId, dto) {
        const establishment = await this.prisma.establishment.findUnique({
            where: { id },
            include: { businessProfile: true },
        });
        if (!establishment) {
            throw new common_1.NotFoundException('establishment.notFound');
        }
        if (establishment.businessProfile?.userId !== userId) {
            throw new common_1.ForbiddenException('Not authorized to update this establishment');
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
    async adminUpdate(id, dto) {
        const establishment = await this.prisma.establishment.findUnique({
            where: { id },
        });
        if (!establishment) {
            throw new common_1.NotFoundException('establishment.notFound');
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
    async delete(id, userId, userRole) {
        const establishment = await this.prisma.establishment.findUnique({
            where: { id },
            include: { businessProfile: true },
        });
        if (!establishment) {
            throw new common_1.NotFoundException('establishment.notFound');
        }
        if (userRole !== client_1.UserRole.ADMIN && establishment.businessProfile?.userId !== userId) {
            throw new common_1.ForbiddenException('Not authorized to delete this establishment');
        }
        await this.prisma.establishment.delete({
            where: { id },
        });
        return { message: 'establishment.deleted' };
    }
    async compare(ids, lang = 'uk') {
        const establishments = await this.prisma.establishment.findMany({
            where: {
                id: { in: ids },
                status: client_1.EntityStatus.ACTIVE,
            },
            include: {
                category: true,
                city: true,
                images: { take: 1 },
            },
        });
        return establishments.map((e) => this.transformWithLang(e, lang));
    }
    generateSlug(name) {
        const translitMap = {
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
    transformWithLang(establishment, lang) {
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
};
exports.EstablishmentsService = EstablishmentsService;
exports.EstablishmentsService = EstablishmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EstablishmentsService);
//# sourceMappingURL=establishments.service.js.map