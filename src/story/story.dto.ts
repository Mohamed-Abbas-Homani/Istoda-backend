import {
  IsString,
  IsOptional,
  IsUUID,
  IsArray,
  IsNumber,
  IsInt,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStoryDto {
  @ApiProperty({ example: 'My Amazing Story' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ 
    type: 'string', 
    format: 'binary',
    description: 'Cover photo file upload'
  })
  @IsOptional()
  cover_photo?: any;

  @ApiPropertyOptional({
    type: 'array',
    items: { type: 'string', format: 'uuid' },
    example: [
      '409f3e60-d39f-43ea-b212-19c62e79cfb3',
      '4a1c4d25-8d7b-4a1d-b6e1-7b4e2db7af92',
    ],
    description: 'Array of category IDs (comma-separated or array)',
  })
  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map(v => v.trim());
    }
    return value;
  })
  categoryIds?: string[];
}

export class UpdateStoryDto {
  @ApiPropertyOptional({ example: 'Updated Story Title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ 
    type: 'string', 
    format: 'binary',
    description: 'Cover photo file upload'
  })
  @IsOptional()
  cover_photo?: any;

  @ApiPropertyOptional({
    type: 'array',
    items: { type: 'string', format: 'uuid' },
    example: [
      '409f3e60-d39f-43ea-b212-19c62e79cfb3',
      '4a1c4d25-8d7b-4a1d-b6e1-7b4e2db7af92',
    ],
    description: 'Array of category IDs (comma-separated or array)',
  })
  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map(v => v.trim());
    }
    return value;
  })
  categoryIds?: string[];
}

export class RateStoryDto {
  @ApiProperty({ 
    minimum: 1, 
    maximum: 5,
    example: 4,
    description: 'Rating from 1 to 5 stars'
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}

export class MarkPageAsReadDto {
  @ApiProperty({ 
    example: 1,
    description: 'Page number that was read'
  })
  @IsInt()
  @Min(1)
  page_number: number;
}

export class CreatePageDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  page_number: number;

  @ApiProperty({ example: 'Once upon a time...' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ example: 'media-uuid-123' })
  @IsOptional()
  @IsString()
  media_id?: string;

  @ApiPropertyOptional({
    example: { theme: 'dark', background: 'forest' },
    description: 'JSON metadata for the page'
  })
  @IsOptional()
  meta?: Record<string, any>;
}

export class UpdatePageDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page_number?: number;

  @ApiPropertyOptional({ example: 'Updated content...' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ example: 'media-uuid-456' })
  @IsOptional()
  @IsString()
  media_id?: string;

  @ApiPropertyOptional({
    example: { theme: 'light', background: 'ocean' },
    description: 'JSON metadata for the page'
  })
  @IsOptional()
  meta?: Record<string, any>;
}

export class CreateCommentDto {
  @ApiProperty({ example: 'Great story!' })
  @IsString()
  content: string;
}

export class CreateCategoryDto {
  @ApiProperty({ example: 'Fantasy' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Stories about magic and mythical creatures' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '#FF6B35' })
  @IsOptional()
  @IsString()
  color?: string;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: 'Science Fiction' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Stories about future technology' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '#00C9FF' })
  @IsOptional()
  @IsString()
  color?: string;
}