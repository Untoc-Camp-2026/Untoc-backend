import { apiClient } from '@/utils/api';
import { getAccessToken } from '@/utils/authStorage';
import type {
  AttendanceRecordResponse,
  AttendanceSessionResponse,
  AttendanceStatus,
  CreateSessionPayload,
  UpdateAttendanceStatusPayload,
} from '@/types/attendance';

const ATTENDANCE_BASE = '/attendance';

const getAuthHeaders = (): HeadersInit => {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const createAttendanceSession = async (
  payload: CreateSessionPayload
): Promise<AttendanceSessionResponse> => {
  return apiClient<AttendanceSessionResponse>(`${ATTENDANCE_BASE}/session`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
};

export const verifyAttendance = async (authCode: string): Promise<{ message: string }> => {
  return apiClient<{ message: string }>(`${ATTENDANCE_BASE}/verify`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ auth_code: authCode }),
  });
};

export const getAttendanceRecords = async (
  targetDate: string
): Promise<AttendanceRecordResponse[]> => {
  return apiClient<AttendanceRecordResponse[]>(
    `${ATTENDANCE_BASE}/records?target_date=${encodeURIComponent(targetDate)}`,
    { headers: getAuthHeaders() }
  );
};

export const updateAttendanceStatus = async (
  payload: UpdateAttendanceStatusPayload
): Promise<AttendanceRecordResponse> => {
  return apiClient<AttendanceRecordResponse>(`${ATTENDANCE_BASE}/admin/update-status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      user_id: payload.userId,
      target_date: payload.targetDate,
      status: payload.status,
    }),
  });
};

export type { AttendanceStatus };
