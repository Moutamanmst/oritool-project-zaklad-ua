import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { SeoService } from './seo.service';

@Controller('seo')
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  // Global settings
  @Get('settings')
  async getSettings() {
    return this.seoService.getSettings();
  }

  @Put('settings')
  async updateSettings(@Body() data: any) {
    return this.seoService.updateSettings(data);
  }

  // Page SEO
  @Get('pages')
  async getAllPageSeo() {
    return this.seoService.getAllPageSeo();
  }

  @Get('pages/:path')
  async getPageSeo(@Param('path') path: string) {
    // Decode path (e.g., %2F -> /)
    const decodedPath = decodeURIComponent(path);
    return this.seoService.getPageSeo(decodedPath);
  }

  @Put('pages/:path')
  async upsertPageSeo(@Param('path') path: string, @Body() data: any) {
    const decodedPath = decodeURIComponent(path);
    return this.seoService.upsertPageSeo(decodedPath, data);
  }

  @Delete('pages/:path')
  async deletePageSeo(@Param('path') path: string) {
    const decodedPath = decodeURIComponent(path);
    return this.seoService.deletePageSeo(decodedPath);
  }
}
