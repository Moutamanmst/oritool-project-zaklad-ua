import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SiteContentService {
  constructor(private prisma: PrismaService) {}

  async getContent(key: string) {
    const content = await this.prisma.siteContent.findUnique({
      where: { key },
    });
    return content?.data || null;
  }

  async getAllContent() {
    const contents = await this.prisma.siteContent.findMany();
    const result: Record<string, any> = {};
    contents.forEach((c) => {
      result[c.key] = c.data;
    });
    return result;
  }

  async upsertContent(key: string, data: any) {
    return this.prisma.siteContent.upsert({
      where: { key },
      update: { data },
      create: { key, data },
    });
  }

  async deleteContent(key: string) {
    return this.prisma.siteContent.delete({
      where: { key },
    });
  }
}
