import {
  Controller,
  Request,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  ValidationPipe
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import { LoginDto } from './dto/login.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { LoginResponseDto, UserResponseDto } from '../users/dto/user-response.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(ValidationPipe) loginDto: LoginDto
  ): Promise<ApiResponseDto<LoginResponseDto>> {
    return await this.authService.login(loginDto);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Request() req): Promise<ApiResponseDto<{ access_token: string }>> {
    return await this.authService.refreshToken(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<ApiResponseDto<UserResponseDto>> {
    return await this.authService.getProfile(req.user.userId);
  }
}