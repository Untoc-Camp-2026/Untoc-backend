// types/executive.ts (구성원 탭의 집행부 명단)
export type ExecutivePosition = '회장' | '부회장' | '총무';

export interface Executive {
  id: number;
  position: ExecutivePosition;
  name: string;
  email: string;
  cohort: number;
  profileImageUrl: string;
}