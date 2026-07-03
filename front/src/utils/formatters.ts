// utils/formatters.ts

/**
 * PDF 22p (캘린더 상세): "2026-07-03" -> "7/3 (금)" 형식으로 변환
 */
export const formatDateWithDay = (dateString: string): string => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const dayOfWeek = days[date.getDay()];
  
  return `${month}/${day} (${dayOfWeek})`;
};

/**
 * PDF 20p (일정 모달): "2026-07-10" -> "2026/7/10" 형식으로 변환
 */
export const formatSimpleDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
};