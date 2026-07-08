import { apiClient } from '@/utils/api';
import { getAccessToken } from '@/utils/authStorage';
import type { CalendarEvent } from '@/types/calendar';
import type {
  CalendarEventCreatePayload,
  CalendarEventResponse,
  CalendarEventUpdatePayload,
  EventCategoryResponse,
} from '@/types/calendar';

const CALENDAR_BASE = '/calendar';

const getAuthHeaders = (): HeadersInit => {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const pad = (value: number) => String(value).padStart(2, '0');

const formatDatePart = (iso: string) => iso.slice(0, 10);

const formatTimePart = (iso: string) => {
  const date = new Date(iso);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const mapCalendarEventResponse = (event: CalendarEventResponse): CalendarEvent => ({
  id: event.event_id,
  categoryId: event.category_id,
  title: event.title,
  startDate: formatDatePart(event.start_at),
  endDate: formatDatePart(event.end_at),
  time: `${formatTimePart(event.start_at)} ~ ${formatTimePart(event.end_at)}`,
  location: event.location || '',
  description: event.content || '',
  isImportant: event.is_important,
});

export const toCalendarCreatePayload = (
  event: CalendarEvent,
  categoryId: number
): CalendarEventCreatePayload => ({
  category_id: categoryId,
  title: event.title,
  content: event.description || '',
  start_at: `${event.startDate}T${event.time.split('~')[0]?.trim() || '00:00'}:00`,
  end_at: `${event.endDate}T${event.time.split('~')[1]?.trim() || '23:59'}:00`,
  location: event.location,
  is_important: event.isImportant ?? false,
});

export const toCalendarUpdatePayload = (event: CalendarEvent): CalendarEventUpdatePayload => ({
  category_id: event.categoryId,
  title: event.title,
  content: event.description || '',
  start_at: `${event.startDate}T${event.time.split('~')[0]?.trim() || '00:00'}:00`,
  end_at: `${event.endDate}T${event.time.split('~')[1]?.trim() || '23:59'}:00`,
  location: event.location,
  is_important: event.isImportant ?? false,
});

export const getCalendarCategories = async (): Promise<EventCategoryResponse[]> => {
  return apiClient<EventCategoryResponse[]>(`${CALENDAR_BASE}/categories`);
};

export const getMonthCalendarEvents = async (
  year: number,
  month: number
): Promise<CalendarEvent[]> => {
  const response = await apiClient<CalendarEventResponse[]>(
    `${CALENDAR_BASE}/events?year=${year}&month=${month}`
  );
  return response.map(mapCalendarEventResponse);
};

export const createCalendarEvent = async (
  payload: CalendarEventCreatePayload
): Promise<CalendarEvent> => {
  const response = await apiClient<CalendarEventResponse>(`${CALENDAR_BASE}/events`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return mapCalendarEventResponse(response);
};

export const updateCalendarEvent = async (
  eventId: number,
  payload: CalendarEventUpdatePayload
): Promise<CalendarEvent> => {
  const response = await apiClient<CalendarEventResponse>(`${CALENDAR_BASE}/events/${eventId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return mapCalendarEventResponse(response);
};

export const deleteCalendarEvent = async (eventId: number): Promise<void> => {
  await apiClient(`${CALENDAR_BASE}/events/${eventId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
};
