import {
  Controller,
  Post,
  Get,
  Body,
  UploadedFile,
  UseInterceptors,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { StoryService } from './stories.service';
import { CreateStoryDto } from './stories.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { config } from 'src/config';
import { ContextHelper } from 'src/system/helper/context.helper';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('stories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('stories')
export class StoryController {
  constructor(
    private readonly storyService: StoryService,
    private readonly contextHelper: ContextHelper,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new story with optional cover photo' })
  @ApiResponse({ status: 201, description: 'Story successfully created' })
  @ApiResponse({ status: 400, description: 'Validation or upload error' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Story data with cover photo',
    type: CreateStoryDto,
  })
  @UseInterceptors(
    FileInterceptor('cover_photo', {
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
    @Req() req?,
  ) {
    const user = this.contextHelper.getUser();
    return this.storyService.createStory(createStoryDto, coverPhoto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all stories grouped by category' })
  @ApiResponse({
    status: 200,
    description: 'Stories grouped by category returned',
  })
  @ApiResponse({ status: 400, description: 'Invalid query parameter' })
  @ApiQuery({
    name: 'keyword',
    required: false,
    description: 'Optional keyword to filter stories by title or content',
  })
  async getStories(@Query('keyword') keyword?: string) {
    return this.storyService.getStoriesGroupedByCategory(keyword);
  }
}
