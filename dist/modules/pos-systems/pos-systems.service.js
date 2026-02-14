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
exports.PosSystemsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let PosSystemsService = class PosSystemsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto, userRole) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { businessProfile: true },
        });
        if (userRole !== 'ADMIN' && !user?.businessProfile) {
            throw new common_1.ForbiddenException('Business profile required');
        }
        const slug = this.generateSlug(dto.name);
        const posSystem = await this.prisma.posSystem.create({
            data: {
                ...dto,
                slug,
                businessProfileId: user?.businessProfile?.id || null,
                status: userRole === 'ADMIN' ? client_1.EntityStatus.ACTIVE : client_1.EntityStatus.PENDING,
            },
            include: {
                category: true,
                businessProfile: true,
            },
        });
        return posSystem;
    }
    async findAll(filters) {
        const { page = 1, limit = 10, search, categoryId, minPrice, maxPrice, minRating, features, integrations, sortBy = 'createdAt', sortOrder = 'desc', lang = 'uk', } = filters;
        const skip = (page - 1) * limit;
        const where = {
            status: client_1.EntityStatus.ACTIVE,
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
                const posFeatures = pos.features || [];
                return features.some((f) => posFeatures.includes(f));
            });
        }
        if (integrations?.length) {
            filteredSystems = filteredSystems.filter((pos) => {
                const posIntegrations = pos.integrations || [];
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
    async findOne(idOrSlug, lang = 'uk') {
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
            throw new common_1.NotFoundException('posSystem.notFound');
        }
        await this.prisma.posSystem.update({
            where: { id: posSystem.id },
            data: { viewCount: { increment: 1 } },
        });
        return this.transformWithLang(posSystem, lang);
    }
    async findByBusiness(businessProfileId, filters) {
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
    async update(id, userId, dto, userRole) {
        const posSystem = await this.prisma.posSystem.findUnique({
            where: { id },
            include: { businessProfile: true },
        });
        if (!posSystem) {
            throw new common_1.NotFoundException('posSystem.notFound');
        }
        if (userRole !== 'ADMIN' && posSystem.businessProfile?.userId !== userId) {
            throw new common_1.ForbiddenException('Not authorized to update this POS system');
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
    async adminUpdate(id, dto) {
        const posSystem = await this.prisma.posSystem.findUnique({
            where: { id },
        });
        if (!posSystem) {
            throw new common_1.NotFoundException('posSystem.notFound');
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
    async delete(id, userId, userRole) {
        const posSystem = await this.prisma.posSystem.findUnique({
            where: { id },
            include: { businessProfile: true },
        });
        if (!posSystem) {
            throw new common_1.NotFoundException('posSystem.notFound');
        }
        if (userRole !== client_1.UserRole.ADMIN && posSystem.businessProfile?.userId !== userId) {
            throw new common_1.ForbiddenException('Not authorized to delete this POS system');
        }
        await this.prisma.posSystem.delete({
            where: { id },
        });
        return { message: 'posSystem.deleted' };
    }
    async compare(ids, lang = 'uk') {
        const posSystems = await this.prisma.posSystem.findMany({
            where: {
                id: { in: ids },
                status: client_1.EntityStatus.ACTIVE,
            },
            include: {
                category: true,
                images: { take: 1 },
            },
        });
        return posSystems.map((p) => this.transformWithLang(p, lang));
    }
    generateSlug(name) {
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9а-яіїєґ\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        return `${slug}-${Date.now().toString(36)}`;
    }
    transformWithLang(posSystem, lang) {
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
};
exports.PosSystemsService = PosSystemsService;
exports.PosSystemsService = PosSystemsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PosSystemsService);
//# sourceMappingURL=pos-systems.service.js.map