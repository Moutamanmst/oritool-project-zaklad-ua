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
exports.AILogsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AILogsService = class AILogsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.aILog.create({
            data: {
                question: data.question,
                response: data.response,
                category: data.category || this.categorizeQuestion(data.question),
                userId: data.userId,
                sessionId: data.sessionId,
                responseTime: data.responseTime,
                tokens: data.tokens || 0,
                model: data.model || 'gpt-4o-mini',
                userAgent: data.userAgent,
                ipAddress: data.ipAddress,
            },
        });
    }
    async findAll(filter) {
        const { category, dateFrom, dateTo, helpful, search, page = 1, limit = 50 } = filter;
        const where = {};
        if (category && category !== 'all') {
            where.category = category;
        }
        if (dateFrom || dateTo) {
            where.createdAt = {};
            if (dateFrom)
                where.createdAt.gte = dateFrom;
            if (dateTo)
                where.createdAt.lte = dateTo;
        }
        if (helpful !== undefined) {
            where.helpful = helpful;
        }
        if (search) {
            where.OR = [
                { question: { contains: search, mode: 'insensitive' } },
                { response: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [data, total] = await Promise.all([
            this.prisma.aILog.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            profile: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                },
                            },
                        },
                    },
                },
            }),
            this.prisma.aILog.count({ where }),
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
    async getStats() {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const [totalQueries, todayQueries, weekQueries, monthQueries, avgResponseTime, helpfulCount, notHelpfulCount, categoryCounts, hourlyDistribution,] = await Promise.all([
            this.prisma.aILog.count(),
            this.prisma.aILog.count({
                where: { createdAt: { gte: todayStart } },
            }),
            this.prisma.aILog.count({
                where: { createdAt: { gte: weekAgo } },
            }),
            this.prisma.aILog.count({
                where: { createdAt: { gte: monthAgo } },
            }),
            this.prisma.aILog.aggregate({
                _avg: { responseTime: true },
            }),
            this.prisma.aILog.count({
                where: { helpful: true },
            }),
            this.prisma.aILog.count({
                where: { helpful: false },
            }),
            this.prisma.aILog.groupBy({
                by: ['category'],
                _count: { id: true },
                orderBy: { _count: { id: 'desc' } },
                take: 10,
            }),
            this.prisma.$queryRaw `
        SELECT 
          EXTRACT(HOUR FROM "createdAt") as hour,
          COUNT(*) as count
        FROM ai_logs
        WHERE "createdAt" >= ${weekAgo}
        GROUP BY EXTRACT(HOUR FROM "createdAt")
        ORDER BY hour
      `,
        ]);
        const ratedCount = helpfulCount + notHelpfulCount;
        const helpfulRate = ratedCount > 0 ? Math.round((helpfulCount / ratedCount) * 100) : 0;
        return {
            totalQueries,
            todayQueries,
            weekQueries,
            monthQueries,
            avgResponseTime: Math.round(avgResponseTime._avg?.responseTime || 0),
            helpfulRate,
            helpfulCount,
            notHelpfulCount,
            topCategories: categoryCounts.map((c) => ({
                name: c.category || 'Інше',
                count: c._count.id,
            })),
            hourlyDistribution: hourlyDistribution || [],
            avgPerDay: Math.round(weekQueries / 7),
        };
    }
    async updateHelpful(id, helpful) {
        return this.prisma.aILog.update({
            where: { id },
            data: { helpful },
        });
    }
    async getCategories() {
        const categories = await this.prisma.aILog.groupBy({
            by: ['category'],
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
        });
        return categories.map((c) => ({
            name: c.category || 'Інше',
            count: c._count.id,
        }));
    }
    categorizeQuestion(question) {
        const lower = question.toLowerCase();
        const categories = {
            'POS-системи': ['pos', 'poster', 'iiko', 'r-keeper', 'goovii', 'syrve', 'каса', 'касов'],
            'Порівняння': ['порівня', 'краще', 'різниц', 'vs', 'чи'],
            'Ціни': ['ціна', 'кошту', 'скільки', 'вартість', 'тариф', 'оплат'],
            'Інтеграції': ['інтегра', 'підключ', 'api', 'glovo', 'bolt', 'прро'],
            'Обладнання': ['облад', 'кухн', 'холодиль', 'піч', 'плит'],
            'Доставка': ['достав', 'кур\'єр', 'delivery'],
            'Персонал': ['персонал', 'офіціант', 'кухар', 'найм', 'зарплат'],
            'Маркетинг': ['маркетинг', 'реклам', 'просуван', 'smm', 'instagram'],
            'Меню': ['меню', 'страв', 'рецепт', 'фудкост'],
            'Відкриття': ['відкрит', 'запуск', 'старт', 'бізнес-план'],
            'Постачальники': ['постачальник', 'metro', 'продукт', 'закупівл'],
            'Фінанси': ['фінанс', 'прибут', 'облік', 'бухгалтер'],
            'Загальне': [],
        };
        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some((kw) => lower.includes(kw))) {
                return category;
            }
        }
        return 'Загальне';
    }
};
exports.AILogsService = AILogsService;
exports.AILogsService = AILogsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AILogsService);
//# sourceMappingURL=ai-logs.service.js.map