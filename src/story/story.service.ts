import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like } from 'typeorm';
import { User } from 'src/users/user.entity';
import { rename } from 'fs/promises';
import { join } from 'path';
import {
  CreateStoryDto,
  UpdateStoryDto,
  RateStoryDto,
  CreatePageDto,
  UpdatePageDto,
  CreateCommentDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  UpdateReadingProgressDto,
} from './story.dto';
import { Story, StoryStatus } from './entity/story.entity';
import { Page } from './entity/page.entity';
import { Category } from './entity/category.entity';
import { Comment } from './entity/comment.entity';
import { Rating } from './entity/rating.entity';
import { Reader } from './entity/reader.entity';

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(Story)
    private readonly storyRepo: Repository<Story>,
    @InjectRepository(Page)
    private readonly pageRepo: Repository<Page>,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Rating)
    private readonly ratingRepo: Repository<Rating>,
    @InjectRepository(Reader)
    private readonly readerRepo: Repository<Reader>,
  ) {}

  // Story CRUD Operations
  async createStory(
    createStoryDto: CreateStoryDto,
    coverFile: Express.Multer.File | undefined,
    user: User,
  ): Promise<Story> {
    const story = this.storyRepo.create({
      title: createStoryDto.title,
      description: createStoryDto.description,
      status: (createStoryDto.status as StoryStatus) || StoryStatus.PUBLISHED,
      author: user,
    });

    // Handle categories if provided
    if (createStoryDto.categoryIds && createStoryDto.categoryIds.length > 0) {
      const categories = await this.categoryRepo.findBy({
        id: In(createStoryDto.categoryIds),
      });
      story.categories = categories;
    }

    const savedStory = await this.storyRepo.save(story);

    // Handle cover photo upload
    if (coverFile) {
      const newFilename = `${savedStory.id}.cover_photo.${coverFile.originalname}`;
      const oldPath = join('./uploads', coverFile.filename);
      const newPath = join('./uploads', newFilename);

      await rename(oldPath, newPath);
      savedStory.coverPhoto = newFilename;
      await this.storyRepo.save(savedStory);
    }

    return savedStory;
  }

  async getStories(keyword?: string, categoryId?: string): Promise<Story[]> {
    const query = this.storyRepo
      .createQueryBuilder('story')
      .leftJoinAndSelect('story.author', 'author')
      .leftJoinAndSelect('story.categories', 'categories')
      .leftJoinAndSelect('story.pages', 'pages')
      .leftJoinAndSelect('story.ratings', 'ratings')
      .leftJoinAndSelect('story.readers', 'readers')
      .orderBy('story.publishingDate', 'DESC');

    if (keyword) {
      query.andWhere('story.title ILIKE :keyword', { keyword: `%${keyword}%` });
    }

    if (categoryId) {
      query.andWhere('categories.id = :categoryId', { categoryId });
    }

    const stories = await query.getMany();

    // Add calculated fields for each story
    return stories.map((story) => ({
      ...story,
      readers_count: story.readers?.length || 0,
      averageRating: this.calculateAverageRating(story.ratings || []),
      ratingsSummary: this.getRatingsSummary(story.ratings || []),
    }));
  }

  private calculateAverageRating(ratings: Rating[]): number {
    if (!ratings.length) return 0;
    const sum = ratings.reduce((acc, rating) => acc + rating.rate, 0);
    return Math.round((sum / ratings.length) * 100) / 100; // Round to 2 decimal places
  }

  private getRatingsSummary(ratings: Rating[]): Record<string, number> {
    const summary = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
    ratings.forEach((rating) => {
      summary[rating.rate.toString()] += 1;
    });
    return summary;
  }

  async getStoriesGroupedByCategory(
    keyword?: string,
  ): Promise<Record<string, Story[]>> {
    const stories = await this.getStories(keyword);

    const grouped: Record<string, Story[]> = {};

    stories.forEach((story) => {
      story.categories.forEach((category) => {
        if (!grouped[category.name]) {
          grouped[category.name] = [];
        }
        grouped[category.name].push(story);
      });

      // Handle stories without categories
      if (!story.categories || story.categories.length === 0) {
        if (!grouped['Uncategorized']) {
          grouped['Uncategorized'] = [];
        }
        grouped['Uncategorized'].push(story);
      }
    });

    return grouped;
  }

  async getStoryById(id: string, user?: User): Promise<Story> {
    const story = await this.storyRepo.findOne({
      where: { id },
      relations: ['author', 'categories', 'pages', 'comments', 'comments.user'],
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    // Add calculated fields
    const storyWithStats = {
      ...story,
      ...(await this.getStoryStats(id)),
    };

    if (user) {
      const rating = await this.ratingRepo.findOne({
        where: { story: { id }, user: { id: user.id } },
      });
      storyWithStats['userRating'] = rating?.rate ?? null;
    }
    return storyWithStats;
  }

  async updateStory(
    id: string,
    updateStoryDto: UpdateStoryDto,
    coverFile: Express.Multer.File | undefined,
    user: User,
  ): Promise<Story> {
    const story = await this.storyRepo.findOne({
      where: { id },
      relations: ['author', 'categories'],
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    if (story.author.id !== user.id) {
      throw new BadRequestException('You can only update your own stories');
    }

    // Update basic fields
    if (updateStoryDto.title) story.title = updateStoryDto.title;
    if (updateStoryDto.description !== undefined)
      story.description = updateStoryDto.description;
    if (updateStoryDto.status)
      story.status = updateStoryDto.status as StoryStatus;

    // Handle categories update
    if (updateStoryDto.categoryIds) {
      const categories = await this.categoryRepo.findBy({
        id: In(updateStoryDto.categoryIds),
      });
      story.categories = categories;
    }

    // Handle cover photo update
    if (coverFile) {
      const newFilename = `${story.id}.cover_photo.${coverFile.originalname}`;
      const oldPath = join('./uploads', coverFile.filename);
      const newPath = join('./uploads', newFilename);

      await rename(oldPath, newPath);
      story.coverPhoto = newFilename;
    }

    return this.storyRepo.save(story);
  }

  async deleteStory(id: string, user: User): Promise<void> {
    const story = await this.storyRepo.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    if (story.author.id !== user.id) {
      throw new BadRequestException('You can only delete your own stories');
    }

    await this.storyRepo.remove(story);
  }

  async rateStory(
    id: string,
    rateStoryDto: RateStoryDto,
    user: User,
  ): Promise<Rating> {
    const story = await this.storyRepo.findOne({ where: { id } });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    // Check if user already rated this story
    const existingRating = await this.ratingRepo.findOne({
      where: { user: { id: user.id }, story: { id } },
    });

    if (existingRating) {
      // Update existing rating
      existingRating.rate = rateStoryDto.rating;
      return this.ratingRepo.save(existingRating);
    }

    // Create new rating
    const rating = this.ratingRepo.create({
      rate: rateStoryDto.rating,
      user,
      story,
    });

    return this.ratingRepo.save(rating);
  }

  async updateReadingProgress(
    storyId: string,
    updateReadingProgressDto: UpdateReadingProgressDto,
    user: User,
  ): Promise<Reader> {
    const story = await this.storyRepo.findOne({ where: { id: storyId } });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    // Check if reader record already exists for this user and story
    let reader = await this.readerRepo.findOne({
      where: {
        user: { id: user.id },
        story: { id: storyId },
      },
    });

    if (reader) {
      // Update existing reader's current page
      reader.currentPageNumber = updateReadingProgressDto.currentPageNumber;
      return this.readerRepo.save(reader);
    }

    // Create new reader record
    reader = this.readerRepo.create({
      currentPageNumber: updateReadingProgressDto.currentPageNumber,
      user,
      story,
    });

    return this.readerRepo.save(reader);
  }

  async getStoryStats(storyId: string): Promise<{
    readersCount: number;
    averageRating: number;
    ratingsSummary: Record<string, number>;
    totalRatings: number;
    commentsCount: number;
  }> {
    const story = await this.storyRepo.findOne({
      where: { id: storyId },
      relations: ['ratings', 'readers', 'comments'],
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    // Count unique readers (users who started reading the story)
    const readersCount = story.readers.length;

    return {
      readersCount: readersCount,
      averageRating: this.calculateAverageRating(story.ratings),
      ratingsSummary: this.getRatingsSummary(story.ratings),
      totalRatings: story.ratings.length,
      commentsCount: story.comments.length,
    };
  }

  // Page CRUD Operations
  async createPage(
    storyId: string,
    createPageDto: CreatePageDto,
    user: User,
  ): Promise<Page> {
    const story = await this.storyRepo.findOne({
      where: { id: storyId },
      relations: ['author'],
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    if (story.author.id !== user.id) {
      throw new BadRequestException(
        'You can only add pages to your own stories',
      );
    }

    const page = this.pageRepo.create({
      ...createPageDto,
      story,
    });

    return this.pageRepo.save(page);
  }

  async getPagesByStory(storyId: string): Promise<Page[]> {
    return this.pageRepo.find({
      where: { story: { id: storyId } },
      relations: ['comments', 'comments.user'],
      order: { pageNumber: 'ASC' },
    });
  }

  async getPageById(id: string): Promise<Page> {
    const page = await this.pageRepo.findOne({
      where: { id },
      relations: ['story', 'comments', 'comments.user'],
    });

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    return page;
  }

  async updatePage(
    id: string,
    updatePageDto: UpdatePageDto,
    user: User,
  ): Promise<Page> {
    const page = await this.pageRepo.findOne({
      where: { id },
      relations: ['story', 'story.author'],
    });

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    if (page.story.author.id !== user.id) {
      throw new BadRequestException(
        'You can only update pages of your own stories',
      );
    }

    Object.assign(page, updatePageDto);
    return this.pageRepo.save(page);
  }

  async deletePage(id: string, user: User): Promise<void> {
    const page = await this.pageRepo.findOne({
      where: { id },
      relations: ['story', 'story.author'],
    });

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    if (page.story.author.id !== user.id) {
      throw new BadRequestException(
        'You can only delete pages of your own stories',
      );
    }

    await this.pageRepo.remove(page);
  }

  // Comment CRUD Operations
  async createStoryComment(
    storyId: string,
    createCommentDto: CreateCommentDto,
    user: User,
  ): Promise<Comment> {
    const story = await this.storyRepo.findOne({ where: { id: storyId } });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    const comment = this.commentRepo.create({
      ...createCommentDto,
      user,
      story,
    });

    return this.commentRepo.save(comment);
  }

  async createPageComment(
    pageId: string,
    createCommentDto: CreateCommentDto,
    user: User,
  ): Promise<Comment> {
    const page = await this.pageRepo.findOne({ where: { id: pageId } });

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    const comment = this.commentRepo.create({
      ...createCommentDto,
      user,
      page,
    });

    return this.commentRepo.save(comment);
  }

  async getCommentsByPage(pageId: string): Promise<Comment[]> {
    const page = await this.pageRepo.findOne({ where: { id: pageId } });

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    return this.commentRepo.find({
      where: { page: { id: pageId } },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });
  }

  async deleteComment(id: string, user: User): Promise<void> {
    const comment = await this.commentRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.user.id !== user.id) {
      throw new BadRequestException('You can only delete your own comments');
    }

    await this.commentRepo.remove(comment);
  }

  // Category CRUD Operations
  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const category = this.categoryRepo.create(createCategoryDto);
    return this.categoryRepo.save(category);
  }

  async getCategories(): Promise<Category[]> {
    return this.categoryRepo.find({
      relations: ['stories'],
    });
  }

  async getCategoryById(id: string): Promise<Category> {
    const category = await this.categoryRepo.findOne({
      where: { id },
      relations: ['stories', 'stories.author'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.categoryRepo.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    Object.assign(category, updateCategoryDto);
    return this.categoryRepo.save(category);
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await this.categoryRepo.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.categoryRepo.remove(category);
  }
}
