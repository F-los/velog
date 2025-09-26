import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.usersRepository.findByUsernameOrEmail(
      createUserDto.username,
      createUserDto.email
    );

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const userData = {
      ...createUserDto,
      password: hashedPassword,
    };

    const user = await this.usersRepository.create(userData);
    return plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true });
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true });
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return await this.usersRepository.findByUsername(username);
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  async getUserProfile(id: number): Promise<UserResponseDto> {
    return await this.findOne(id);
  }
}