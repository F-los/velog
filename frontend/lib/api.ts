const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author?: User;
}

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
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Auth methods
  async login(username: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const response = await this.makeRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (response.data) {
      this.setTokens(response.data.access_token, response.data.refresh_token);
    }

    return response;
  }

  async register(username: string, email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const response = await this.makeRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });

    if (response.data) {
      this.setTokens(response.data.access_token, response.data.refresh_token);
    }

    return response;
  }

  async refreshToken(): Promise<ApiResponse<{ access_token: string }>> {
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
      return { error: 'No refresh token available' };
    }

    const response = await this.makeRequest<{ access_token: string }>('/auth/refresh', {
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

  // User methods
  async getUser(id: number): Promise<ApiResponse<User>> {
    return this.makeRequest<User>(`/users/${id}`);
  }

  // Post methods
  async getPosts(): Promise<ApiResponse<Post[]>> {
    return this.makeRequest<Post[]>('/posts');
  }

  async getPost(id: number): Promise<ApiResponse<Post>> {
    return this.makeRequest<Post>(`/posts/${id}`);
  }

  async getPostsByAuthor(authorId: number): Promise<ApiResponse<Post[]>> {
    return this.makeRequest<Post[]>(`/posts/author/${authorId}`);
  }

  async createPost(title: string, content: string, excerpt: string): Promise<ApiResponse<Post>> {
    return this.makeRequest<Post>('/posts', {
      method: 'POST',
      body: JSON.stringify({ title, content, excerpt }),
    });
  }

  async updatePost(id: number, title: string, content: string, excerpt: string): Promise<ApiResponse<Post>> {
    return this.makeRequest<Post>(`/posts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ title, content, excerpt }),
    });
  }

  async deletePost(id: number): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/posts/${id}`, {
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