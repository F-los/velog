import { IsOptional, IsString, IsNumber, Min, Max, Transform } from 'class-validator';
import { Type } from 'class-transformer';

export class PostQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sortBy?: 'createdAt' | 'title' = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @IsOptional()
  @Transform(({ value }) => value?.split(',').filter(Boolean))
  tags?: string[];

  // ✅ 추가: author query param 지원 (기존 /posts/author/:authorId 대체)
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  author?: number;
}