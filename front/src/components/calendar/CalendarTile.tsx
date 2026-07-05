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

        {events.slice(0, 3).map((event)=> (
          <div
            key={event.id}
            className="calendar-event"
          >
            {event.title}
          </div>
        ))}

        {events.length > 3&& (
          <div className="calendar-more">
            +{events.length - 3}
          </div>
        )}

      </div>

    </div>
  );
}