'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Navbar from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import HistoryBg from '../../assets/images/history_background.png';

type YearKey = '2023' | '2024' | '2025' | '2026';

const historyData: Record<YearKey, string[]> = {
  '2023': [
    '2023년 UNTOC 활동 내용',
    'UNTOC 성장 기록 시작',
  ],

  '2024': [
    '2024년 UNTOC 활동 내용',
    '프로젝트 및 스터디 진행',
    '동아리 개발 활동 참여',
  ],

  '2025': [
    '5/21(예선), 7/24 ~ 7/25(본선) : 제 6회 PNU 창의융합 SW해커톤 본선 진출',
    '8/23 ~ 8/23 : 2025 DIVE 해양수산 공공데이터 / AI 활용화 실무협의체 부문 발제 - 1등상',
  ],

  '2026': [
    '6/16 ~ 6/22 : 2026년 1학기 기말고사',
    '7/3 : 웨베벱 밤샘의 날 ..',
    '7/10 : 최종 Meet Up',
  ],
};

// 여기서 화면에 보이는 연도 순서를 직접 고정
const years: YearKey[] = ['2026', '2025', '2024', '2023'];

export default function HistoryPage() {
  const [selectedYear, setSelectedYear] = useState<YearKey>('2026');

  return (
    <div className="min-h-screen bg-[#ffffff]">
      <Navbar />

      <main className="relative min-h-screen overflow-hidden pt-32">
        {/* 배경 이미지 */}
        <div className="absolute bottom-0 left-1/2 h-[58%] w-screen -translate-x-1/2">
          <Image
            src={HistoryBg}
            alt="UNTOC history background"
            fill
            className="object-cover"
          />
        </div>

        <section className="relative z-10 max-w-[1120px] mx-auto px-6 pb-32">
          {/* 상단 제목 */}
          <div className="mb-24">
            <h6 className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#F7D988] rounded-full text-[#6B4E48] text-xs font-extrabold tracking-widest mb-3">
              🚀 UNTOC 연혁
            </h6>

            <h1 className="text-[#6B4E48] text-4xl md:text-5xl font-extrabold mb-6">
              HISTORY
            </h1>

            <p className="text-black text-lg md:text-xl leading-9">
              UNTOC의 발자취를 소개합니다.
              <br />
              함께 도전하고 성장하며 만들어 온 우리의 이야기를 확인해 보세요.
            </p>
          </div>

          {/* 연도 + 내용 */}
          <div className="flex items-start">
            {/* 왼쪽 연도 */}
            <div className="w-[170px] flex flex-col items-center gap-14 pt-2">
              {years.map((year) => {
                const isActive = selectedYear === year;

                return (
                  <button
                    key={year}
                    type="button"
                    onClick={() => setSelectedYear(year)}
                    className={`font-extrabold transition-all duration-300 ${
                      isActive
                        ? 'text-[#8B6D68] text-6xl drop-shadow-[4px_5px_2px_rgba(0,0,0,0.25)]'
                        : 'text-[#B7A6A2]/70 text-4xl hover:text-[#8B6D68]'
                    }`}
                  >
                    {year}
                  </button>
                );
              })}
            </div>

            {/* 오른쪽 내용 박스 */}
            <div className="relative flex-1 min-h-[380px] rounded-[28px] bg-[#FFF8D9]/90 px-16 py-10 shadow-[0_0_35px_rgba(242,223,145,0.35)] border border-[#B9AFA7]/40">
              <div className="pointer-events-none absolute inset-0 rounded-[28px] border border-[#8E817A]/40 border-dashed" />

              <ul className="relative z-10 space-y-7 text-[#5E4B47] text-2xl leading-[1.9] font-medium">
                {historyData[selectedYear].map((item, index) => (
                  <li key={index} className="flex gap-4">
                    <span>•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}