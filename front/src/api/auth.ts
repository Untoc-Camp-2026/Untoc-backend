import { apiClient } from '../utils/api';
import { User } from '../types/user';

// 로그인 응답으로 받을 데이터 규격 (임시)
interface LoginResponse {
  accessToken: string;
  user: User;
}

// 1. 로그인 요청
export const login = async (loginId: string, password: string) => {
  return apiClient<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ loginId, password }),
  });
};

// 2. 내 프로필 정보 가져오기
export const getMyProfile = async () => {
  return apiClient<User>('/auth/me');
};

// 3. 프로필 업데이트 (사진, 자기소개, 비밀번호 변경)
export const updateProfile = async (updateData: Partial<User> & { oldPassword?: string; newPassword?: string }) => {
  return apiClient<User>('/auth/me', {
    method: 'PATCH',
    body: JSON.stringify(updateData),
  });
};