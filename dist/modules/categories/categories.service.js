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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let CategoriesService = class CategoriesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(lang = 'uk') {
        const categories = await this.prisma.category.findMany({
            where: { isActive: true, parentId: null },
            orderBy: { order: 'asc' },
            include: {
                children: {
                    where: { isActive: true },
                    orderBy: { order: 'asc' },
                },
            },
        });
        return categories.map((c) => this.transformWithLang(c, lang));
    }
    async findOne(idOrSlug, lang = 'uk') {
        const category = await this.prisma.category.findFirst({
            where: {
                OR: [{ id: idOrSlug }, { slug: idOrSlug }],
                isActive: true,
            },
            include: {
                children: {
                    where: { isActive: true },
                    orderBy: { order: 'asc' },
                },
                parent: true,
            },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        return this.transformWithLang(category, lang);
    }
    async create(data) {
        return this.prisma.category.create({ data });
    }
    async update(id, data) {
        const category = await this.prisma.category.findUnique({ where: { id } });
        if (!category)
            throw new common_1.NotFoundException('Category not found');
        return this.prisma.category.update({ where: { id }, data });
    }
    async delete(id) {
        const category = await this.prisma.category.findUnique({ where: { id } });
        if (!category)
            throw new common_1.NotFoundException('Category not found');
        await this.prisma.category.update({ where: { id }, data: { isActive: false } });
        return { message: 'Category deleted' };
    }
    transformWithLang(category, lang) {
        const isRu = lang === 'ru';
        return {
            ...category,
            name: isRu && category.nameRu ? category.nameRu : category.name,
            description: isRu && category.descriptionRu ? category.descriptionRu : category.description,
            children: category.children?.map((c) => ({
                ...c,
                name: isRu && c.nameRu ? c.nameRu : c.name,
                description: isRu && c.descriptionRu ? c.descriptionRu : c.description,
            })),
        };
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map