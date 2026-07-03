import { apiClient } from '../utils/api';

// 1. 로그인 (FastAPI 규격에 맞춘 폼 데이터 전송 ★핵심)
export const login = async (loginId: string, password: string) => {
  const params = new URLSearchParams();
  params.append('username', loginId); // FastAPI는 무조건 username으로 받습니다.
  params.append('password', password);

  // 응답으로 { access_token: "...", token_type: "bearer" } 가 옵니다.
  return apiClient<{ access_token: string; token_type: string }>('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });
};

// 2. 내 토큰 확인용 테스트 (GET /me)
export const getMe = async () => {
  return apiClient<{ message: string; token: string }>('/me');
};