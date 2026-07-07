'use client';

import React from 'react';
import Image from 'next/image';
import Forest from '../../assets/images/history_background.png';
import Navbar from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import VisionChart from './chart';

export default function UntocCampPage() {
  return (
    <div className="min-h-screen bg-[#FDFAF5]">
      {/* 상단 이미지 영역 */}
      <section className="relative h-screen w-full overflow-hidden">
        <Image
          src={Forest}
          alt="Untoc background"
          fill
          priority
          className="object-cover"
        />

        <div className="relative z-10">
          <Navbar />
        </div>
      </section>

      {/* 본문 영역 */}
      <main className="pt-28 pb-24">
        {/* ABOUT 영역 */}
        <section className="max-w-[900px] mx-auto px-6 mb-24">
          <h1 className="text-[#6B4E48] text-4xl md:text-5xl font-extrabold mb-[-18px] relative z-10 ml-6">
            ABOUT UNTOC
          </h1>

          <div className="bg-[#F1EEEA] px-8 md:px-20 py-16 text-center">
            <p className="text-black text-base md:text-lg leading-8">
              UNTOC(Untouchable Ceaseless)은 부산대학교 정보컴퓨터공학부의 개발 동아리로,
              프로그래밍을 배우고 함께 성장하는 개발자 커뮤니티입니다.
            </p>

            <p className="text-black text-base md:text-lg leading-8 mt-8">
              코딩을 처음 시작하는 사람부터 다양한 프로젝트와 스터디를 경험해 본 사람까지
              모두가 함께 배우고 성장할 수 있는 환경을 만들어가고 있습니다. 정기 스터디,
              개발 캠프, 프로젝트, 해커톤, 알고리즘 학습 등 다양한 활동을 통해 실력을 키우고,
              함께 협업하며 새로운 도전을 이어갑니다.
            </p>

            <p className="text-black text-base md:text-lg leading-8 mt-8">
              UNTOC은 ‘끊임없는 창의적인 도전’이라는 비전 아래, 실패를 두려워하지 않고
              배우며 성장하는 개발 문화를 지향합니다. 서로의 경험을 나누고 함께 문제를
              해결하며 더 나은 개발자로 성장하는 것이 우리의 목표입니다.
            </p>

            <p className="text-black text-base md:text-lg leading-8 mt-10">
              Chase Your Dreams. You can do anything with UNTOC.
            </p>
          </div>
        </section>

        {/* VISION 영역 */}
        <section className="max-w-[1100px] mx-auto px-6">
            <h2 className="text-[#6B4E48] text-4xl md:text-5xl font-extrabold mb-3">
                UNTOC VISION
            </h2>

        <p className="text-[#9B827D] text-3xl md:text-5xl text-center mb-10">
            “UNTOuchable Ceaseless”
        </p>

        <VisionChart />
        </section>
      </main>

      <Footer />
    </div>
  );
}