// types/board.ts (게시판 및 글쓰기)
export type BoardCategory = '자유' | '시험' | '스터디' | '취업' | '게임';

export interface Post {
  id: number;
  category: BoardCategory;
  title: string;
  content: string;
  author: string;
  createdAt: string;    // "2026-07-03T10:00:00Z"
  isAnonymous: boolean; // 익명 여부 체크박스
  attachments?: string[];
}