// src/components/common/SearchBar.tsx
import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch?: () => void;
}

export const SearchBar = ({ value, onChange, onSearch }: SearchBarProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch();
    }
  };

  return (
    // max-w-md 였던 최대 너비를 max-w-2xl로 늘려 가로로 훨씬 길게 만들었습니다.
    <div className="relative w-full max-w-2xl">
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder="검색어를 입력하세요…"
        className="
          w-full
          h-14
          pl-6
          pr-16
          rounded-full
          border border-gray-300
          bg-white
          shadow-sm
          text-base text-gray-800
          focus:outline-none focus:border-[#F5D68C] focus:ring-1 focus:ring-[#F5D68C]
          transition-colors
        "
      />
      {/* 검색 버튼: 갈색 배경(#5C4033)의 둥근 버튼 안에 흰색 돋보기 아이콘 */}
      <button
        onClick={onSearch}
        className="
          absolute 
          right-2 
          top-1/2 
          -translate-y-1/2 
          w-10 h-10 
          flex items-center justify-center 
          bg-[#5C4033] 
          text-white 
          rounded-full 
          hover:bg-[#4a332a] 
          transition-colors
        "
        aria-label="검색"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    </div>
  );
};