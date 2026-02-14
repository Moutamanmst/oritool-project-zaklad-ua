import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { SiteContentService } from './site-content.service';

@Controller('site-content')
export class SiteContentController {
  constructor(private readonly siteContentService: SiteContentService) {}

  @Get()
  async getAllContent() {
    return this.siteContentService.getAllContent();
  }

  @Get(':key')
  async getContent(@Param('key') key: string) {
    return this.siteContentService.getContent(key);
  }

  @Put(':key')
  async upsertContent(@Param('key') key: string, @Body() data: any) {
    return this.siteContentService.upsertContent(key, data);
  }

  @Delete(':key')
  async deleteContent(@Param('key') key: string) {
    return this.siteContentService.deleteContent(key);
  }
}
