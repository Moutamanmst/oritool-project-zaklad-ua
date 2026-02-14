import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  MaxLength,
  Min,
  Max,
  IsObject,
  IsUUID,
} from 'class-validator';
import { BusinessType } from '@prisma/client';

export class CreateEstablishmentDto {
  @ApiProperty({ example: 'Ресторан "Смачна їжа"' })
  @IsString()
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional({ example: 'Ресторан "Вкусная еда"' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  nameRu?: string;

  @ApiPropertyOptional({ example: 'Опис закладу українською' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Описание заведения на русском' })
  @IsOptional()
  @IsString()
  descriptionRu?: string;

  @ApiProperty({ enum: BusinessType, example: BusinessType.RESTAURANT })
  @IsEnum(BusinessType)
  businessType: BusinessType;

  @ApiPropertyOptional({ example: 'вул. Хрещатик, 1, Київ' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'ул. Крещатик, 1, Киев' })
  @IsOptional()
  @IsString()
  addressRu?: string;

  @ApiPropertyOptional({ example: '+380441234567' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'info@restaurant.ua' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ example: 'https://restaurant.ua' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiPropertyOptional({ example: 'https://example.com/cover.jpg' })
  @IsOptional()
  @IsString()
  coverUrl?: string;

  @ApiPropertyOptional({ example: 2, minimum: 1, maximum: 4 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(4)
  priceRange?: number;

  @ApiPropertyOptional({ example: 50.4501 })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: 30.5234 })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({
    example: {
      monday: { open: '09:00', close: '22:00' },
      tuesday: { open: '09:00', close: '22:00' },
    },
  })
  @IsOptional()
  @IsObject()
  workingHours?: Record<string, { open: string; close: string }>;

  @ApiPropertyOptional({
    example: ['wifi', 'parking', 'terrace'],
  })
  @IsOptional()
  features?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  cityId?: string;
}

