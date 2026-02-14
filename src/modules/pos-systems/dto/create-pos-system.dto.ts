import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsObject,
  MaxLength,
  Min,
  IsUUID,
  IsArray,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { EntityStatus } from '@prisma/client';

export class CreatePosSystemDto {
  @ApiProperty({ example: 'Poster POS' })
  @IsString()
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional({ example: 'Poster POS' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  nameRu?: string;

  @ApiPropertyOptional({ example: 'Детальний опис POS-системи українською' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Подробное описание POS-системы на русском' })
  @IsOptional()
  @IsString()
  descriptionRu?: string;

  @ApiPropertyOptional({ example: 'Короткий опис для карточки' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  shortDescription?: string;

  @ApiPropertyOptional({ example: 'Краткое описание для карточки' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  shortDescriptionRu?: string;

  @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiPropertyOptional({ example: 'https://example.com/cover.jpg' })
  @IsOptional()
  @IsString()
  coverUrl?: string;

  @ApiPropertyOptional({ example: 'https://posterpos.ua' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ example: 500, description: 'Price from (UAH/month)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  priceFrom?: number;

  @ApiPropertyOptional({ example: 2000, description: 'Price to (UAH/month)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  priceTo?: number;

  @ApiPropertyOptional({ example: 'subscription', description: 'subscription, one-time, free' })
  @IsOptional()
  @IsString()
  pricingModel?: string;

  @ApiPropertyOptional({
    example: ['inventory', 'analytics', 'crm', 'delivery'],
    description: 'List of features',
  })
  @IsOptional()
  @IsArray()
  features?: string[];

  @ApiPropertyOptional({
    example: ['iiko', 'checkbox', 'liqpay'],
    description: 'List of integrations',
  })
  @IsOptional()
  @IsArray()
  integrations?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ enum: EntityStatus, default: EntityStatus.PENDING })
  @IsOptional()
  @IsEnum(EntityStatus)
  status?: EntityStatus;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}

