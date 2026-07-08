import { BASE_URL } from '@/utils/api';
import type { AuthSession, AuthRole } from '@/types/auth';

type LoginResponse = {
  access_token: string;
  token_type: string;
};

type CurrentUserResponse = {
  user_id?: string;
  name?: string;
  role?: string;
  admin_status?: boolean;
  profile_image_url?: string;
  introduction?: string;
};

const buildAuthHeaders = (token: string): HeadersInit => ({
  Authorization: `Bearer ${token}`,
});

const resolveRole = (role: string | undefined, adminStatus: boolean): AuthRole => {
  if (adminStatus) return 'ADMIN';
  if (role === 'BACKEND' || role === 'FRONTEND') return 'MEMBER';
  return 'MEMBER';
};

export const login = async (loginId: string, password: string): Promise<AuthSession> => {
  const body = new URLSearchParams();
  body.set('username', loginId);
  body.set('password', password);

  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || '로그인에 실패했습니다.');
  }

  const loginResponse = (await response.json()) as LoginResponse;

  const profile = await fetchCurrentUser(loginResponse.access_token).catch(() => null);

  return {
    accessToken: loginResponse.access_token,
    userId: profile?.user_id || loginId,
    name: profile?.name,
    role: resolveRole(profile?.role, Boolean(profile?.admin_status)),
    adminStatus: Boolean(profile?.admin_status),
    profileImageUrl: profile?.profile_image_url,
    introduction: profile?.introduction,
  };
};

export const fetchCurrentUser = async (token: string): Promise<CurrentUserResponse> => {
  const response = await fetch(`${BASE_URL}/me`, {
    headers: buildAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error('현재 사용자 정보를 불러오지 못했습니다.');
  }

  return response.json();
};

export const updateProfile = async (token: string, introduction: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/me/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...buildAuthHeaders(token),
    },
    body: JSON.stringify({ introduction }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || '프로필 저장에 실패했습니다.');
  }
};

export const updatePassword = async (
  token: string,
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  const response = await fetch(`${BASE_URL}/me/password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...buildAuthHeaders(token),
    },
    body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || '비밀번호 변경에 실패했습니다.');
  }
};

export const updateProfileImage = async (token: string, profileImageUrl: string): Promise<string> => {
  const response = await fetch(`${BASE_URL}/me/profile-image`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...buildAuthHeaders(token),
    },
    body: JSON.stringify({ profile_image_url: profileImageUrl }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || '프로필 이미지 저장에 실패했습니다.');
  }

  const data = (await response.json()) as { profile_image_url?: string };
  return data.profile_image_url || profileImageUrl;
};

export const uploadProfileImage = async (token: string, file: Blob): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file, 'profile.jpg');

  const response = await fetch(`${BASE_URL}/api/files/upload`, {
    method: 'POST',
    headers: buildAuthHeaders(token),
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || '이미지 업로드에 실패했습니다.');
  }

  const data = (await response.json()) as { file_url?: string };
  if (!data.file_url) {
    throw new Error('업로드된 이미지 URL을 받지 못했습니다.');
  }

  return data.file_url;
};