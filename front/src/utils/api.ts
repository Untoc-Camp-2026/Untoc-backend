// utils/api.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ApiClientOptions extends RequestInit {
  timeoutMs?: number;
}

/**
 * 애플리케이션 공통 API Fetcher
 * 백엔드로 보내는 모든 요청은 이 함수를 통과하게 됩니다.
 */
export const apiClient = async <T>(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<T> => {
  const { timeoutMs = 8000, ...fetchOptions } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  // 💡 추후 로그인 기능이 완성되면, 여기에 토큰을 가져오는 코드를 넣습니다.
  // const token = localStorage.getItem('accessToken');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  // 💡 토큰이 있다면 자동으로 모든 요청의 헤더에 포함시킵니다.
  // if (token) {
  //   headers['Authorization'] = `Bearer ${token}`;
  // }

  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new Error('요청 시간이 초과되었습니다. 백엔드 서버 상태를 확인해주세요.');
    }

    throw new Error('서버에 연결할 수 없습니다. 백엔드가 실행 중인지 확인해주세요.');
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};