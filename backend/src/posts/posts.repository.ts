import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostQueryDto } from './dto/post-query.dto';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, authorId: number): Promise<Post> {
    const post = this.postRepository.create({
      ...createPostDto,
      author: { id: authorId } as any,
    });
    return await this.postRepository.save(post);
  }

  async findAll(
    queryDto: PostQueryDto,
  ): Promise<{ posts: Post[]; total: number }> {
    const queryBuilder = this.createQueryBuilder(queryDto);

    const [posts, total] = await queryBuilder.getManyAndCount();

    return { posts, total };
  }

  async findById(id: number): Promise<Post | undefined> {
    const post = await this.postRepository.findOne({ where: { id } });
    return post ?? undefined;
  }

  async findByAuthorId(authorId: number): Promise<Post[]> {
    return await this.postRepository.find({
      where: { author: { id: authorId } },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
  ): Promise<Post | undefined> {
    await this.postRepository.update(id, updatePostDto);
    return await this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.postRepository.delete(id);
  }

  async count(): Promise<number> {
    return await this.postRepository.count();
  }

  async findCategories(): Promise<string[]> {
    const result = await this.postRepository
      .createQueryBuilder('post')
      .select('DISTINCT post.category', 'category')
      .where('post.category IS NOT NULL AND post.category != ""')
      .getRawMany();

    return result.map((row) => row.category);
  }

  private createQueryBuilder(queryDto: PostQueryDto): SelectQueryBuilder<Post> {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      tags,
      author,
    } = queryDto;

    // ✅ 수정: SQL Injection 방지 - sortBy whitelist 검증
    const allowedSortFields = ['createdAt', 'title'];
    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'createdAt';

    let queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy(`post.${safeSortBy}`, sortOrder);

    if (category) {
      queryBuilder = queryBuilder.andWhere('post.category = :category', {
        category,
      });
    }

    if (search) {
      queryBuilder = queryBuilder.andWhere(
        '(post.title ILIKE :search OR post.content ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (tags && tags.length > 0) {
      queryBuilder = queryBuilder.andWhere('post.tags && :tags', { tags });
    }

    // ✅ 추가: author 필터 지원 (기존 /posts/author/:authorId를 query param으로 대체)
    if (author) {
      queryBuilder = queryBuilder.andWhere('author.id = :author', { author });
    }

    return queryBuilder;
  }
}
