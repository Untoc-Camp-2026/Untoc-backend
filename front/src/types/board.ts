// front/src/types/board.ts

// 1. 타입을 백엔드의 Enum과 동일하게 영문으로 맞춤
export type BoardCategory = 'FREE' | 'EXAM' | 'STUDY' | 'JOB' | 'GAME';

// 2. UI 렌더링을 위한 한글 매핑 객체 생성
export const BoardCategoryLabel: Record<BoardCategory, string> = {
  FREE: '자유',
  EXAM: '시험',
  STUDY: '스터디',
  JOB: '취업',
  GAME: '게임',
};

export interface Post {
  board_id: number;     // 백엔드의 board_id 응답에 맞춤
  category: BoardCategory;
  title: string;
  content: string;
  user_id: string;      // 백엔드의 user_id 응답에 맞춤 (익명이면 "익명"으로 옴)
  anonymous: boolean;   // 백엔드 anonymous 응답에 맞춤
  file_url?: string;
  is_owner?: boolean;   // 상세 조회 시 본인 글인지 여부
}