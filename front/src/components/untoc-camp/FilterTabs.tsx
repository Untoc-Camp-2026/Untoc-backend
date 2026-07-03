import React from 'react';

interface FilterTabsProps {
  terms: string[];
  activeTerm: string;
  onTabChange: (term: string) => void;
}

export default function FilterTabs({ terms, activeTerm, onTabChange }: FilterTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-10">
      {terms.map((term) => (
        <button
          key={term}
          onClick={() => onTabChange(term)}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
            activeTerm === term
              ? 'bg-[#E8DCC4] text-gray-800' // 활성화 상태
              : 'border border-gray-200 text-gray-500 hover:bg-gray-50' // 비활성화 상태
          }`}
        >
          {term}
        </button>
      ))}
    </div>
  );
}