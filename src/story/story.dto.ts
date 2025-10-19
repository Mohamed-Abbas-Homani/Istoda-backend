import {
  IsString,
  IsOptional,
  IsUUID,
  IsArray,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StoryStatus } from './entity/story.entity';

export class CreateStoryDto {
  @ApiProperty({ example: 'My Amazing Story' })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    example: 'A captivating tale of adventure and discovery...',
    description: 'Brief description of the story',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Cover photo file upload',
  })
  @IsOptional()
  coverPhoto?: any;

  @ApiPropertyOptional({
    example: 'draft',
    enum: ['draft', 'published', 'archived'],
    description: 'Story status',
  })
  @IsOptional()
  @IsString()
  status?: string;

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
      return value.split(',').map((v) => v.trim());
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
    example: 'Updated story description...',
    description: 'Brief description of the story',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Cover photo file upload',
  })
  @IsOptional()
  coverPhoto?: any;

  @ApiPropertyOptional({
    example: 'published',
    enum: ['draft', 'published', 'archived'],
    description: 'Story status',
  })
  @IsOptional()
  @IsString()
  status?: string;

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
      return value.split(',').map((v) => v.trim());
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
    description: 'Rating from 1 to 5 stars',
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}

export class UpdateReadingProgressDto {
  @ApiProperty({
    example: 5,
    description: 'Current page number the user is reading',
  })
  @IsInt()
  @Min(1)
  currentPageNumber: number;
}

export class CreatePageDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  pageNumber: number;

  @ApiProperty({ example: 'Once upon a time...' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ example: 'media-uuid-123' })
  @IsOptional()
  @IsString()
  mediaId?: string;

  @ApiPropertyOptional({
    example: { theme: 'dark', background: 'forest' },
    description: 'JSON metadata for the page',
  })
  @IsOptional()
  meta?: Record<string, any>;
}

export class UpdatePageDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  pageNumber?: number;

  @ApiPropertyOptional({ example: 'Updated content...' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ example: 'media-uuid-456' })
  @IsOptional()
  @IsString()
  mediaId?: string;

  @ApiPropertyOptional({
    example: { theme: 'light', background: 'ocean' },
    description: 'JSON metadata for the page',
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

  @ApiPropertyOptional({
    example: 'Stories about magic and mythical creatures',
  })
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

// Response DTOs
export class UserDto {
  @ApiProperty({ example: 'c93b7c68-3a45-4b67-8b7e-f3b5d7bfb8f2' })
  id: string;

  @ApiProperty({ example: 'johndoe' })
  username: string;

  @ApiProperty({
    example: 'https://example.com/images/profile.jpg',
    nullable: true,
  })
  profilePicture?: string;
}

export class CategoryDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6' })
  id: string;

  @ApiProperty({ example: 'Fantasy' })
  name: string;

  @ApiProperty({
    example: 'Stories about magic and mythical creatures',
    nullable: true,
  })
  description?: string;

  @ApiProperty({ example: '#FF6B35' })
  color: string;

  @ApiProperty({ example: '2025-10-18T12:34:56.000Z' })
  createdAt: Date;
}

export class PageDto {
  @ApiProperty({ example: 'f1e2d3c4-b5a6-7c8d-9e0f-1a2b3c4d5e6f' })
  id: string;

  @ApiProperty({ example: 1 })
  pageNumber: number;

  @ApiProperty({ example: 'Once upon a time in a land far away...' })
  content: string;

  @ApiProperty({ example: 'media-uuid-123', nullable: true })
  mediaId?: string;

  @ApiProperty({
    example: { theme: 'dark', background: 'forest' },
    nullable: true,
  })
  meta?: Record<string, any>;

  @ApiProperty({ example: '2025-10-19T09:12:00.000Z', nullable: true })
  updatedAt?: Date;
}

export class CommentDto {
  @ApiProperty({ example: 'a9b8c7d6-e5f4-3g2h-1i0j-k9l8m7n6o5p4' })
  id: string;

  @ApiProperty({ example: 'This is an amazing story!' })
  content: string;

  @ApiProperty({ type: () => UserDto })
  user: UserDto;

  @ApiProperty({ example: '2025-10-19T10:30:00.000Z' })
  createdAt: Date;
}

export class RatingDto {
  @ApiProperty({ example: 'b1c2d3e4-f5g6-7h8i-9j0k-l1m2n3o4p5q6' })
  id: string;

  @ApiProperty({ example: 4, minimum: 1, maximum: 5 })
  rate: number;

  @ApiProperty({ type: () => UserDto })
  user: UserDto;

  @ApiProperty({ example: '2025-10-19T11:45:00.000Z' })
  createdAt: Date;
}

export class ReaderDto {
  @ApiProperty({ example: 'd1e2f3g4-h5i6-7j8k-9l0m-n1o2p3q4r5s6' })
  id: string;

  @ApiProperty({ example: 5 })
  currentPageNumber: number;

  @ApiProperty({ type: () => UserDto })
  user: UserDto;

  @ApiProperty({ example: '2025-10-19T13:20:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-10-19T15:45:00.000Z' })
  updatedAt: Date;
}

export class StoryDto {
  @ApiProperty({ example: 'c93b7c68-3a45-4b67-8b7e-f3b5d7bfb8f2' })
  id: string;

  @ApiProperty({ example: 'The Hidden City' })
  title: string;

  @ApiProperty({
    example: 'A thrilling mystery set in an ancient metropolis.',
    nullable: true,
  })
  description?: string;

  @ApiProperty({
    example: 'https://example.com/images/cover.jpg',
    nullable: true,
  })
  coverPhoto?: string;

  @ApiProperty({ enum: StoryStatus, example: StoryStatus.PUBLISHED })
  status: StoryStatus;

  @ApiProperty({ example: '2025-10-18T12:34:56.000Z' })
  publishingDate: Date;

  @ApiProperty({ example: '2025-10-19T09:12:00.000Z', nullable: true })
  updatedAt?: Date;

  @ApiProperty({ type: () => UserDto })
  author: UserDto;

  @ApiProperty({ type: () => [CategoryDto] })
  categories: CategoryDto[];

  @ApiProperty({ type: () => [PageDto] })
  pages: PageDto[];

  @ApiProperty({ type: () => [CommentDto] })
  comments: CommentDto[];

  @ApiProperty({ type: () => [RatingDto] })
  ratings: RatingDto[];

  @ApiProperty({ type: () => [ReaderDto] })
  readers: ReaderDto[];
}
