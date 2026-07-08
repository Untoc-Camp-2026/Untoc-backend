import { BASE_URL } from '@/utils/api';
import { getAccessToken } from '@/utils/authStorage';

export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const token = getAccessToken();
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await fetch(`${BASE_URL}/api/files/upload`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || '파일 업로드에 실패했습니다.');
  }

  const data = (await response.json()) as { file_url?: string };
  if (!data.file_url) {
    throw new Error('업로드된 파일 URL을 받지 못했습니다.');
  }

  return data.file_url;
};
