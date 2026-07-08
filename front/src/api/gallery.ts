import { apiClient } from '@/utils/api';
import type { GalleryItem } from '@/types/gallery';

const GALLERY_BASE = '/gallery';

export const getGalleries = async (filters?: {
  year?: number;
  semester?: number;
  name?: string;
}): Promise<GalleryItem[]> => {
  const params = new URLSearchParams();

  if (filters?.year !== undefined) params.set('year', String(filters.year));
  if (filters?.semester !== undefined) params.set('semester', String(filters.semester));
  if (filters?.name) params.set('name', filters.name);

  const query = params.toString();
  return apiClient<GalleryItem[]>(`${GALLERY_BASE}${query ? `?${query}` : ''}`);
};

export const parseTerm = (term: string): { year: number; semester: number } | null => {
  const [yearPart, semesterPart] = term.split('-');
  if (!yearPart || !semesterPart) return null;

  const shortYear = Number(yearPart);
  const semester = Number(semesterPart);
  if (Number.isNaN(shortYear) || Number.isNaN(semester)) return null;

  return {
    year: shortYear < 100 ? 2000 + shortYear : shortYear,
    semester,
  };
};

export const formatTerm = (year: number, semester: number) =>
  `${String(year).slice(-2)}-${semester}`;
