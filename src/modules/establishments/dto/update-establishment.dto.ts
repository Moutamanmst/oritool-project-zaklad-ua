import { PartialType } from '@nestjs/swagger';
import { CreateEstablishmentDto } from './create-establishment.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { EntityStatus } from '@prisma/client';

export class UpdateEstablishmentDto extends PartialType(CreateEstablishmentDto) {}

export class AdminUpdateEstablishmentDto extends UpdateEstablishmentDto {
  @ApiPropertyOptional({ enum: EntityStatus })
  @IsOptional()
  @IsEnum(EntityStatus)
  status?: EntityStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}

