import { Exclude, Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Exclude()
  password: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}

export class LoginResponseDto {
  access_token: string;
  refresh_token: string;
  user: UserResponseDto;

  constructor(accessToken: string, refreshToken: string, user: UserResponseDto) {
    this.access_token = accessToken;
    this.refresh_token = refreshToken;
    this.user = user;
  }
}