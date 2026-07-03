// utils/api.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * 애플리케이션 공통 API Fetcher
 * 백엔드로 보내는 모든 요청은 이 함수를 통과하게 됩니다.
 */
export const apiClient = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  
  // 💡 추후 로그인 기능이 완성되면, 여기에 토큰을 가져오는 코드를 넣습니다.
  // const token = localStorage.getItem('accessToken');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // 💡 토큰이 있다면 자동으로 모든 요청의 헤더에 포함시킵니다.
  // if (token) {
  //   headers['Authorization'] = `Bearer ${token}`;
  // }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // 401(인증 만료), 403(권한 없음) 등의 전역 에러를 여기서 한 번에 처리할 수 있습니다.
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};