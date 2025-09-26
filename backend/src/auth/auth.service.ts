import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto, UserResponseDto } from '../users/dto/user-response.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByUsername(username);
    if (user && await this.usersService.validatePassword(user, password)) {
      return user;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<ApiResponseDto<LoginResponseDto>> {
    const user = await this.validateUser(loginDto.username, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.username, sub: user.id };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    const userResponse = plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true
    });

    const loginResponse = new LoginResponseDto(accessToken, refreshToken, userResponse);

    return ApiResponseDto.success(loginResponse, 'Login successful');
  }

  async refreshToken(user: any): Promise<ApiResponseDto<{ access_token: string }>> {
    const payload = { username: user.username, sub: user.userId };
    const accessToken = this.jwtService.sign(payload);

    return ApiResponseDto.success({ access_token: accessToken }, 'Token refreshed');
  }

  async getProfile(userId: number): Promise<ApiResponseDto<UserResponseDto>> {
    const user = await this.usersService.getUserProfile(userId);
    return ApiResponseDto.success(user, 'Profile retrieved successfully');
  }
}