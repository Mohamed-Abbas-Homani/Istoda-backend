import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStoryDto {
  @ApiProperty({
    description: 'Title of the story',
    example: 'My First Story',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Content of the story',
    example: 'Once upon a time...',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Category of the story',
    example: 'Adventure',
  })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Optional cover photo image',
    required: false,
  })
  @IsOptional()
  cover_photo?: any;
}
