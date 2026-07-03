// types/calendar.ts (캘린더 일정)
export interface CalendarEvent {
  id: number;
  title: string;        // "끄아아아악"
  startDate: string;    // "2026-07-10"
  endDate: string;      // "2026-07-11"
  time: string;         // "오후 6시 ~ 9시"
  location: string;     // "it관"
  description?: string; // "ㅇㅇ"
}