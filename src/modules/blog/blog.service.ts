import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EntityStatus } from '@prisma/client';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async findAll(options?: {
    status?: string;
    category?: string;
    limit?: number;
    page?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const {
      status,
      category,
      limit = 20,
      page = 1,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = options || {};

    const where: any = {};
    if (status) where.status = status;
    if (category) where.category = category;

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

  async findOne(slug: string) {
    const article = await this.prisma.blogArticle.findUnique({
      where: { slug },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    // Increment view count
    await this.prisma.blogArticle.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    });

    return article;
  }

  async findById(id: string) {
    const article = await this.prisma.blogArticle.findUnique({
      where: { id },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return article;
  }

  async create(data: {
    slug: string;
    title: string;
    titleRu?: string;
    excerpt?: string;
    excerptRu?: string;
    content: string;
    contentRu?: string;
    coverImage?: string;
    category: string;
    tags?: string[];
    author?: string;
    status?: EntityStatus;
    isFeatured?: boolean;
    publishedAt?: Date;
  }) {
    return this.prisma.blogArticle.create({
      data: {
        ...data,
        publishedAt: data.status === 'ACTIVE' ? new Date() : data.publishedAt,
      },
    });
  }

  async update(id: string, data: any) {
    const article = await this.prisma.blogArticle.findUnique({
      where: { id },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    // If status changes to ACTIVE, set publishedAt
    if (data.status === 'ACTIVE' && article.status !== 'ACTIVE' && !article.publishedAt) {
      data.publishedAt = new Date();
    }

    return this.prisma.blogArticle.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    const article = await this.prisma.blogArticle.findUnique({
      where: { id },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
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
}
