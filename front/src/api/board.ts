// front/src/api/board.ts
import { Post, BoardCategory } from '../types/board';

// 1. 목록 불러오기
export const getPosts = async (category: BoardCategory, page: number = 1) => {
  return {
    total_count: 50,
    items: [
      {
        board_id: (page - 1) * 10 + 5,
        title: "디자인 시안이랑 똑같이 만들어봤어요!",
        content: "프론트엔드 작업 너무 재밌네요.",
        category: category,
        user_id: "프론트장인",
        anonymous: false,
      },
      // ... (기존 더미 데이터 유지)
    ]
  };
};

export const createPost = async (postData: Omit<Post, 'board_id' | 'user_id' | 'is_owner'>) => {
  return { board_id: 999, user_id: "프론트장인", ...postData };
};

// 🌟 2. 개별 게시글 상세 보기 (댓글 데이터 추가)
export const getPostDetail = async (boardId: number) => {
  return {
    board_id: boardId,
    title: "게시글 상세 페이지 테스트",
    content: "이곳에 게시글 본문 내용이 들어갑니다. 현재 프론트엔드 단독 테스트를 위해 가짜 데이터를 띄워주고 있습니다.",
    category: "FREE" as BoardCategory,
    user_id: "익명",
    anonymous: true,
    is_owner: true, // 본인 글이라고 가정 (수정/삭제 버튼 보임)
    comments: [
      {
        comment_id: 1,
        board_id: boardId,
        user_id: "익1",
        content: "나 두더진데 이거 ㄹㅇ임",
        anonymous: true,
        created_at: "2026-07-04T10:00:00Z",
        is_owner: true, // 내 댓글이라고 가정 (수정/삭제 버튼 보임)
      },
      {
        comment_id: 2,
        board_id: boardId,
        user_id: "익3",
        content: "와 진짜라고?",
        anonymous: true,
        created_at: "2026-07-04T10:05:00Z",
        is_owner: false, // 남의 댓글 (버튼 안 보임)
      }
    ]
  };
};

export const updatePost = async (boardId: number, postData: any) => {
  return { board_id: boardId, user_id: "프론트장인", ...postData };
};

export const deletePost = async (boardId: number) => {
  return { message: "게시글 삭제 완료 (더미)" };
};

// 🌟 3. 댓글 관련 더미 API 추가
export const createComment = async (boardId: number, content: string, anonymous: boolean) => {
  console.log('댓글 작성:', { boardId, content, anonymous });
  return { message: "댓글 작성 성공" };
};

export const updateComment = async (commentId: number, content: string) => {
  console.log('댓글 수정:', { commentId, content });
  return { message: "댓글 수정 성공" };
};

export const deleteComment = async (commentId: number) => {
  console.log('댓글 삭제:', { commentId });
  return { message: "댓글 삭제 성공" };
};