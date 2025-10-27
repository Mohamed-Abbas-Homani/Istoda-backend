import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { StoryService } from '../story.service';
import {
  CreateStoryDto,
  UpdateStoryDto,
  RateStoryDto,
  CreatePageDto,
  UpdatePageDto,
  CreateCommentDto,
  UpdateReadingProgressDto,
  StoryDto,
  PageDto,
  CommentDto,
  RatingDto,
  ReaderDto,
  CategoryDto,
} from '../story.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { config } from 'src/config';
import { ContextHelper } from 'src/system/helper/context.helper';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TransactionInterceptor } from 'src/system/interceptor/transaction.interceptor';
import { OptionalJwtAuthGuard } from 'src/auth/optional-jwt.guard';

@ApiTags('stories')
@Controller('stories')
export class StoryController {
  constructor(
    private readonly storyService: StoryService,
    private readonly contextHelper: ContextHelper,
  ) {}

  // Story Endpoints
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @UseInterceptors(TransactionInterceptor)
  @ApiOperation({ summary: 'Create a new story with optional cover photo' })
  @ApiResponse({
    status: 201,
    description: 'Story successfully created',
    type: StoryDto,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('coverPhoto', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          const uploadPath = './uploads';
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          callback(null, uploadPath);
        },
        filename: (req, file, callback) => {
          const tempName =
            Date.now() +
            '-' +
            Math.round(Math.random() * 1e9) +
            extname(file.originalname);
          callback(null, tempName);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: { fileSize: Number(config.bodyMaxSize) },
    }),
  )
  async createStory(
    @Body() createStoryDto: CreateStoryDto,
    @UploadedFile() coverPhoto?: Express.Multer.File,
  ) {
    const user = this.contextHelper.getUser();
    return this.storyService.createStory(createStoryDto, coverPhoto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all stories with optional filtering' })
  @ApiResponse({
    status: 200,
    description: 'Stories retrieved successfully',
    type: [StoryDto],
  })
  @ApiQuery({ name: 'keyword', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  async getStories(
    @Query('keyword') keyword?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.storyService.getStories(keyword, categoryId);
  }

  @Get('grouped-by-category')
  @ApiOperation({ summary: 'Get all stories grouped by category' })
  @ApiQuery({ name: 'keyword', required: false })
  async getStoriesGroupedByCategory(@Query('keyword') keyword?: string) {
    return this.storyService.getStoriesGroupedByCategory(keyword);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get story by ID' })
  @ApiResponse({
    status: 200,
    description: 'Story retrieved successfully',
    type: StoryDto,
  })
  @UseGuards(OptionalJwtAuthGuard)
  @ApiParam({ name: 'id', description: 'Story ID' })
  async getStoryById(@Param('id') id: string, @Req() req) {
    return this.storyService.getStoryById(id, req.user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @UseInterceptors(TransactionInterceptor)
  @ApiOperation({ summary: 'Update story' })
  @ApiResponse({
    status: 200,
    description: 'Story updated successfully',
    type: StoryDto,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('coverPhoto', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const tempName =
            Date.now() +
            '-' +
            Math.round(Math.random() * 1e9) +
            extname(file.originalname);
          callback(null, tempName);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: { fileSize: Number(config.bodyMaxSize) },
    }),
  )
  async updateStory(
    @Param('id') id: string,
    @Body() updateStoryDto: UpdateStoryDto,
    @UploadedFile() coverPhoto?: Express.Multer.File,
  ) {
    const user = this.contextHelper.getUser();
    return this.storyService.updateStory(id, updateStoryDto, coverPhoto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @UseInterceptors(TransactionInterceptor)
  @ApiOperation({ summary: 'Delete story' })
  async deleteStory(@Param('id') id: string) {
    const user = this.contextHelper.getUser();
    await this.storyService.deleteStory(id, user);
    return { message: 'Story deleted successfully' };
  }

  @Post(':id/rate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @UseInterceptors(TransactionInterceptor)
  @ApiOperation({
    summary: 'Rate a story (creates or updates existing rating)',
  })
  @ApiResponse({
    status: 201,
    description: 'Story rated successfully',
    type: RatingDto,
  })
  async rateStory(@Param('id') id: string, @Body() rateStoryDto: RateStoryDto) {
    const user = this.contextHelper.getUser();
    return this.storyService.rateStory(id, rateStoryDto, user);
  }

  @Post(':id/reading-progress')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @UseInterceptors(TransactionInterceptor)
  @ApiOperation({ summary: 'Update reading progress for a story' })
  @ApiResponse({
    status: 201,
    description: 'Reading progress updated successfully',
    type: ReaderDto,
  })
  async updateReadingProgress(
    @Param('id') id: string,
    @Body() updateReadingProgressDto: UpdateReadingProgressDto,
  ) {
    const user = this.contextHelper.getUser();
    return this.storyService.updateReadingProgress(
      id,
      updateReadingProgressDto,
      user,
    );
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get story statistics (readers, ratings, etc.)' })
  @ApiParam({ name: 'id', description: 'Story ID' })
  async getStoryStats(@Param('id') id: string) {
    return this.storyService.getStoryStats(id);
  }

  // Page Endpoints
  @Post(':storyId/pages')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @UseInterceptors(TransactionInterceptor)
  @ApiOperation({ summary: 'Create a new page for a story' })
  @ApiResponse({
    status: 201,
    description: 'Page created successfully',
    type: PageDto,
  })
  @ApiParam({ name: 'storyId', description: 'Story ID' })
  async createPage(
    @Param('storyId') storyId: string,
    @Body() createPageDto: CreatePageDto,
  ) {
    const user = this.contextHelper.getUser();
    return this.storyService.createPage(storyId, createPageDto, user);
  }

  @Get(':storyId/pages')
  @ApiOperation({ summary: 'Get all pages for a story' })
  @ApiResponse({
    status: 200,
    description: 'Pages retrieved successfully',
    type: [PageDto],
  })
  @ApiParam({ name: 'storyId', description: 'Story ID' })
  async getPagesByStory(@Param('storyId') storyId: string) {
    return this.storyService.getPagesByStory(storyId);
  }

  @Get('pages/:pageId')
  @ApiOperation({ summary: 'Get page by ID' })
  @ApiResponse({
    status: 200,
    description: 'Page retrieved successfully',
    type: PageDto,
  })
  @ApiParam({ name: 'pageId', description: 'Page ID' })
  async getPageById(@Param('pageId') pageId: string) {
    return this.storyService.getPageById(pageId);
  }

  @Put('pages/:pageId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @UseInterceptors(TransactionInterceptor)
  @ApiOperation({ summary: 'Update a page' })
  @ApiResponse({
    status: 200,
    description: 'Page updated successfully',
    type: PageDto,
  })
  @ApiParam({ name: 'pageId', description: 'Page ID' })
  async updatePage(
    @Param('pageId') pageId: string,
    @Body() updatePageDto: UpdatePageDto,
  ) {
    const user = this.contextHelper.getUser();
    return this.storyService.updatePage(pageId, updatePageDto, user);
  }

  @Delete('pages/:pageId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @UseInterceptors(TransactionInterceptor)
  @ApiOperation({ summary: 'Delete a page' })
  @ApiParam({ name: 'pageId', description: 'Page ID' })
  async deletePage(@Param('pageId') pageId: string) {
    const user = this.contextHelper.getUser();
    await this.storyService.deletePage(pageId, user);
    return { message: 'Page deleted successfully' };
  }

  // Comment Endpoints
  @Post(':storyId/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @UseInterceptors(TransactionInterceptor)
  @ApiOperation({ summary: 'Create a comment on a story' })
  @ApiResponse({
    status: 201,
    description: 'Comment created successfully',
    type: CommentDto,
  })
  @ApiParam({ name: 'storyId', description: 'Story ID' })
  async createStoryComment(
    @Param('storyId') storyId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const user = this.contextHelper.getUser();
    return this.storyService.createStoryComment(
      storyId,
      createCommentDto,
      user,
    );
  }

  @Post('pages/:pageId/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @UseInterceptors(TransactionInterceptor)
  @ApiOperation({ summary: 'Create a comment on a page' })
  @ApiResponse({
    status: 201,
    description: 'Comment created successfully',
    type: CommentDto,
  })
  @ApiParam({ name: 'pageId', description: 'Page ID' })
  async createPageComment(
    @Param('pageId') pageId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const user = this.contextHelper.getUser();
    return this.storyService.createPageComment(pageId, createCommentDto, user);
  }

  @Get('pages/:pageId/comments')
  @ApiOperation({ summary: 'Get all comments for a page' })
  @ApiResponse({
    status: 200,
    description: 'Comments retrieved successfully',
    type: [CommentDto],
  })
  @ApiParam({ name: 'pageId', description: 'Page ID' })
  async getCommentsByPage(@Param('pageId') pageId: string) {
    return this.storyService.getCommentsByPage(pageId);
  }

  @Delete('comments/:commentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @UseInterceptors(TransactionInterceptor)
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiParam({ name: 'commentId', description: 'Comment ID' })
  async deleteComment(@Param('commentId') commentId: string) {
    const user = this.contextHelper.getUser();
    await this.storyService.deleteComment(commentId, user);
    return { message: 'Comment deleted successfully' };
  }
}
