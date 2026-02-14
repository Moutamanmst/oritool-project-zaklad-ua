import { Module } from '@nestjs/common';
import { PosSystemsController } from './pos-systems.controller';
import { PosSystemsService } from './pos-systems.service';

@Module({
  controllers: [PosSystemsController],
  providers: [PosSystemsService],
  exports: [PosSystemsService],
})
export class PosSystemsModule {}

