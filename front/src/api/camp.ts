import { apiClient } from '@/utils/api';
import type { CampProject } from '@/types/camp';

const CAMP_BASE = '/api/camp';

export const getCampTerms = async (): Promise<string[]> => {
  return apiClient<string[]>(`${CAMP_BASE}/terms`);
};

export const getCampProjects = async (term?: string): Promise<CampProject[]> => {
  const query = term ? `?term=${encodeURIComponent(term)}` : '';
  return apiClient<CampProject[]>(`${CAMP_BASE}/projects${query}`);
};
