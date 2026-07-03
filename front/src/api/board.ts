// front/src/api/board.ts
import { Post, BoardCategory } from '../types/board';

// 1. 목록 불러오기 (백엔드 요청 대신 가짜 데이터 반환!)
export const getPosts = async (category: BoardCategory, page: number = 1) => {
  console.log(`[더미 데이터] ${category} 게시판 ${page}페이지 로드됨`);
  
  // 백엔드가 없어도 UI를 그릴 수 있도록 가짜(Mock) 데이터를 반환합니다.
  return {
    total_count: 50, // 총 게시글 수 (임의)
    items: [
      {
        board_id: (page - 1) * 10 + 5,
        title: "디자인 시안이랑 똑같이 만들어봤어요!",
        content: "프론트엔드 작업 너무 재밌네요.",
        category: category,
        user_id: "프론트장인",
        anonymous: false,
      },
      {
        board_id: (page - 1) * 10 + 4,
        title: "게시판 UI 연동 테스트 중입니다.",
        content: "백엔드 없이 가짜 데이터로 테스트 중!",
        category: category,
        user_id: "익명",
        anonymous: true,
      },
      {
        board_id: (page - 1) * 10 + 3,
        title: "오늘 점심 메뉴 추천받습니다",
        content: "다들 뭐 드시나요?",
        category: category,
        user_id: "배고픈개발자",
        anonymous: false,
      },
      {
        board_id: (page - 1) * 10 + 2,
        title: "리액트 너무 어렵네요 ㅠㅠ",
        content: "useState 쓰다가 멘붕왔습니다...",
        category: category,
        user_id: "익명",
        anonymous: true,
      },
      {
        board_id: (page - 1) * 10 + 1,
        title: "언톡 홈페이지 화이팅!",
        content: "빨리 완성해서 배포해봐요~",
        category: category,
        user_id: "열정맨",
        anonymous: false,
      },
    ]
  };
};

// 2. 새 게시글 작성하기 (실제로는 작성이 안 되지만 성공한 것처럼 동작)
export const createPost = async (postData: Omit<Post, 'board_id' | 'user_id' | 'is_owner'>) => {
  console.log('가짜 게시글 작성 시도:', postData);
  return {
    board_id: 999,
    user_id: "프론트장인",
    ...postData
  };
};

// 3. 개별 게시글 상세 보기 (가짜 데이터)
export const getPostDetail = async (boardId: number) => {
  return {
    board_id: boardId,
    title: "가짜 상세 페이지입니다.",
    content: "이것은 더미 데이터 내용입니다.",
    category: "FREE",
    user_id: "프론트장인",
    anonymous: false,
  };
};

// 4. 게시글 수정하기 (가짜 통과)
export const updatePost = async (
  boardId: number, 
  postData: Omit<Post, 'board_id' | 'user_id' | 'is_owner'>
) => {
  return { board_id: boardId, user_id: "프론트장인", ...postData };
};

// 5. 게시글 삭제하기 (가짜 통과)
export const deletePost = async (boardId: number) => {
  return { message: "삭제 완료 (더미)" };
};