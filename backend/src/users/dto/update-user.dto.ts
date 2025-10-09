import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

/**
 * Update User DTO
 * Single Responsibility: User 업데이트 요청 데이터 검증
 */
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
