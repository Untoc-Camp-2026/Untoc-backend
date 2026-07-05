import type { CalendarEvent } from "@/types/calendar";

interface CalendarDetailProps {
  date: Date;
  events: CalendarEvent[];
}

export default function CalendarDetail({
  date,
  events,
}: CalendarDetailProps) {
  const week = ["일", "월", "화", "수", "목", "금", "토"];

  const formatTitleDate = (date: Date) => {
    return `${date.getMonth() + 1}/${date.getDate()} (${week[date.getDay()]})`;
  };

  // ======================================
  // 일정이 없는 경우
  // ======================================
  if (events.length === 0) {
    return (
      <section className="calendar-detail">
        <h2 className="calendar-detail-date">
          {formatTitleDate(date)}
        </h2>

        <div className="calendar-empty">
          오늘 등록된 일정이 없습니다.
        </div>
      </section>
    );
  }

  // ======================================
  // 현재는 첫 번째 일정만 표시
  // TODO : 여러 일정 선택 기능 추가 가능
  // ======================================

  const event = events[0];

  return (
    <section className="calendar-detail">

      <h2 className="calendar-detail-date">
        {formatTitleDate(date)}
      </h2>

      <div className="calendar-detail-card">

        <div className="calendar-detail-item">

          <span className="calendar-detail-label">
            일정
          </span>

          <span className="calendar-detail-value">
            {event.title}
          </span>

        </div>

        <div className="calendar-detail-item">

          <span className="calendar-detail-label">
            날짜
          </span>

          <span className="calendar-detail-value">
            {event.startDate} ~ {event.endDate}
          </span>

        </div>

        <div className="calendar-detail-item">

          <span className="calendar-detail-label">
            시간
          </span>

          <span className="calendar-detail-value">
            {event.time}
          </span>

        </div>

        <div className="calendar-detail-item">

          <span className="calendar-detail-label">
            장소
          </span>

          <span className="calendar-detail-value">
            {event.location}
          </span>

        </div>

        <div className="calendar-detail-item">

          <span className="calendar-detail-label">
            상세 설명
          </span>

          <span className="calendar-detail-value">
            {event.description || "-"}
          </span>

        </div>

      </div>

    </section>
  );
}