import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoryController } from './controller/story.controller';
import { StoryService } from './story.service';

import { ContextHelper } from 'src/system/helper/context.helper';
import { Story } from './entity/story.entity';
import { Category } from './entity/category.entity';
import { Page } from './entity/page.entity';
import { CategoryController } from './controller/category.controller';
import { Comment } from './entity/comment.entity';
import { Rating } from './entity/rating.entity';
import { Reader } from './entity/reader.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Story, Page, Comment, Category, Rating, Reader]),
  ],
  controllers: [StoryController, CategoryController],
  providers: [StoryService, ContextHelper],
  exports: [StoryService],
})
export class StoriesModule {}
