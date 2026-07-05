import type { CalendarEvent } from "@/types/calendar";

interface CalendarTileProps {
  date: Date;
  events: CalendarEvent[];
}

export default function CalendarTile({
  date,
  events,
}: CalendarTileProps) {
  return (
    <div className="calendar-tile">

      {/* 날짜 */}
      <span className="calendar-day">
        {date.getDate()}
      </span>

      {/* 일정 */}
      <div className="calendar-events">

        {events.slice(0, 2).map((event) => {

          const isLong =
            event.startDate !== event.endDate;

          return (
            <div
              key={event.id}
              className={`calendar-event ${
                isLong ? "calendar-event-long" : ""
              }`}
            >
              {isLong ? "📅 " : ""}
              {event.title}
            </div>
          );

        })}

        {events.length > 2 && (
          <div className="calendar-more">
            +{events.length - 2}
          </div>
        )}

      </div>

    </div>
  );
}