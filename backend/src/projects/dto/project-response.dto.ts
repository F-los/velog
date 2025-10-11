import { Expose } from 'class-transformer';

export class ProjectResponseDto {
  @Expose()
  id: number;

  @Expose()
  slug: string;

  @Expose()
  title: string;

  @Expose()
  summary: string;

  @Expose()
  description?: string;

  @Expose()
  techStack: string[];

  @Expose()
  coverUrl?: string;

  @Expose()
  repoUrl?: string;

  @Expose()
  liveUrl?: string;

  @Expose()
  highlight: boolean;

  @Expose()
  order: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
