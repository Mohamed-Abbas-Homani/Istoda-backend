import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Story } from './story.entity';
import { StoryService } from './stories.service';
import { StoryController } from './stories.controller';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Story, User])],
  controllers: [StoryController],
  providers: [StoryService],
})
export class StoriesModule {}
