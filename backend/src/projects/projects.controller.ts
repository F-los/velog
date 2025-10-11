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
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectQueryDto } from './dto/project-query.dto';
import { ProjectResponseDto } from './dto/project-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // Public routes
  @Get()
  async findAll(
    @Query() queryDto: ProjectQueryDto
  ): Promise<ApiResponseDto<{ projects: ProjectResponseDto[]; total: number }>> {
    const result = await this.projectsService.findAll(queryDto);
    return ApiResponseDto.success(result, 'Projects retrieved successfully');
  }

  @Get(':slug')
  async findOne(
    @Param('slug') slug: string
  ): Promise<ApiResponseDto<ProjectResponseDto>> {
    const project = await this.projectsService.findBySlug(slug);
    return ApiResponseDto.success(project, 'Project retrieved successfully');
  }

  // Admin routes (protected)
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createProjectDto: CreateProjectDto
  ): Promise<ApiResponseDto<ProjectResponseDto>> {
    const project = await this.projectsService.create(createProjectDto);
    return ApiResponseDto.success(project, 'Project created successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto
  ): Promise<ApiResponseDto<ProjectResponseDto>> {
    const project = await this.projectsService.update(id, updateProjectDto);
    return ApiResponseDto.success(project, 'Project updated successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.projectsService.delete(id);
  }
}
