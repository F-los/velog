/**
 * API 타입 정의
 * Single Source of Truth: 모든 API 관련 타입은 이 파일에서만 정의
 */

// ============================================
// Common API Response Types
// ============================================

/**
 * 표준 API 응답 형식
 * Backend ApiResponseDto와 일치
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Pagination 메타데이터
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated API 응답
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationMeta;
}

// ============================================
// User Types
// ============================================

/**
 * User 엔티티
 * Backend UserResponseDto와 일치
 */
export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * User 생성 요청
 */
export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
}

/**
 * User 수정 요청
 */
export interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
}

// ============================================
// Post Types
// ============================================

/**
 * Post 엔티티 (전체 정보)
 * Backend PostResponseDto와 일치
 */
export interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
  author: User;
  createdAt: string;
  updatedAt: string;
}

/**
 * Post 요약 정보 (목록용)
 * Backend PostSummaryDto와 일치
 * content는 150자로 자동 truncate됨
 */
export interface PostSummary {
  id: number;
  title: string;
  content: string; // Truncated to 150 chars
  category: string;
  tags: string[];
  author: User;
  createdAt: string;
}

/**
 * Post 생성 요청
 */
export interface CreatePostDto {
  title: string;
  content: string;
  category?: string;
  tags?: string[];
}

/**
 * Post 수정 요청
 */
export interface UpdatePostDto {
  title?: string;
  content?: string;
  category?: string;
  tags?: string[];
}

/**
 * Post 조회 쿼리 파라미터
 */
export interface PostQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  tags?: string[];
  sortBy?: 'createdAt' | 'title';
  sortOrder?: 'ASC' | 'DESC';
}

// ============================================
// Auth Types
// ============================================

/**
 * Login 요청
 */
export interface LoginDto {
  username: string;
  password: string;
}

/**
 * Login 응답
 */
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

/**
 * Token refresh 응답
 */
export interface RefreshTokenResponse {
  access_token: string;
}

// ============================================
// Project Types
// ============================================

/**
 * Project 엔티티
 * Backend ProjectResponseDto와 일치
 */
export interface Project {
  id: number;
  slug: string;
  title: string;
  summary: string;
  description?: string;
  techStack: string[];
  coverUrl?: string;
  repoUrl?: string;
  liveUrl?: string;
  highlight: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Project 생성 요청
 */
export interface CreateProjectDto {
  slug: string;
  title: string;
  summary: string;
  description?: string;
  techStack: string[];
  coverUrl?: string;
  repoUrl?: string;
  liveUrl?: string;
  highlight?: boolean;
  order?: number;
}

/**
 * Project 수정 요청
 */
export interface UpdateProjectDto {
  slug?: string;
  title?: string;
  summary?: string;
  description?: string;
  techStack?: string[];
  coverUrl?: string;
  repoUrl?: string;
  liveUrl?: string;
  highlight?: boolean;
  order?: number;
}

/**
 * Project 조회 쿼리 파라미터
 */
export interface ProjectQueryParams {
  highlight?: boolean;
  limit?: number;
  page?: number;
}

/**
 * Projects 응답 (목록)
 */
export interface ProjectsResponse {
  projects: Project[];
  total: number;
}
