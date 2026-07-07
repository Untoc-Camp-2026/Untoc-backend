import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import CalendarTile from "@/components/calendar/CalendarTile";
import CalendarDetail from "@/components/calendar/CalendarDetail";
import CalendarModal from "@/components/calendar/CalendarModal";
import { useAuth } from "@/contexts/AuthContext";
import {
  createCalendarEvent,
  deleteCalendarEvent,
  getCalendarCategories,
  getMonthCalendarEvents,
  toCalendarCreatePayload,
  toCalendarUpdatePayload,
  updateCalendarEvent,
} from "@/api/calendar";

import type { CalendarEvent } from "@/types/calendar";

import "react-calendar/dist/Calendar.css";

const Calendar = dynamic(() => import("react-calendar"), {
  ssr: false,
});

export default function CalendarPage() {
  const auth = useAuth();
  const isAdmin = auth.isAdmin;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [defaultCategoryId, setDefaultCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const loadEvents = useCallback(async (date: Date) => {
    setLoading(true);
    try {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const [monthEvents, categories] = await Promise.all([
        getMonthCalendarEvents(year, month),
        getCalendarCategories(),
      ]);
      setEvents(monthEvents);
      setDefaultCategoryId(categories[0]?.category_id ?? null);
    } catch (error) {
      setEvents([]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEvents(selectedDate);
  }, [selectedDate, loadEvents]);

  const selectedEvents = useMemo(() => {
    const target = formatDate(selectedDate);
    return events.filter((event) => target >= event.startDate && target <= event.endDate);
  }, [selectedDate, events]);

  const getEventsByDate = (date: Date) => {
    const target = formatDate(date);
    return events.filter((event) => target >= event.startDate && target <= event.endDate);
  };

  const handleSave = async (newEvent: CalendarEvent) => {
    try {
      if (modalMode === "create") {
        if (!defaultCategoryId) {
          alert("일정 카테고리가 없습니다. 관리자가 카테고리를 먼저 등록해야 합니다.");
          return;
        }
        await createCalendarEvent(toCalendarCreatePayload(newEvent, defaultCategoryId));
      } else {
        await updateCalendarEvent(newEvent.id, toCalendarUpdatePayload(newEvent));
      }
      await loadEvents(selectedDate);
      setIsModalOpen(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : "일정 저장에 실패했습니다.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("이 일정을 삭제하시겠습니까?")) return;

    try {
      await deleteCalendarEvent(id);
      await loadEvents(selectedDate);
      setSelectedEvent(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : "일정 삭제에 실패했습니다.");
    }
  };

  return (
    <>
      <Header />

      <main className="calendar-page">
        <div className="calendar-header">
          <div>
            <h1 className="calendar-title">CALENDAR</h1>
            <p className="calendar-description">
              날짜를 클릭하면 해당 일정의 상세 정보를 확인할 수 있습니다.
            </p>
          </div>

          {isAdmin && (
            <button
              className="calendar-register-btn"
              onClick={() => {
                setSelectedEvent(null);
                setModalMode("create");
                setIsModalOpen(true);
              }}
            >
              일정 등록하기
            </button>
          )}
        </div>

        {loading && (
          <p className="calendar-description mb-4">일정을 불러오는 중...</p>
        )}

        <div className="calendar-layout">
          <CalendarDetail
            date={selectedDate}
            events={selectedEvents}
            isAdmin={isAdmin}
            onEdit={(event) => {
              setSelectedEvent(event);
              setModalMode("edit");
              setIsModalOpen(true);
            }}
            onDelete={handleDelete}
          />

          <div className="calendar-wrapper">
            <Calendar
              className="custom-calendar"
              value={selectedDate}
              calendarType="gregory"
              onChange={(value: Date | Date[] | null) => {
                if (value instanceof Date) {
                  setSelectedDate(value);
                }
              }}
              formatDay={() => ""}
              formatShortWeekday={(_locale: string | undefined, date: Date) =>
                ["일", "월", "화", "수", "목", "금", "토"][date.getDay()]
              }
              tileContent={({ date }: { date: Date }) => (
                <CalendarTile date={date} events={getEventsByDate(date)} />
              )}
            />
          </div>
        </div>

        <CalendarModal
          open={isModalOpen}
          mode={modalMode}
          event={selectedEvent}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      </main>

      <Footer />
    </>
  );
}
