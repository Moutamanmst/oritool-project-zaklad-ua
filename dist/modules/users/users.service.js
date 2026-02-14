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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(params) {
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
                where: { role: { not: client_1.UserRole.ADMIN } },
            }),
            this.prisma.user.count({ where: { role: { not: client_1.UserRole.ADMIN } } }),
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
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                profile: true,
                businessProfile: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('user.notFound');
        }
        return this.sanitizeUser(user);
    }
    async updateProfile(userId, dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('user.notFound');
        }
        if (user.profile) {
            await this.prisma.userProfile.update({
                where: { userId },
                data: dto,
            });
        }
        else {
            await this.prisma.userProfile.create({
                data: {
                    userId,
                    ...dto,
                },
            });
        }
        return this.findOne(userId);
    }
    async updateBusinessProfile(userId, dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { businessProfile: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('user.notFound');
        }
        if (user.role !== client_1.UserRole.BUSINESS) {
            throw new common_1.ForbiddenException('Only business users can update business profile');
        }
        if (user.businessProfile) {
            await this.prisma.businessProfile.update({
                where: { userId },
                data: dto,
            });
        }
        return this.findOne(userId);
    }
    async adminUpdate(userId, dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('user.notFound');
        }
        await this.prisma.user.update({
            where: { id: userId },
            data: dto,
        });
        return this.findOne(userId);
    }
    async verifyBusiness(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { businessProfile: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('user.notFound');
        }
        if (user.role !== client_1.UserRole.BUSINESS) {
            throw new common_1.ForbiddenException('User is not a business account');
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
    async delete(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('user.notFound');
        }
        await this.prisma.user.delete({
            where: { id: userId },
        });
        return { message: 'user.deleted' };
    }
    sanitizeUser(user) {
        const { password, ...result } = user;
        return result;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map