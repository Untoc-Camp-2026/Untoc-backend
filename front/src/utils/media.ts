import { BASE_URL } from '@/utils/api';

export const resolveMediaUrl = (url: string | undefined | null): string => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  return `${BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
};
