import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface CreateAILogDto {
  question: string;
  response: string;
  category?: string;
  userId?: string;
  sessionId: string;
  responseTime: number;
  tokens?: number;
  model?: string;
  userAgent?: string;
  ipAddress?: string;
}

interface AILogsFilter {
  category?: string;
  dateFrom?: Date;
  dateTo?: Date;
  helpful?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class AILogsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateAILogDto) {
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

  async findAll(filter: AILogsFilter) {
    const { 
      category, 
      dateFrom, 
      dateTo, 
      helpful, 
      search,
      page = 1, 
      limit = 50 
    } = filter;

    const where: any = {};

    if (category && category !== 'all') {
      where.category = category;
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = dateFrom;
      if (dateTo) where.createdAt.lte = dateTo;
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

    const [
      totalQueries,
      todayQueries,
      weekQueries,
      monthQueries,
      avgResponseTime,
      helpfulCount,
      notHelpfulCount,
      categoryCounts,
      hourlyDistribution,
    ] = await Promise.all([
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
      this.prisma.$queryRaw`
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

  async updateHelpful(id: string, helpful: boolean) {
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

  private categorizeQuestion(question: string): string {
    const lower = question.toLowerCase();
    
    const categories: Record<string, string[]> = {
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
}
