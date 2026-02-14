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
exports.RatingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let RatingsService = class RatingsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createOrUpdate(userId, dto) {
        if (!dto.establishmentId && !dto.posSystemId) {
            throw new common_1.BadRequestException('Either establishmentId or posSystemId is required');
        }
        if (dto.establishmentId && dto.posSystemId) {
            throw new common_1.BadRequestException('Only one of establishmentId or posSystemId should be provided');
        }
        if (dto.establishmentId) {
            return this.rateEstablishment(userId, dto.establishmentId, dto.score);
        }
        return this.ratePosSystem(userId, dto.posSystemId, dto.score);
    }
    async rateEstablishment(userId, establishmentId, score) {
        const existingRating = await this.prisma.rating.findUnique({
            where: { userId_establishmentId: { userId, establishmentId } },
        });
        let rating;
        if (existingRating) {
            rating = await this.prisma.rating.update({
                where: { id: existingRating.id },
                data: { score },
            });
        }
        else {
            rating = await this.prisma.rating.create({
                data: { userId, establishmentId, score },
            });
        }
        await this.updateEstablishmentAverageRating(establishmentId);
        return rating;
    }
    async ratePosSystem(userId, posSystemId, score) {
        const existingRating = await this.prisma.rating.findUnique({
            where: { userId_posSystemId: { userId, posSystemId } },
        });
        let rating;
        if (existingRating) {
            rating = await this.prisma.rating.update({
                where: { id: existingRating.id },
                data: { score },
            });
        }
        else {
            rating = await this.prisma.rating.create({
                data: { userId, posSystemId, score },
            });
        }
        await this.updatePosSystemAverageRating(posSystemId);
        return rating;
    }
    async updateEstablishmentAverageRating(establishmentId) {
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
    async updatePosSystemAverageRating(posSystemId) {
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
    async getUserRating(userId, entityType, entityId) {
        const where = entityType === 'establishment'
            ? { userId, establishmentId: entityId }
            : { userId, posSystemId: entityId };
        const rating = await this.prisma.rating.findFirst({ where });
        return rating || { score: 0 };
    }
    async getEntityRatingStats(entityType, entityId) {
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
            ratingDistribution[d.score] = d._count.score;
        });
        return {
            averageRating: stats._avg.score || 0,
            totalRatings: stats._count.score,
            distribution: ratingDistribution,
        };
    }
};
exports.RatingsService = RatingsService;
exports.RatingsService = RatingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RatingsService);
//# sourceMappingURL=ratings.service.js.map