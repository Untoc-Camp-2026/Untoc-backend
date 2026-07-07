export interface CalendarEvent {
  id: number;
  categoryId: number;
  title: string;
  startDate: string;
  endDate: string;
  time: string;
  location: string;
  description?: string;
  isImportant?: boolean;
}

export interface EventCategoryResponse {
  category_id: number;
  name: string;
  color?: string | null;
  description?: string | null;
  created_at: string;
}

export interface CalendarEventResponse {
  event_id: number;
  category_id: number;
  created_by: string;
  title: string;
  content?: string | null;
  start_at: string;
  end_at: string;
  location?: string | null;
  is_important: boolean;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface CalendarEventCreatePayload {
  category_id: number;
  title: string;
  content?: string;
  start_at: string;
  end_at: string;
  location?: string;
  is_important?: boolean;
}

export interface CalendarEventUpdatePayload {
  category_id?: number;
  title?: string;
  content?: string;
  start_at?: string;
  end_at?: string;
  location?: string;
  is_important?: boolean;
}
