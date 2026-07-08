export type AttendanceStatus = '출석' | '결석';

export interface AttendanceSessionResponse {
  id: number;
  auth_code: string;
  expires_at: string;
}

export interface AttendanceRecordResponse {
  user_id: string;
  date: string;
  status: AttendanceStatus;
  attended_at?: string | null;
}

export interface CreateSessionPayload {
  title: string;
  location: string;
  duration_minutes: number;
}

export interface UpdateAttendanceStatusPayload {
  userId: string;
  targetDate: string;
  status: AttendanceStatus;
}

export interface AttendanceMemberRow {
  userId: string;
  status: AttendanceStatus | '미체크';
}
