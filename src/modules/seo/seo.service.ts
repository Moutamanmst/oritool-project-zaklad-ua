import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SeoService {
  constructor(private prisma: PrismaService) {}

  // Global SEO Settings
  async getSettings() {
    let settings = await this.prisma.seoSettings.findFirst();
    if (!settings) {
      // Create default settings if none exist
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

  async updateSettings(data: any) {
    const existing = await this.prisma.seoSettings.findFirst();
    if (existing) {
      return this.prisma.seoSettings.update({
        where: { id: existing.id },
        data,
      });
    }
    return this.prisma.seoSettings.create({ data });
  }

  // Page-specific SEO
  async getPageSeo(path: string) {
    return this.prisma.pageSeo.findUnique({
      where: { path },
    });
  }

  async getAllPageSeo() {
    return this.prisma.pageSeo.findMany({
      orderBy: { path: 'asc' },
    });
  }

  async upsertPageSeo(path: string, data: any) {
    return this.prisma.pageSeo.upsert({
      where: { path },
      update: data,
      create: { path, ...data },
    });
  }

  async deletePageSeo(path: string) {
    return this.prisma.pageSeo.delete({
      where: { path },
    });
  }
}
