// src/components/common/WriteButton.tsx
import React from 'react';

interface WriteButtonProps {
  onClick: () => void;
}

export const WriteButton = ({ onClick }: WriteButtonProps) => {
  return (
    <button
      onClick={onClick}
      aria-label="글쓰기"
      className="
        w-20 h-20
        rounded-full
        bg-[#F5D68C]
        flex items-center justify-center
        shadow-lg
        transition-transform duration-200
        hover:scale-105
        active:scale-95
      "
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#5C4033"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    </button>
  );
};