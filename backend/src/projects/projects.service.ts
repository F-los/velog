import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectQueryDto } from './dto/project-query.dto';
import { ProjectResponseDto } from './dto/project-response.dto';
import { ProjectsRepository } from './projects.repository';

@Injectable()
export class ProjectsService {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async create(createProjectDto: CreateProjectDto): Promise<ProjectResponseDto> {
    const project = await this.projectsRepository.create(createProjectDto);
    return plainToInstance(ProjectResponseDto, project, { excludeExtraneousValues: true });
  }

  async findAll(queryDto: ProjectQueryDto): Promise<{ projects: ProjectResponseDto[]; total: number }> {
    const { projects, total } = await this.projectsRepository.findAll(queryDto);

    const projectDtos = projects.map(project =>
      plainToInstance(ProjectResponseDto, project, { excludeExtraneousValues: true })
    );

    return { projects: projectDtos, total };
  }

  async findBySlug(slug: string): Promise<ProjectResponseDto> {
    const project = await this.projectsRepository.findBySlug(slug);

    if (!project) {
      throw new NotFoundException(`Project with slug '${slug}' not found`);
    }

    return plainToInstance(ProjectResponseDto, project, { excludeExtraneousValues: true });
  }

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<ProjectResponseDto> {
    const existingProject = await this.projectsRepository.findById(id);

    if (!existingProject) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    const updatedProject = await this.projectsRepository.update(id, updateProjectDto);
    return plainToInstance(ProjectResponseDto, updatedProject, { excludeExtraneousValues: true });
  }

  async delete(id: number): Promise<void> {
    const existingProject = await this.projectsRepository.findById(id);

    if (!existingProject) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    await this.projectsRepository.delete(id);
  }
}
