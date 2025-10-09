import { Controller, Post, Body, Get, Param, Patch, UseGuards, Request, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ✅ User Registration: 3 requests per 5 minutes (spam protection)
  @Throttle({ default: { limit: 3, ttl: 300000 } })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<ApiResponseDto<UserResponseDto>> {
    const user = await this.usersService.create(createUserDto);
    return ApiResponseDto.success(user, 'User created successfully');
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseDto<UserResponseDto>> {
    const user = await this.usersService.findOne(id);
    return ApiResponseDto.success(user, 'User retrieved successfully');
  }

  // ✅ User Update: Protected, user can only update their own information
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req
  ): Promise<ApiResponseDto<UserResponseDto>> {
    const user = await this.usersService.update(id, updateUserDto, req.user.userId);
    return ApiResponseDto.success(user, 'User updated successfully');
  }
}