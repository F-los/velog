import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { SeedsController } from './seeds.controller';

@Module({
  imports: [UsersModule],
  controllers: [SeedsController],
})
export class SeedsModule {}