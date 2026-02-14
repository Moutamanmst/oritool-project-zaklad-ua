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
exports.BlogService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let BlogService = class BlogService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(options) {
        const { status, category, limit = 20, page = 1, sortBy = 'createdAt', sortOrder = 'desc', } = options || {};
        const where = {};
        if (status)
            where.status = status;
        if (category)
            where.category = category;
        const [data, total] = await Promise.all([
            this.prisma.blogArticle.findMany({
                where,
                orderBy: { [sortBy]: sortOrder },
                take: limit,
                skip: (page - 1) * limit,
            }),
            this.prisma.blogArticle.count({ where }),
        ]);
        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(slug) {
        const article = await this.prisma.blogArticle.findUnique({
            where: { slug },
        });
        if (!article) {
            throw new common_1.NotFoundException('Article not found');
        }
        await this.prisma.blogArticle.update({
            where: { slug },
            data: { viewCount: { increment: 1 } },
        });
        return article;
    }
    async findById(id) {
        const article = await this.prisma.blogArticle.findUnique({
            where: { id },
        });
        if (!article) {
            throw new common_1.NotFoundException('Article not found');
        }
        return article;
    }
    async create(data) {
        return this.prisma.blogArticle.create({
            data: {
                ...data,
                publishedAt: data.status === 'ACTIVE' ? new Date() : data.publishedAt,
            },
        });
    }
    async update(id, data) {
        const article = await this.prisma.blogArticle.findUnique({
            where: { id },
        });
        if (!article) {
            throw new common_1.NotFoundException('Article not found');
        }
        if (data.status === 'ACTIVE' && article.status !== 'ACTIVE' && !article.publishedAt) {
            data.publishedAt = new Date();
        }
        return this.prisma.blogArticle.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        const article = await this.prisma.blogArticle.findUnique({
            where: { id },
        });
        if (!article) {
            throw new common_1.NotFoundException('Article not found');
        }
        return this.prisma.blogArticle.delete({
            where: { id },
        });
    }
    async getCategories() {
        const articles = await this.prisma.blogArticle.groupBy({
            by: ['category'],
            _count: true,
        });
        return articles.map((a) => ({
            name: a.category,
            count: a._count,
        }));
    }
};
exports.BlogService = BlogService;
exports.BlogService = BlogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BlogService);
//# sourceMappingURL=blog.service.js.map