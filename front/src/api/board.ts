import { apiClient } from '../utils/api';
import { Post, BoardCategory } from '../types/board';

// 1. 특정 카테고리의 게시글 목록 불러오기 (페이징 포함)
export const getPosts = async (category: BoardCategory, page: number = 1) => {
  return apiClient<Post[]>(`/posts?category=${category}&page=${page}`);
};

// 2. 새 게시글 작성하기
export const createPost = async (postData: Omit<Post, 'id' | 'createdAt' | 'author'>) => {
  return apiClient<Post>('/posts', {
    method: 'POST',
    body: JSON.stringify(postData),
  });
};