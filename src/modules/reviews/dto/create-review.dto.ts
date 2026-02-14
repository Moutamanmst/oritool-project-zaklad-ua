import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: 'Чудовий заклад! Рекомендую всім.' })
  @IsString()
  @MinLength(20)
  @MaxLength(2000)
  content: string;

  @ApiPropertyOptional({ example: 'Смачна їжа, гарний сервіс' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  pros?: string;

  @ApiPropertyOptional({ example: 'Довго чекати на замовлення' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  cons?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  establishmentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  posSystemId?: string;
}

