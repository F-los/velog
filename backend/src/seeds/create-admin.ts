import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

async function createAdminUser() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userRepository = app.get<Repository<User>>(getRepositoryToken(User));

  const adminData = {
    username: 'admin',
    email: 'admin@velog.com',
    password: 'admin123!'
  };

  try {
    // Check if admin user already exists
    const existingAdmin = await userRepository.findOne({
      where: [
        { username: adminData.username },
        { email: adminData.email }
      ]
    });

    if (existingAdmin) {
      console.log('Admin user already exists!');
      await app.close();
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    const adminUser = userRepository.create({
      username: adminData.username,
      email: adminData.email,
      password: hashedPassword,
    });

    const savedUser = await userRepository.save(adminUser);

    console.log('Admin user created successfully!');
    console.log('Username:', adminData.username);
    console.log('Email:', adminData.email);
    console.log('Password:', adminData.password);
    console.log('User ID:', savedUser.id);

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await app.close();
  }
}

createAdminUser();