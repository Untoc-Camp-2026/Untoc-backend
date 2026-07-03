// src/api/calendar.ts
import { apiClient } from '../utils/api';
import { CalendarEvent } from '../types/calendar';

// 월별 일정 가져오기 (예: year=2026, month=7)
export const getMonthlyEvents = async (year: number, month: number) => {
  return apiClient<CalendarEvent[]>(`/calendar?year=${year}&month=${month}`);
};

// 새 일정 등록하기
export const createEvent = async (eventData: Omit<CalendarEvent, 'id'>) => {
  return apiClient<CalendarEvent>('/calendar', {
    method: 'POST',
    body: JSON.stringify(eventData),
  });
};