// front/src/api/board.ts
import { apiClient } from '../utils/api';
import { Post, BoardCategory } from '../types/board';

// 1. 목록 불러오기 (카테고리를 영문으로 전송)
export const getPosts = async (category: BoardCategory, page: number = 1) => {
  return apiClient<any>(`/boards?category=${category}&page=${page}`);
};

// 2. 새 게시글 작성하기
export const createPost = async (postData: Omit<Post, 'board_id' | 'user_id' | 'is_owner'>) => {
  return apiClient<Post>('api/boards', {
    method: 'POST',
    body: JSON.stringify(postData),
  });
};

// ================= 여기서부터 추가할 코드 =================

// 3. 개별 게시글 상세 보기
export const getPostDetail = async (boardId: number) => {
  return apiClient<Post>(`/boards/${boardId}`);
};

// 4. 게시글 수정하기
export const updatePost = async (
  boardId: number, 
  postData: Omit<Post, 'board_id' | 'user_id' | 'is_owner'>
) => {
  return apiClient<Post>(`/boards/${boardId}`, {
    method: 'PUT',
    body: JSON.stringify(postData),
  });
};

// 5. 게시글 삭제하기
export const deletePost = async (boardId: number) => {
  return apiClient<{ message: string }>(`/boards/${boardId}`, {
    method: 'DELETE',
  });
};