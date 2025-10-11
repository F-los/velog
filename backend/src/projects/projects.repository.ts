import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Project } from '@prisma/client';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectQueryDto } from './dto/project-query.dto';

@Injectable()
export class ProjectsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    return this.prisma.project.create({
      data: createProjectDto,
    });
  }

  async findAll(queryDto: ProjectQueryDto): Promise<{ projects: Project[]; total: number }> {
    const { highlight, limit = 10, page = 1 } = queryDto;

    const where = highlight !== undefined ? { highlight } : {};

    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        orderBy: [
          { highlight: 'desc' },
          { order: 'asc' },
          { createdAt: 'desc' },
        ],
        take: limit,
        skip: (page - 1) * limit,
      }),
      this.prisma.project.count({ where }),
    ]);

    return { projects, total };
  }

  async findBySlug(slug: string): Promise<Project | null> {
    return this.prisma.project.findUnique({
      where: { slug },
    });
  }

  async findById(id: number): Promise<Project | null> {
    return this.prisma.project.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    return this.prisma.project.update({
      where: { id },
      data: updateProjectDto,
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.project.delete({
      where: { id },
    });
  }
}
