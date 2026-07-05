import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { CalendarEvent } from "@/types/calendar";

import CalendarDetail from "@/components/calendar/CalendarDetail";
import CalendarModal from "@/components/calendar/CalendarModal";
import CalendarTile from "@/components/calendar/CalendarTile";

import "react-calendar/dist/Calendar.css";
import "@/styles/calendar.css";

const Calendar = dynamic(() => import("react-calendar"), {
  ssr: false,
});

export default function CalendarPage() {
  // ======================================
  // TODO : 백엔드 로그인 연결 시 수정
  // user.role === "ADMIN"
  // ======================================
  const isAdmin = true;

  // ======================================
  // 선택된 날짜
  // ======================================
  const [selectedDate, setSelectedDate] = useState(new Date());

  // ======================================
  // 일정 등록 모달
  // ======================================
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ======================================
  // TODO : 백엔드 연결 시 삭제
  // 테스트용 더미 데이터
  // ======================================
  const [events] = useState<CalendarEvent[]>([
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
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // ======================================
  // 선택된 날짜 일정
  // ======================================
  const selectedEvents = useMemo(() => {
    return events.filter(
      (event) => event.startDate === formatDate(selectedDate)
    );
  }, [selectedDate, events]);

  // ======================================
  // 날짜별 일정 조회
  // ======================================
  const getEventsByDate = (date: Date) => {
    return events.filter(
      (event) => event.startDate === formatDate(date)
    );
  };
    return (
    <>
      <main className="calendar-page">
        <div className="calendar-header">
          <div>
            <h1 className="calendar-title">CALENDAR</h1>

            <p className="calendar-description">
              우측 달력의 날짜를 더블클릭하여 상세 정보를 확인하세요.
            </p>
          </div>

          {/* ======================================
              TODO : 백엔드 로그인 연결 시 수정
              관리자만 버튼 표시
          ====================================== */}
          {isAdmin && (
            <button
              className="calendar-register-btn"
              onClick={() => setIsModalOpen(true)}
            >
              일정 등록하기
            </button>
          )}
        </div>

        <div className="calendar-layout">

          {/* ===============================
              왼쪽 일정 상세
          =============================== */}

          <CalendarDetail
            date={selectedDate}
            events={selectedEvents}
          />

          {/* ===============================
              오른쪽 달력
          =============================== */}

          <div className="calendar-wrapper">

            <Calendar
              value={selectedDate}
              calendarType="gregory"

              onChange={(value) => {
                if (value instanceof Date) {
                  setSelectedDate(value);
                }
              }}

              formatDay={() => ""}

              formatShortWeekday={(locale, date) => {
                return ["일", "월", "화", "수", "목", "금", "토"][
                  date.getDay()
                ];
              }}

              tileContent={({ date }) => (
                <CalendarTile
                  date={date}
                  events={getEventsByDate(date)}
                  isSelected={
                    formatDate(date) ===
                    formatDate(selectedDate)
                  }
                />
              )}
            />

          </div>

        </div>

        {/* ======================================
            일정 등록 모달
            TODO : 저장 시 API 연결
        ====================================== */}

        <CalendarModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

      </main>
    </>
  );
}