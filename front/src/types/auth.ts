export type AuthRole = 'GUEST' | 'MEMBER' | 'ADMIN';

export interface AuthSession {
  accessToken: string;
  userId: string;
  name?: string;
  role: AuthRole;
  adminStatus: boolean;
  profileImageUrl?: string;
  introduction?: string;
}