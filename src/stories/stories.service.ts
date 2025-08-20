import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Story } from './story.entity';
import { rename } from 'fs/promises';
import { join } from 'path';
import { CreateStoryDto } from './stories.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(Story)
    private readonly storyRepo: Repository<Story>,
  ) {}

  async createStory(createStoryDto: CreateStoryDto, coverFile: Express.Multer.File | undefined, user: User) {
    // Step 1: Save story without cover_photo to get ID
    const story = this.storyRepo.create({
      ...createStoryDto,
      user,
    });
    const savedStory = await this.storyRepo.save(story);

    if (coverFile) {
      // Step 2: Rename the uploaded file
      const newFilename = `${savedStory.id}.cover_photo.${coverFile.originalname}`;
      const oldPath = join('./uploads', coverFile.filename);
      const newPath = join('./uploads', newFilename);

      await rename(oldPath, newPath);

      // Step 3: Update the story with the new filename
      savedStory.cover_photo = newFilename;
      await this.storyRepo.save(savedStory);
    }

    return savedStory;
  }

  async getStoriesGroupedByCategory(keyword?: string) {
    const query = this.storyRepo.createQueryBuilder('story');

    if (keyword) {
      query.where('story.title ILIKE :keyword OR story.content ILIKE :keyword', { keyword: `%${keyword}%` });
    }

    const stories = await query.getMany();

    // Group by category
    const grouped = stories.reduce((acc, story) => {
      if (!acc[story.category]) acc[story.category] = [];
      acc[story.category].push(story);
      return acc;
    }, {} as Record<string, Story[]>);

    return grouped;
  }
}
