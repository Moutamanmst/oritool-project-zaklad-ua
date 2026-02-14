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
exports.TechniciansService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let TechniciansService = class TechniciansService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(options) {
        const { city, specialization, status = 'ACTIVE', limit = 50, page = 1, } = options || {};
        const where = {};
        if (status)
            where.status = status;
        if (city)
            where.city = { contains: city, mode: 'insensitive' };
        if (specialization) {
            where.specializations = { has: specialization };
        }
        const [data, total] = await Promise.all([
            this.prisma.technician.findMany({
                where,
                orderBy: { rating: 'desc' },
                take: limit,
                skip: (page - 1) * limit,
            }),
            this.prisma.technician.count({ where }),
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
    async findOne(id) {
        const technician = await this.prisma.technician.findUnique({
            where: { id },
        });
        if (!technician) {
            throw new common_1.NotFoundException('Technician not found');
        }
        return technician;
    }
    async create(data) {
        return this.prisma.technician.create({ data });
    }
    async update(id, data) {
        const technician = await this.prisma.technician.findUnique({
            where: { id },
        });
        if (!technician) {
            throw new common_1.NotFoundException('Technician not found');
        }
        return this.prisma.technician.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        const technician = await this.prisma.technician.findUnique({
            where: { id },
        });
        if (!technician) {
            throw new common_1.NotFoundException('Technician not found');
        }
        return this.prisma.technician.delete({
            where: { id },
        });
    }
    async getSpecializations() {
        const technicians = await this.prisma.technician.findMany({
            select: { specializations: true },
        });
        const allSpecs = new Set();
        technicians.forEach((t) => {
            t.specializations.forEach((s) => allSpecs.add(s));
        });
        return Array.from(allSpecs);
    }
    async getCities() {
        const technicians = await this.prisma.technician.findMany({
            select: { city: true },
            distinct: ['city'],
            where: { city: { not: null } },
        });
        return technicians.map((t) => t.city).filter(Boolean);
    }
};
exports.TechniciansService = TechniciansService;
exports.TechniciansService = TechniciansService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TechniciansService);
//# sourceMappingURL=technicians.service.js.map