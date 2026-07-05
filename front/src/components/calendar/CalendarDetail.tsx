import type { CalendarEvent } from "@/types/calendar";

interface CalendarDetailProps {
  date: Date;
  events: CalendarEvent[];

  isAdmin: boolean;

  onEdit: (event: CalendarEvent) => void;

  onDelete: (id: number) => void;
}

export default function CalendarDetail({
  date,
  events,
  isAdmin,
  onEdit,
  onDelete,
}: CalendarDetailProps) {

  const week = ["일", "월", "화", "수", "목", "금", "토"];

  const titleDate = `${date.getMonth() + 1}/${date.getDate()} (${
    week[date.getDay()]
  })`;

  if (events.length === 0) {
    return (
      <section className="calendar-detail">

        <h2 className="calendar-detail-date">
          {titleDate}
        </h2>

        <div className="calendar-empty">
          등록된 일정이 없습니다.
        </div>

      </section>
    );
  }

  return (
    <section className="calendar-detail">

      <h2 className="calendar-detail-date">
        {titleDate}
      </h2>

      <div className="calendar-detail-list">

        {events.map((event) => (

          <div
            key={event.id}
            className="calendar-detail-card"
          >

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
            {/* ===============================
                관리자 전용 버튼
            =============================== */}

            {isAdmin && (
              <div className="calendar-detail-buttons">

                <button
                  className="calendar-edit-btn"
                  onClick={() => onEdit(event)}
                >
                  수정
                </button>

                <button
                  className="calendar-delete-btn"
                  onClick={() => {
                    const ok = window.confirm(
                      "정말 삭제하시겠습니까?"
                    );

                    if (ok) {
                      onDelete(event.id);
                    }
                  }}
                >
                  삭제
                </button>

              </div>
            )}

          </div>

        ))}

      </div>

    </section>
  );
}