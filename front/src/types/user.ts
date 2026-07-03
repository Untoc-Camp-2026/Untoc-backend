// types/user.ts (수정됨: 마이페이지 속성 추가)

export type UserRole = 'GUEST' | 'MEMBER' | 'ADMIN';

export interface User {
  id: number;               // DB 고유 PK
  loginId: string;          // 로그인 아이디
  name: string;             // 이름
  role: UserRole;           // 시스템 권한
  cohort: number;           // 기수
  profileImageUrl?: string; // 마이페이지: 프로필 사진 URL (선택 사항)
  introduction?: string;    // 마이페이지: 자기소개 (선택 사항)
}