// types/attendance.ts (출석부)
export type AttendanceStatus = '출석' | '지각' | '결석';

export interface AttendanceRecord {
  date: string;         // "2026-09-03"
  allowedTime: string;  // "10:00"
  code: string;         // 출석코드
  records: {
    userId: number;
    userName: string;
    status: AttendanceStatus;
  }[];
}