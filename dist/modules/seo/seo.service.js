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
exports.SeoService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let SeoService = class SeoService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSettings() {
        let settings = await this.prisma.seoSettings.findFirst();
        if (!settings) {
            settings = await this.prisma.seoSettings.create({
                data: {
                    siteName: 'ZakladUA',
                    siteDescription: 'B2B платформа для ресторанного бізнесу в Україні',
                    siteUrl: 'https://zaklad.ua',
                },
            });
        }
        return settings;
    }
    async updateSettings(data) {
        const existing = await this.prisma.seoSettings.findFirst();
        if (existing) {
            return this.prisma.seoSettings.update({
                where: { id: existing.id },
                data,
            });
        }
        return this.prisma.seoSettings.create({ data });
    }
    async getPageSeo(path) {
        return this.prisma.pageSeo.findUnique({
            where: { path },
        });
    }
    async getAllPageSeo() {
        return this.prisma.pageSeo.findMany({
            orderBy: { path: 'asc' },
        });
    }
    async upsertPageSeo(path, data) {
        return this.prisma.pageSeo.upsert({
            where: { path },
            update: data,
            create: { path, ...data },
        });
    }
    async deletePageSeo(path) {
        return this.prisma.pageSeo.delete({
            where: { path },
        });
    }
};
exports.SeoService = SeoService;
exports.SeoService = SeoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SeoService);
//# sourceMappingURL=seo.service.js.map