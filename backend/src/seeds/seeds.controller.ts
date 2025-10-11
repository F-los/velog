import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Controller('seeds')
export class SeedsController {
  constructor(private readonly usersService: UsersService) {}

  @Post('admin')
  async createAdmin(@Body() body: { secretKey?: string }) {
    // 보안을 위한 간단한 시크릿 키 체크
    const expectedSecret = process.env.SEED_SECRET || 'seed-admin-2024';
    if (body.secretKey !== expectedSecret) {
      throw new UnauthorizedException('Invalid secret key');
    }

    try {
      // admin 사용자가 이미 존재하는지 확인
      const existingAdmin = await this.usersService.findByUsername('admin');
      if (existingAdmin) {
        return {
          success: false,
          message: 'Admin user already exists',
          data: {
            username: existingAdmin.username,
            email: existingAdmin.email,
            id: existingAdmin.id
          }
        };
      }

      // admin 사용자 생성
      const adminData = {
        username: 'admin',
        email: 'admin@velog.com',
        password: 'admin123!'
      };

      const adminUser = await this.usersService.create(adminData);

      return {
        success: true,
        message: 'Admin user created successfully',
        data: {
          username: adminUser.username,
          email: adminUser.email,
          id: adminUser.id,
          password: adminData.password // 초기 비밀번호 반환 (개발용)
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error creating admin user',
        error: error.message
      };
    }
  }
}