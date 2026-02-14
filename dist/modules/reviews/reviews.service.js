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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ReviewsService = class ReviewsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        if (!dto.establishmentId && !dto.posSystemId) {
            throw new common_1.BadRequestException('Either establishmentId or posSystemId is required');
        }
        if (dto.establishmentId && dto.posSystemId) {
            throw new common_1.BadRequestException('Only one of establishmentId or posSystemId should be provided');
        }
        const review = await this.prisma.review.create({
            data: {
                content: dto.content,
                pros: dto.pros,
                cons: dto.cons,
                userId,
                establishmentId: dto.establishmentId,
                posSystemId: dto.posSystemId,
                status: client_1.ReviewStatus.PENDING,
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
    async findByEntity(entityType, entityId, params) {
        const { page = 1, limit = 10 } = params;
        const skip = (page - 1) * limit;
        const where = {
            status: client_1.ReviewStatus.APPROVED,
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
    async findPending(params) {
        const { page = 1, limit = 10 } = params;
        const skip = (page - 1) * limit;
        const where = { status: client_1.ReviewStatus.PENDING };
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
    async moderate(id, status) {
        const review = await this.prisma.review.findUnique({ where: { id } });
        if (!review) {
            throw new common_1.NotFoundException('review.notFound');
        }
        const updated = await this.prisma.review.update({
            where: { id },
            data: { status },
        });
        if (status === client_1.ReviewStatus.APPROVED) {
            await this.updateEntityReviewCount(review);
        }
        return updated;
    }
    async respondToReview(reviewId, userId, content) {
        const review = await this.prisma.review.findUnique({
            where: { id: reviewId },
            include: {
                establishment: { include: { businessProfile: true } },
                posSystem: { include: { businessProfile: true } },
            },
        });
        if (!review) {
            throw new common_1.NotFoundException('review.notFound');
        }
        const businessProfileUserId = review.establishment?.businessProfile?.userId || review.posSystem?.businessProfile?.userId;
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (user?.role !== client_1.UserRole.ADMIN && businessProfileUserId !== userId) {
            throw new common_1.ForbiddenException('Not authorized to respond to this review');
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
    async delete(id, userId, userRole) {
        const review = await this.prisma.review.findUnique({ where: { id } });
        if (!review) {
            throw new common_1.NotFoundException('review.notFound');
        }
        if (userRole !== client_1.UserRole.ADMIN && review.userId !== userId) {
            throw new common_1.ForbiddenException('Not authorized to delete this review');
        }
        await this.prisma.review.delete({ where: { id } });
        return { message: 'review.deleted' };
    }
    async updateEntityReviewCount(review) {
        if (review.establishmentId) {
            const count = await this.prisma.review.count({
                where: { establishmentId: review.establishmentId, status: client_1.ReviewStatus.APPROVED },
            });
            await this.prisma.establishment.update({
                where: { id: review.establishmentId },
                data: { reviewCount: count },
            });
        }
        if (review.posSystemId) {
            const count = await this.prisma.review.count({
                where: { posSystemId: review.posSystemId, status: client_1.ReviewStatus.APPROVED },
            });
            await this.prisma.posSystem.update({
                where: { id: review.posSystemId },
                data: { reviewCount: count },
            });
        }
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map