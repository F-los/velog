/**
 * API Client
 * Single Responsibility: HTTP 통신만 담당
 */

import type {
  ApiResponse,
  PaginatedResponse,
  User,
  Post,
  PostSummary,
  CreatePostDto,
  UpdatePostDto,
  PostQueryParams,
  LoginDto,
  AuthResponse,
  RefreshTokenResponse,
  CreateUserDto,
  UpdateUserDto,
  Project,
  CreateProjectDto,
  UpdateProjectDto,
  ProjectQueryParams,
  ProjectsResponse,
} from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  private baseURL: string;
  private accessToken: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;

    // Load token from localStorage if available
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('access_token');
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // 🔑 매번 요청 시 localStorage에서 최신 토큰 확인
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('access_token');
    }

    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error(`API Error (${response.status}):`, endpoint, responseData.message);
        return {
          success: false,
          error: responseData.message || responseData.error || 'API request failed',
          message: responseData.message,
        };
      }

      // Backend ApiResponseDto 형식을 그대로 반환
      return responseData;
    } catch (error) {
      console.error('API request failed:', endpoint, error instanceof Error ? error.message : error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // ============================================
  // Auth Methods
  // ============================================

  async login(loginDto: LoginDto): Promise<ApiResponse<AuthResponse>> {
    const response = await this.makeRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginDto),
    });

    if (response.data) {
      this.setTokens(response.data.access_token, response.data.refresh_token);
    }

    return response;
  }

  async register(createUserDto: CreateUserDto): Promise<ApiResponse<AuthResponse>> {
    const response = await this.makeRequest<AuthResponse>('/users', {
      method: 'POST',
      body: JSON.stringify(createUserDto),
    });

    if (response.data) {
      this.setTokens(response.data.access_token, response.data.refresh_token);
    }

    return response;
  }

  async refreshToken(): Promise<ApiResponse<RefreshTokenResponse>> {
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
      return { success: false, error: 'No refresh token available' };
    }

    const response = await this.makeRequest<RefreshTokenResponse>('/auth/refresh', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (response.data) {
      this.setTokens(response.data.access_token);
    }

    return response;
  }

  async getProfile(): Promise<ApiResponse<User>> {
    return this.makeRequest<User>('/auth/profile');
  }

  // ============================================
  // User Methods
  // ============================================

  async getUser(id: number): Promise<ApiResponse<User>> {
    return this.makeRequest<User>(`/users/${id}`);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<ApiResponse<User>> {
    return this.makeRequest<User>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateUserDto),
    });
  }

  // ============================================
  // Post Methods
  // ============================================

  async getPosts(params?: PostQueryParams): Promise<ApiResponse<PostSummary[]>> {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.makeRequest<PostSummary[]>(`/posts${queryString}`);
  }

  async getPost(id: number): Promise<ApiResponse<Post>> {
    return this.makeRequest<Post>(`/posts/${id}`);
  }

  async getPostsByAuthor(authorId: number): Promise<ApiResponse<PostSummary[]>> {
    return this.makeRequest<PostSummary[]>(`/posts?author=${authorId}`);
  }

  async createPost(createPostDto: CreatePostDto): Promise<ApiResponse<Post>> {
    return this.makeRequest<Post>('/posts', {
      method: 'POST',
      body: JSON.stringify(createPostDto),
    });
  }

  async updatePost(id: number, updatePostDto: UpdatePostDto): Promise<ApiResponse<Post>> {
    return this.makeRequest<Post>(`/posts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updatePostDto),
    });
  }

  async deletePost(id: number): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/posts/${id}`, {
      method: 'DELETE',
    });
  }

  async getCategories(): Promise<ApiResponse<string[]>> {
    return this.makeRequest<string[]>('/posts/categories');
  }

  // ============================================
  // Project Methods
  // ============================================

  async getProjects(params?: ProjectQueryParams): Promise<ApiResponse<ProjectsResponse>> {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.makeRequest<ProjectsResponse>(`/projects${queryString}`);
  }

  async getProject(slug: string): Promise<ApiResponse<Project>> {
    return this.makeRequest<Project>(`/projects/${slug}`);
  }

  async createProject(createProjectDto: CreateProjectDto): Promise<ApiResponse<Project>> {
    return this.makeRequest<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(createProjectDto),
    });
  }

  async updateProject(id: number, updateProjectDto: UpdateProjectDto): Promise<ApiResponse<Project>> {
    return this.makeRequest<Project>(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateProjectDto),
    });
  }

  async deleteProject(id: number): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Token management
  private setTokens(accessToken: string, refreshToken?: string): void {
    this.accessToken = accessToken;

    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', accessToken);
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }
    }
  }

  logout(): void {
    this.accessToken = null;

    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  getCurrentUser(): User | null {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('current_user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }
}

export const apiClient = new ApiClient();