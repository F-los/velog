export class ApiResponseDto<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;

  constructor(success: boolean, data?: T, message?: string, error?: string) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.error = error;
  }

  static success<T>(data: T, message?: string): ApiResponseDto<T> {
    return new ApiResponseDto(true, data, message);
  }

  static error(error: string, message?: string): ApiResponseDto<null> {
    return new ApiResponseDto(false, null, message, error);
  }
}

export class PaginationDto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;

  constructor(page: number, limit: number, total: number) {
    this.page = page;
    this.limit = limit;
    this.total = total;
    this.totalPages = Math.ceil(total / limit);
  }
}

export class PaginatedResponseDto<T> extends ApiResponseDto<T[]> {
  pagination: PaginationDto;

  constructor(data: T[], pagination: PaginationDto, message?: string) {
    super(true, data, message);
    this.pagination = pagination;
  }
}