import { useEffect, useState } from "react";
import type { CalendarEvent, EventCategoryResponse } from "@/types/calendar";
import { getCalendarCategories } from "@/api/calendar"; // 카테고리 조회 API 추가

interface CalendarModalProps {
  open: boolean;

  mode: "create" | "edit";

  event?: CalendarEvent | null;

  onClose: () => void;

  // ======================================
  // TODO : 백엔드 연결
  // index.tsx에서 API 호출
  // ======================================
  onSave: (event: CalendarEvent) => void;
}

export default function CalendarModal({
  open,
  mode,
  event,
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

  // ======================================
  // 💡 추가된 카테고리 상태
  // ======================================
  const [categories, setCategories] = useState<EventCategoryResponse[]>([]);
  const [categoryId, setCategoryId] = useState<number>(0);

  // 💡 카테고리 로딩 상태 추가
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);

  // ======================================
  // 수정 모드 데이터 채우기
  // ======================================

  useEffect(() => {
    if (open) {
      setIsCategoryLoading(true); // 모달이 열릴 때 카테고리 로딩 켬
      getCalendarCategories()
        .then((data) => {
          setCategories(data);
          // 등록 모드일 때 첫 번째 카테고리를 기본값으로 자동 선택
          if (mode === "create" && data.length > 0) {
            setCategoryId(data[0].category_id);
          }
        })
        .catch((err) => console.error("카테고리 로드 실패:", err))
        .finally(() => {
          setIsCategoryLoading(false); // 💡 성공하든 실패하든 카테고리 로딩 끄기
        });
    }
  }, [open, mode]);

  // ======================================
  // 2. 수정/등록 모드에 따른 데이터 채우기 (기존 로직 수정)
  // ======================================
  useEffect(() => {
    if (!open) return;

    // ============================
    // 등록 모드 초기화
    // ============================
    if (mode === "create") {
      setTitle("");
      setStartDate("");
      setEndDate("");
      setStartTime("");
      setEndTime("");
      setLocation("");
      setDescription("");
      // categoryId는 위의 카테고리 불러오는 useEffect에서 자동으로 세팅됩니다.
      return;
    }

    // ============================
    // 수정 모드 데이터 채우기
    // ============================
    if (mode === "edit" && event) {
      setCategoryId(event.categoryId); // 💡 수정 모드일 때 기존 카테고리 ID 세팅
      setTitle(event.title);
      setStartDate(event.startDate);
      setEndDate(event.endDate);

      const time = event.time.split("~");
      setStartTime(time[0]?.trim() || "");
      setEndTime(time[1]?.trim() || "");

      setLocation(event.location);
      setDescription(event.description || "");
    }
  }, [open, mode, event]);


  if (!open) return null;

  const handleSave = () => {

    if (!categoryId || !title || !startDate || !endDate) {
      alert("필수 항목(*)을 모두 입력해주세요.");
      return;
    }

    const newEvent: CalendarEvent = {
      id: event?.id ?? 0,
      categoryId: categoryId,
      title,

      startDate,

      endDate,

      time: `${startTime} ~ ${endTime}`,

      location,

      description,

    };

    onSave(newEvent);

  };

  return (

    <div
      className="calendar-modal-overlay"
      onClick={onClose}
    >

      <div
        className="calendar-modal"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="calendar-modal-header">

          <h2>

            {mode === "create"
              ? "일정 등록"
              : "일정 수정"}

          </h2>

          <button
            className="calendar-close-btn"
            onClick={onClose}
          >
            ✕
          </button>

        </div>
        <div className="calendar-form">

          {/* 💡 카테고리 선택 UI 추가 */}
          <div className="calendar-form-group">
            <label>
              카테고리
              <span className="required">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="w-full h-10 px-3 rounded-md border border-gray-300"
            >
              {isCategoryLoading ? (
                <option value={0} disabled>카테고리를 불러오는 중...</option>
              ) : categories.length === 0 ? (
                <option value={0} disabled>등록된 카테고리가 없습니다.</option>
              ) : (
                categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* 제목 */}
          <div className="calendar-form-group">
            <label>
              일정 제목
              <span className="required">*</span>
            </label>

            <input
              type="text"
              placeholder="일정 제목을 입력하세요."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* 시작 */}
          <div className="calendar-form-row">

            <div className="calendar-form-group">
              <label>
              시작 날짜 
              <span className="required">*</span>
            </label>

              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="calendar-form-group">
              <label>시작 시간</label>

              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

          </div>

          {/* 종료 */}
          <div className="calendar-form-row">

            <div className="calendar-form-group">
              <label>
              종료 날짜
              <span className="required">*</span>
            </label>

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="calendar-form-group">
              <label>종료 시간</label>

              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>

          </div>

          {/* 장소 */}
          <div className="calendar-form-group">
            <label>장소</label>

            <input
              type="text"
              placeholder="장소를 입력하세요."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* 설명 */}
          <div className="calendar-form-group">
            <label>상세 설명</label>

            <textarea
              rows={5}
              placeholder="상세 설명을 입력하세요."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

        </div>

        {/* 버튼 */}

        <div className="calendar-modal-footer">

          <button
            className="calendar-cancel-btn"
            onClick={onClose}
          >
            취소
          </button>

          <button
            className="calendar-save-btn"
            onClick={handleSave}
          >
            {mode === "create"
              ? "등록"
              : "수정"}
          </button>

        </div>

      </div>

    </div>

  );

}