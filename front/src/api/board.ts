import { apiClient } from '@/utils/api';
import {
  BoardCategory,
  BoardListResponse,
  CreatePostPayload,
  Post,
  PostDetail,
  UpdatePostPayload,
} from '@/types/board';

const BOARD_BASE = '/api/boards';

const getAuthHeaders = (): HeadersInit => {
  if (typeof window === 'undefined') {
    return {};
  }

  const token =
    localStorage.getItem('accessToken') ||
    localStorage.getItem('access_token') ||
    localStorage.getItem('token');

  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getPosts = async (
  category: BoardCategory,
  page: number = 1,
  title?: string
): Promise<BoardListResponse> => {
  const params = new URLSearchParams({ category, page: String(page) });

  if (title?.trim()) {
    params.set('title', title.trim());
  }

  return apiClient<BoardListResponse>(`${BOARD_BASE}?${params.toString()}`);
};

export const createPost = async (postData: CreatePostPayload): Promise<Post> => {
  return apiClient<Post>(BOARD_BASE, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(postData),
  });
};

export const getPostDetail = async (boardId: number): Promise<PostDetail> => {
  return apiClient<PostDetail>(`${BOARD_BASE}/${boardId}`, {
    headers: getAuthHeaders(),
  });
};

export const updatePost = async (boardId: number, postData: UpdatePostPayload): Promise<Post> => {
  return apiClient<Post>(`${BOARD_BASE}/${boardId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(postData),
  });
};

export const deletePost = async (boardId: number): Promise<{ message: string }> => {
  return apiClient<{ message: string }>(`${BOARD_BASE}/${boardId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
};

export const createComment = async (
  boardId: number,
  content: string,
  anonymous: boolean
): Promise<{ comment_id: number; board_id: number }> => {
  return apiClient<{ comment_id: number; board_id: number }>(`${BOARD_BASE}/${boardId}/comments`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ content, anonymous }),
  });
};

export const updateComment = async (
  commentId: number,
  content: string,
  anonymous: boolean
): Promise<{ comment_id: number }> => {
  return apiClient<{ comment_id: number }>(`${BOARD_BASE}/comments/${commentId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ content, anonymous }),
  });
};

export const deleteComment = async (commentId: number): Promise<{ message: string }> => {
  return apiClient<{ message: string }>(`${BOARD_BASE}/comments/${commentId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
};