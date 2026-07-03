import { apiClient } from '../utils/api';

// [응답 타입들]
export interface AttendanceRecordResponse {
  id: number;
  user_id: string;
  session_id: number;
  attended_at: string;
}

// 1. [관리자용] 출석 세션 및 코드 생성
export const createSession = async (data: { title: string; location: string; duration_minutes: number }) => {
  return apiClient<{ id: number; auth_code: string; expires_at: string }>('/attendance/session', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// 2. [유저용] 출석 코드 인증
export const verifyAttendance = async (user_id: string, auth_code: string) => {
  return apiClient<{ message: string; attended_at: string }>('/attendance/verify', {
    method: 'POST',
    body: JSON.stringify({ user_id, auth_code }),
  });
};

// 3. [관리자용] 특정 날짜 출석 기록 조회 (날짜 형식: YYYY-MM-DD)
export const getAttendanceRecords = async (target_date: string) => {
  return apiClient<AttendanceRecordResponse[]>(`/attendance/records?target_date=${target_date}`);
};

// 4. [관리자용] 특정 출석 기록 수정
export const updateAttendanceRecord = async (record_id: number, attendance_date: string) => {
  return apiClient<AttendanceRecordResponse>(`/attendance/records/${record_id}`, {
    method: 'PUT',
    body: JSON.stringify({ attendance_date }),
  });
};