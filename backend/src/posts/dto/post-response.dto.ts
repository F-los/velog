import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class PostResponseDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  category: string;

  @Expose()
  tags: string[];

  @Expose()
  @Type(() => UserResponseDto)
  author: UserResponseDto;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(partial: Partial<PostResponseDto>) {
    Object.assign(this, partial);
  }
}

export class PostSummaryDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  category: string;

  @Expose()
  tags: string[];

  @Expose()
  @Type(() => UserResponseDto)
  author: UserResponseDto;

  @Expose()
  createdAt: Date;

  constructor(partial: Partial<PostSummaryDto>) {
    Object.assign(this, partial);
    // 내용 요약 (150자로 제한)
    if (this.content && this.content.length > 150) {
      this.content = this.content.substring(0, 150) + '...';
    }
  }
}