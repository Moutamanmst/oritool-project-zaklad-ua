import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(lang: string = 'uk') {
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

  async findOne(idOrSlug: string, lang: string = 'uk') {
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
      throw new NotFoundException('Category not found');
    }

    return this.transformWithLang(category, lang);
  }

  async create(data: { slug: string; name: string; nameRu?: string; description?: string; descriptionRu?: string; icon?: string; parentId?: string; order?: number }) {
    return this.prisma.category.create({ data });
  }

  async update(id: string, data: { name?: string; nameRu?: string; description?: string; descriptionRu?: string; icon?: string; order?: number; isActive?: boolean }) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    return this.prisma.category.update({ where: { id }, data });
  }

  async delete(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    await this.prisma.category.update({ where: { id }, data: { isActive: false } });
    return { message: 'Category deleted' };
  }

  private transformWithLang(category: any, lang: string) {
    const isRu = lang === 'ru';
    return {
      ...category,
      name: isRu && category.nameRu ? category.nameRu : category.name,
      description: isRu && category.descriptionRu ? category.descriptionRu : category.description,
      children: category.children?.map((c: any) => ({
        ...c,
        name: isRu && c.nameRu ? c.nameRu : c.name,
        description: isRu && c.descriptionRu ? c.descriptionRu : c.description,
      })),
    };
  }
}

