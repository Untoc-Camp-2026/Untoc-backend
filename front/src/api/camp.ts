import { apiClient } from '../utils/api';
import { Project } from '../types/camp';

// 1. 역대 작품 목록 불러오기 (특정 기수 선택 시 필터링)
export const getProjects = async (term?: string) => {
  // term이 있으면 '?term=26-1' 형태로, 없으면 전체 목록 조회
  const queryString = term ? `?term=${term}` : '';
  
  return apiClient<Project[]>(`/projects${queryString}`);
};

// 2. 개별 작품 상세 정보 불러오기 (팝업용)
export const getProjectDetail = async (projectId: number) => {
  return apiClient<Project>(`/projects/${projectId}`);
};