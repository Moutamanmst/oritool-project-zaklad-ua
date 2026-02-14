import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'securePassword123', minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  password: string;

  @ApiPropertyOptional({ example: 'Іван' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  firstName?: string;

  @ApiPropertyOptional({ example: 'Петренко' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  lastName?: string;

  @ApiPropertyOptional({ example: '+380501234567' })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class RegisterBusinessDto extends RegisterDto {
  @ApiProperty({ example: 'Ресторан "Смачна їжа"' })
  @IsString()
  @MaxLength(200)
  companyName: string;

  @ApiPropertyOptional({ example: 'Ресторан "Вкусная еда"' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  companyNameRu?: string;

  @ApiPropertyOptional({ example: 'Опис компанії українською' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Описание компании на русском' })
  @IsOptional()
  @IsString()
  descriptionRu?: string;

  @ApiPropertyOptional({ example: 'https://example.com' })
  @IsOptional()
  @IsString()
  website?: string;
}

