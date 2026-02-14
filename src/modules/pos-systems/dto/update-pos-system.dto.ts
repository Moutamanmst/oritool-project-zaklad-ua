import { PartialType } from '@nestjs/swagger';
import { CreatePosSystemDto } from './create-pos-system.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { EntityStatus } from '@prisma/client';

export class UpdatePosSystemDto extends PartialType(CreatePosSystemDto) {
  @ApiPropertyOptional({ enum: EntityStatus })
  @IsOptional()
  @IsEnum(EntityStatus)
  status?: EntityStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}

// AdminUpdatePosSystemDto is now same as UpdatePosSystemDto (kept for backwards compatibility)
export class AdminUpdatePosSystemDto extends UpdatePosSystemDto {}

