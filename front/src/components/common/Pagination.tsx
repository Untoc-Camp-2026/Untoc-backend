// components/common/Pagination.tsx
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPage: number;
  onPageChange: (page: number) => void;
  pageGroupSize?: number; // 한 번에 보여줄 숫자 개수 (기본 5개)
}

export const Pagination = ({
  currentPage,
  totalPage,
  onPageChange,
  pageGroupSize = 5,
}: PaginationProps) => {
  
  // 현재 페이지가 속한 그룹 계산 (예: 7페이지 → 2번째 그룹)
  const currentGroup = Math.ceil(currentPage / pageGroupSize);

  // 이 그룹에서 보여줄 시작 번호와 끝 번호 계산
  const startPage = (currentGroup - 1) * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPage);

  // 시작 번호부터 끝 번호까지 배열 생성 (예: [6, 7, 8, 9, 10])
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  // 이전 그룹으로 이동 (예: 1~5 → 이전 그룹 없음 / 6~10 → 1~5로)
  const handlePrevGroup = () => {
    if (startPage === 1) return; // 첫 그룹이면 이동 불가
    const prevGroupLastPage = startPage - 1;
    onPageChange(prevGroupLastPage);
  };

  // 다음 그룹으로 이동 (예: 1~5 → 6~10)
  const handleNextGroup = () => {
    if (endPage === totalPage) return; // 마지막 그룹이면 이동 불가
    const nextGroupFirstPage = endPage + 1;
    onPageChange(nextGroupFirstPage);
  };

  const circleBase =
    "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-200";

  return (
    <div className="flex items-center gap-3 justify-center mt-6">
      
      {/* 이전 그룹 버튼 */}
      <button
        onClick={handlePrevGroup}
        disabled={startPage === 1}
        className={`${circleBase} bg-white text-[#5C4033] shadow disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100`}
      >
        &lt;
      </button>

      {/* 페이지 숫자 버튼들 (현재 그룹의 숫자만 표시) */}
      {pageNumbers.map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={
            num === currentPage
              ? `${circleBase} bg-[#5C4033] text-white shadow`
              : `${circleBase} bg-white text-[#5C4033] shadow hover:bg-gray-100`
          }
        >
          {num}
        </button>
      ))}

      {/* 다음 그룹 버튼 */}
      <button
        onClick={handleNextGroup}
        disabled={endPage === totalPage}
        className={`${circleBase} bg-white text-[#5C4033] shadow disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100`}
      >
        &gt;
      </button>
    </div>
  );
};