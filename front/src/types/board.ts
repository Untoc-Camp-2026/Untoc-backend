export type BoardCategory = 'FREE' | 'EXAM' | 'STUDY' | 'JOB' | 'GAME';

export const BoardCategoryLabel: Record<BoardCategory, string> = {
  FREE: '자유',
  EXAM: '시험',
  STUDY: '스터디',
  JOB: '취업',
  GAME: '게임',
};

export interface Post {
  board_id: number;
  user_id: string;
  title: string;
  content: string;
  category: BoardCategory;
  anonymous: boolean;
  file_url?: string | null;
}

export interface Comment {
  comment_id: number;
  board_id: number;
  user_id: string;
  content: string;
  anonymous: boolean;
  created_at: string;
  is_owner: boolean;
}

export interface PostDetail extends Post {
  is_owner: boolean;
  comments: Comment[];
}

export interface BoardListResponse {
  total_count: number;
  items: Post[];
}

export interface CreatePostPayload {
  title: string;
  content: string;
  category: BoardCategory;
  anonymous: boolean;
  file_url?: string;
}

export interface UpdatePostPayload extends CreatePostPayload {}