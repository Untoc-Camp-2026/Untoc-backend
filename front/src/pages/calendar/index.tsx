import { useMemo, useState } from "react";
import dynamic from "next/dynamic";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import CalendarTile from "@/components/calendar/CalendarTile";
import CalendarDetail from "@/components/calendar/CalendarDetail";
import CalendarModal from "@/components/calendar/CalendarModal";

import type { CalendarEvent } from "@/types/calendar";

import "react-calendar/dist/Calendar.css";

const Calendar = dynamic(() => import("react-calendar"), {
  ssr: false,
});

export default function CalendarPage() {

  // ======================================
  // TODO : 백엔드 로그인 연결 시 수정
  // const isAdmin = user.role === "ADMIN";
  // ======================================

  const isAdmin = false; //true일때 일정 등록하기 버튼 뜸. 프론트엔드 테스트 시 const admin값을 true로 해두고 일정 등록 확인해보기

  // ======================================
  // 선택 날짜
  // ======================================

  const [selectedDate, setSelectedDate] = useState(new Date());

  // ======================================
  // 모달
  // ======================================

  const [isModalOpen, setIsModalOpen] = useState(false);

  // ======================================
  // TODO : 백엔드 연결 시 삭제
  // 더미 데이터
  // ======================================

  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: 1,
      title: "OT",
      startDate: "2026-09-10",
      endDate: "2026-09-10",
      time: "18:00 ~ 20:00",
      location: "IT관",
      description: "OT 진행",
    },
    {
      id: 2,
      title: "최종 발표",
      startDate: "2026-09-19",
      endDate: "2026-09-19",
      time: "19:00",
      location: "IT관",
      description: "최종 발표입니다.",
    },
  ]);



  // ======================================
  // 날짜 포맷
  // ======================================

  const formatDate = (date: Date) => {
    const y = date.getFullYear();

    const m = String(date.getMonth() + 1).padStart(2, "0");

    const d = String(date.getDate()).padStart(2, "0");

    return `${y}-${m}-${d}`;
  };

  // ======================================
  // 선택된 날짜 일정
  // ======================================

  const selectedEvents = useMemo(() => {

    return events.filter(
      (event) =>
        event.startDate === formatDate(selectedDate)
    );

  }, [selectedDate, events]);

  // ======================================
  // 날짜별 일정
  // ======================================

  const getEventsByDate = (date: Date) => {

    return events.filter(
      (event) =>
        event.startDate === formatDate(date)
    );

  };

  const [modalMode, setModalMode] =
useState<"create"|"edit">("create");

const [selectedEvent,setSelectedEvent]
=
useState<CalendarEvent|null>(null);



  return (
    <>
      {/* ===============================
          Header
      =============================== */}
      <Header isLogin={true} />

      <main className="calendar-page">
        {/* ===============================
            상단
        =============================== */}

        <div className="calendar-header">
          <div>
            <h1 className="calendar-title">
              CALENDAR
            </h1>

            <p className="calendar-description">
              날짜를 클릭하면 해당 일정의 상세 정보를 확인할 수 있습니다.
            </p>
          </div>

          {/* ======================================
              TODO : 백엔드 로그인 연결
              관리자만 일정 등록 가능
          ====================================== */}

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

        {/* ===============================
            좌우 레이아웃
        =============================== */}

        <div className="calendar-layout">

          {/* 일정 상세 */}

          <CalendarDetail
            date={selectedDate}
            events={selectedEvents}
            isAdmin={isAdmin}
            onEdit={(event) => {
                setSelectedEvent(event);
                setModalMode("edit");
                setIsModalOpen(true);
            }}
            onDelete={(id) => {

            setEvents((prev) =>
                prev.filter((event) => event.id !== id)
            );

            setSelectedEvent(null);

            }}
        />

          {/* 달력 */}

          <div className="calendar-wrapper">

            <Calendar
              className="custom-calendar"

              value={selectedDate}

              calendarType="gregory"

              onChange={(value) => {
                if (value instanceof Date) {
                  setSelectedDate(value);
                }
              }}

              formatDay={() => ""}

              formatShortWeekday={(locale, date) =>
                ["일", "월", "화", "수", "목", "금", "토"][
                  date.getDay()
                ]
              }

              tileContent={({ date }) => (
                <CalendarTile
                  date={date}
                  events={getEventsByDate(date)}
                />
              )}
            />

          </div>

        </div>

        {/* ===============================
            일정 등록 모달
        =============================== */}

        <CalendarModal
            open={isModalOpen}
            mode={modalMode}
            event={selectedEvent}
            onClose={() => setIsModalOpen(false)}
            onSave={(newEvent) => {

                    if (modalMode === "create") {

                    setEvents((prev) => [...prev, newEvent]);

                    } else {

                        setEvents((prev) =>
                        prev.map((event) =>
                        event.id === newEvent.id ? newEvent : event
                        )
                    );

                }

                setIsModalOpen(false);
            }}
        />

      </main>

      {/* ===============================
          Footer
      =============================== */}

      <Footer />
    </>
  );
}