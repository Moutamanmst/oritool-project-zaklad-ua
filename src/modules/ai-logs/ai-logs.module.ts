import { Module } from '@nestjs/common';
import { AILogsController } from './ai-logs.controller';
import { AILogsService } from './ai-logs.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AILogsController],
  providers: [AILogsService],
  exports: [AILogsService],
})
export class AILogsModule {}
