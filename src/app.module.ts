import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { EstablishmentsModule } from './modules/establishments/establishments.module';
import { PosSystemsModule } from './modules/pos-systems/pos-systems.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { RatingsModule } from './modules/ratings/ratings.module';
import { UploadModule } from './modules/upload/upload.module';
import { I18nConfigModule } from './i18n/i18n.module';
import { AILogsModule } from './modules/ai-logs/ai-logs.module';
import { SiteContentModule } from './modules/site-content/site-content.module';
import { SeoModule } from './modules/seo/seo.module';
import { BlogModule } from './modules/blog/blog.module';
import { TechniciansModule } from './modules/technicians/technicians.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    I18nConfigModule,
    AuthModule,
    UsersModule,
    EstablishmentsModule,
    PosSystemsModule,
    CategoriesModule,
    ReviewsModule,
    RatingsModule,
    UploadModule,
    AILogsModule,
    SiteContentModule,
    SeoModule,
    BlogModule,
    TechniciansModule,
  ],
})
export class AppModule {}

