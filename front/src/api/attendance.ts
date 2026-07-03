// src/api/attendance.ts
import { apiClient } from '../utils/api';
import { AttendanceRecord } from '../types/attendance';

// 특정 날짜의 출석부 불러오기
export const getAttendance = async (date: string) => {
  return apiClient<AttendanceRecord>(`/attendance?date=${date}`);
};

// 사용자가 출석 코드 입력하여 출석 체크하기
export const submitAttendance = async (code: string) => {
  return apiClient<{ success: boolean; message: string }>('/attendance/submit', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
};