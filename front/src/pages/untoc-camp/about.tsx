'use client';

import React from 'react';
import Navbar from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

export default function UntocCampPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFAF5]">
      <Navbar />

      <main className="flex-grow w-full max-w-6xl mx-auto pb-24">
        {/* 상단 뱃지 */}
        <div className="flex justify-center py-4">
          <h6 className="text-[#6B4E48] inline-flex items-center gap-2 px-5 py-1.5 bg-[#F7D988] rounded-full mb-3 text-xs font-extrabold tracking-widest">
            🚀 UNTOC CAMP
          </h6>
        </div>

        {/* 제목 */}
        <div className="flex justify-center mb-20">
          <h1 className="font-extrabold text-4xl md:text-5xl text-[#6B4E48]">
            About &#123;UNTOC CAMP&#125;
          </h1>
        </div>

        {/* 본문 전체 컨테이너 */}
        <section className="max-w-[760px] mx-auto px-6 space-y-20">
          {/* UNTOC CAMP란? */}
          <div>
            <div className="flex items-center gap-4 mb-7">
              <span className="w-1.5 h-8 bg-[#F7D988] inline-block rounded-full"></span>
              <h2 className="text-2xl font-extrabold text-[#6B4E48]">
                UNTOC CAMP란?
              </h2>
            </div>

            <div className="bg-[#FFF8D8] border-2 border-dashed border-[#F7D988] rounded-2xl px-9 py-8">
              <p className="text-[#6B4E48] text-base leading-loose font-medium">
                비슷한 관심 분야를 가진 사람들과 팀을 구성하여 스터디를 진행하거나,
                그에 더불어 프로젝트를 진행하는 활동
              </p>
            </div>
          </div>

          {/* 활동 규칙 */}
          <div>
            <div className="flex items-center gap-4 mb-7">
              <span className="w-1.5 h-8 bg-[#F7D988] inline-block rounded-full"></span>
              <h2 className="text-2xl font-extrabold text-[#6B4E48]">
                활동 규칙
              </h2>
            </div>

            <div className="bg-[#FFF8D8] border-2 border-dashed border-[#F7D988] rounded-2xl px-6 py-7">
              <div className="space-y-3">
                
              </div>
            </div>
          </div>

          {/* 시상 */}
          <div>
            <div className="flex items-center gap-4 mb-7">
              <span className="w-1.5 h-8 bg-[#F7D988] inline-block rounded-full"></span>
              <h2 className="text-2xl font-extrabold text-[#6B4E48]">
                시상
              </h2>
            </div>

            <div className="bg-[#FFF8D8] border-2 border-dashed border-[#F7D988] rounded-2xl px-6 py-7">
              <div className="space-y-3">
                
              </div>
            </div>
          </div>
        </section>
      </main>
    <Footer />
    </div>
  );
}