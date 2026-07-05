import { useState } from "react";
import type { CalendarEvent } from "@/types/calendar";

interface CalendarModalProps {
  open: boolean;
  onClose: () => void;

  // ======================================
  // TODO : 백엔드 연결 시
  // 저장 API 호출
  // ======================================
  onSave?: (event: CalendarEvent) => void;
}

export default function CalendarModal({
  open,
  onClose,
  onSave,
}: CalendarModalProps) {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  if (!open) return null;

  const handleSave = () => {
    const newEvent: CalendarEvent = {
      id: Date.now(),
      title,
      startDate,
      endDate,
      time: `${startTime} ~ ${endTime}`,
      location,
      description,
    };

    // TODO : 백엔드 연결
    onSave?.(newEvent);

    onClose();
  };

  return (
    <div className="calendar-modal-overlay">

      <div className="calendar-modal">

        <h2>일정 등록</h2>

        <label>일정 제목</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>시작 날짜</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <label>종료 날짜</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <label>시작 시간</label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />

        <label>종료 시간</label>
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />

        <label>장소</label>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <label>상세 설명</label>

        <textarea
          rows={5}
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <div className="calendar-modal-buttons">

          <button
            onClick={onClose}
            className="cancel-btn"
          >
            취소
          </button>

          <button
            onClick={handleSave}
            className="save-btn"
          >
            저장
          </button>

        </div>

      </div>

    </div>
  );
}