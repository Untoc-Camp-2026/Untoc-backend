// front/src/types/user.ts

// 기존의 'GUEST' | 'MEMBER' | 'ADMIN'은 삭제하고 개발 파트로 변경
export type UserRole = 'BACKEND' | 'FRONTEND';

export interface User {
  id: number;
  loginId: string;
  name: string;
  role?: UserRole;          // 백엔드/프론트엔드 파트 (엑셀 가입시 null일 수도 있으므로 optional)
  cohort: number;           // 기수 (generation)
  admin_status: boolean;    // 백엔드의 관리자 여부 플래그
  activity_status: boolean; // 활동 상태 (백엔드에 있는 필드 추가)
  profileImageUrl?: string;
  introduction?: string;
}