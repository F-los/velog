import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostQueryDto } from './dto/post-query.dto';
import { PostResponseDto, PostSummaryDto } from './dto/post-response.dto';
import { PostsRepository } from './posts.repository';
import { PaginatedResponseDto, PaginationDto } from '../common/dto/api-response.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
  ) {}

  async create(createPostDto: CreatePostDto, authorId: number): Promise<PostResponseDto> {
    const postData = {
      ...createPostDto,
      category: createPostDto.category || 'General',
      tags: createPostDto.tags || [],
    };

    const post = await this.postsRepository.create(postData, authorId);
    return plainToInstance(PostResponseDto, post, { excludeExtraneousValues: true });
  }

  async findAll(queryDto: PostQueryDto): Promise<PaginatedResponseDto<PostSummaryDto>> {
    const { posts, total } = await this.postsRepository.findAll(queryDto);

    const postSummaries = posts.map(post =>
      plainToInstance(PostSummaryDto, post, { excludeExtraneousValues: true })
    );

    const pagination = new PaginationDto(
      queryDto.page || 1,
      queryDto.limit || 10,
      total
    );

    return new PaginatedResponseDto(postSummaries, pagination);
  }

  async findOne(id: number): Promise<PostResponseDto> {
    const post = await this.postsRepository.findById(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return plainToInstance(PostResponseDto, post, { excludeExtraneousValues: true });
  }

  async update(id: number, updatePostDto: UpdatePostDto, userId: number): Promise<PostResponseDto> {
    const post = await this.postsRepository.findById(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.author.id !== userId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    const updatedPost = await this.postsRepository.update(id, updatePostDto);
    return plainToInstance(PostResponseDto, updatedPost, { excludeExtraneousValues: true });
  }

  async remove(id: number, userId: number): Promise<void> {
    const post = await this.postsRepository.findById(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.author.id !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.postsRepository.delete(id);
  }

  async findByAuthor(authorId: number): Promise<PostSummaryDto[]> {
    const posts = await this.postsRepository.findByAuthorId(authorId);
    return posts.map(post =>
      plainToInstance(PostSummaryDto, post, { excludeExtraneousValues: true })
    );
  }

  async getCategories(): Promise<string[]> {
    return await this.postsRepository.findCategories();
  }
}