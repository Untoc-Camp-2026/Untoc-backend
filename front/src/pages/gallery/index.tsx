'use client';

import React, { useState } from 'react';
import Navbar from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

// 1. 학기별 데이터를 상단에서 관리 (각 학기마다 6장씩)
const SEMESTER_DATA: Record<string, { title: string; image: string }[]> = {
  '26-1': Array(6).fill(null).map((_, i) => ({ title: `26-1 활동 ${i + 1}`, image: '' })),
  '25-2': Array(6).fill(null).map((_, i) => ({ title: `25-2 활동 ${i + 1}`, image: '' })),
  '25-1': Array(6).fill(null).map((_, i) => ({ title: `25-1 활동 ${i + 1}`, image: '' })),
  '24-2': Array(6).fill(null).map((_, i) => ({ title: `24-2 활동 ${i + 1}`, image: '' })),
  '24-1': Array(6).fill(null).map((_, i) => ({ title: `24-1 활동 ${i + 1}`, image: '' })),
};

const TERMS = Object.keys(SEMESTER_DATA);

const formatTerm = (term: string) => term.replace('-', ' - ');

export default function UntocCampPage() {
  const [activeTerm, setActiveTerm] = useState(TERMS[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 삐뚤빼뚤한 각도 배열
  const rotations = ['rotate-2', '-rotate-3', 'rotate-1', '-rotate-2', 'rotate-3', '-rotate-1'];

  return (
    <main className="flex flex-col min-h-screen bg-[#FDF8EB]">
      <Navbar />
      
      <div className="flex-grow w-full max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-[#6D4E48] mb-8 mt-12">UNTOC 활동 사진</h1>

        {/* 학기 선택 드롭다운 */}
        <div className="relative mb-12">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-[#6B4E48] rounded-4xl px-6 py-2 font-bold text-white shadow-sm flex items-center gap-2"
          >
            {formatTerm(activeTerm)} <span className="text-xs">▼</span>
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 bg-white border border-[#D1C7BD] rounded-lg shadow-xl w-32 z-50">
              {TERMS.map(term => (
                <button 
                  key={term}
                  onClick={() => { setActiveTerm(term); setIsDropdownOpen(false); }}
                  className="block w-full text-left px-4 py-2 hover:bg-[#FDF8EB] text-[#6D4E48]"
                >
                  {formatTerm(term)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 학기별 6장 사진 갤러리 (삐뚤빼뚤하게 배치) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 justify-items-center mb-20">
          {SEMESTER_DATA[activeTerm].map((item, index) => (
            <div 
              key={index}
              className={`group w-[300px] transition-all duration-500 hover:rotate-0 hover:scale-105 ${rotations[index % rotations.length]}`}
            >
              <div className="bg-white p-4 pb-10 rounded-lg shadow-lg border border-gray-100">
                {/* 행사 이미지 (비어있을 시 단색 배경) */}
                <div className="w-full aspect-[4/3] bg-gray-300 rounded mb-4 overflow-hidden" />
                <p className="text-center font-bold text-[#6D4E48]">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
  <Footer />
    </main>
  );
}