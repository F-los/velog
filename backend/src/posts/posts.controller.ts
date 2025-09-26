import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  ParseIntPipe
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostQueryDto } from './dto/post-query.dto';
import { PostResponseDto, PostSummaryDto } from './dto/post-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiResponseDto, PaginatedResponseDto } from '../common/dto/api-response.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(ValidationPipe) createPostDto: CreatePostDto,
    @Request() req
  ): Promise<ApiResponseDto<PostResponseDto>> {
    const post = await this.postsService.create(createPostDto, req.user.userId);
    return ApiResponseDto.success(post, 'Post created successfully');
  }

  @Get()
  async findAll(
    @Query(ValidationPipe) queryDto: PostQueryDto
  ): Promise<PaginatedResponseDto<PostSummaryDto>> {
    return await this.postsService.findAll(queryDto);
  }

  @Get('categories')
  async getCategories(): Promise<ApiResponseDto<string[]>> {
    const categories = await this.postsService.getCategories();
    return ApiResponseDto.success(categories, 'Categories retrieved successfully');
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number
  ): Promise<ApiResponseDto<PostResponseDto>> {
    const post = await this.postsService.findOne(id);
    return ApiResponseDto.success(post, 'Post retrieved successfully');
  }

  @Get('author/:authorId')
  async findByAuthor(
    @Param('authorId', ParseIntPipe) authorId: number
  ): Promise<ApiResponseDto<PostSummaryDto[]>> {
    const posts = await this.postsService.findByAuthor(authorId);
    return ApiResponseDto.success(posts, 'Author posts retrieved successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updatePostDto: UpdatePostDto,
    @Request() req
  ): Promise<ApiResponseDto<PostResponseDto>> {
    const post = await this.postsService.update(id, updatePostDto, req.user.userId);
    return ApiResponseDto.success(post, 'Post updated successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req
  ): Promise<void> {
    await this.postsService.remove(id, req.user.userId);
  }
}