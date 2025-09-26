import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findById(id: number): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findByUsernameOrEmail(username: string, email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: [
        { username },
        { email }
      ]
    });
  }

  async update(id: number, updateData: Partial<User>): Promise<User | undefined> {
    await this.userRepository.update(id, updateData);
    return await this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async count(): Promise<number> {
    return await this.userRepository.count();
  }
}