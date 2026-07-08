'use client';

import React from 'react';
import Image from 'next/image';
import Navbar from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import EmptyMember from '../../assets/images/empty_member.svg';

type Member = {
  role: string;
  name: string;
  email: string;
  image: typeof EmptyMember;
};

const executiveMembers: Member[] = [
  { role: '회장', name: '장호빈', email: 'profhb@pusan.ac.kr', image: EmptyMember },
  { role: '부회장', name: '황예진', email: 'kittly881@pusan.ac.kr', image: EmptyMember },
  { role: '총무', name: '윤태호', email: 'taeho2004@pusan.ac.kr', image: EmptyMember },
];

const generationMembers: Member[] = [
  { role: '17기', name: '강지원', email: 'kangjw05@pusan.ac.kr', image: EmptyMember },
  { role: '17기', name: '김다연', email: 'yeonda@pusan.ac.kr', image: EmptyMember },
  { role: '18기', name: '신유림', email: 'ㅇㅇ@pusan.ac.kr', image: EmptyMember },
  { role: '17기', name: '양준석', email: 'earth4613@pusan.ac.kr', image: EmptyMember },
  { role: '18기', name: '마정우', email: 'majw0415@pusan.ac.kr', image: EmptyMember },
  { role: '18기', name: '장수빈', email: 'ㅇㅇ@pusan.ac.kr', image: EmptyMember },
  { role: '18기', name: '최연수', email: 'cerealxox19@pusan.ac.kr', image: EmptyMember },
  { role: '18기', name: '한다빈', email: 'davinehan@pusan.ac.kr', image: EmptyMember },
];

// 카드 컴포넌트는 그대로 유지합니다
function MemberCard({ member }: { member: Member }) {
  return (
    <div className="w-[280px] rounded-md border border-[#D8D2CC] bg-white p-3 shadow-sm">
      <div className="relative w-full h-[210px] bg-[#E8E8E8] mb-4 overflow-hidden">
        <Image src={member.image} alt={`${member.role} ${member.name}`} fill className="object-cover" />
      </div>
      <div className="px-1 pb-2">
        <p className="text-sm text-black mb-2">{member.role}</p>
        <p className="text-sm font-bold text-black mb-2">{member.name}</p>
        <p className="text-xs text-[#888888]">{member.email}</p>
      </div>
    </div>
  );
}

// 카드를 감싸고 노란 그림자를 추가하는 래퍼 컴포넌트
function GlowingCard({ member }: { member: Member }) {
  return (
    <div className="relative">
      <div className="absolute -inset-4 rounded-lg bg-[#F7D988] opacity-40 blur-md" />
      <div className="relative">
        <MemberCard member={member} />
      </div>
    </div>
  );
}

export default function MembersPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-36 pb-28">
        <section className="text-center mb-24">
          <h6 className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#F7D988] rounded-full text-[#6B4E48] text-xs font-extrabold tracking-widest mb-6">
            🚀 UNTOC 구성원
          </h6>
          <h1 className="text-[#6B4E48] text-3xl md:text-4xl font-medium">
            UNTOC을 이끄는 집행부를 소개합니다.
          </h1>
        </section>

        {/* 1. 회장단 섹션: 별도로 명확히 분리 */}
    <section className="max-w-[1000px] mx-auto px-6 mb-32">
        <h2 className="text-center text-xl font-medium text-black mb-10">회장단</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-20 gap-y-20 justify-items-center">
        {executiveMembers.map((member) => (
            <GlowingCard key={`exec-${member.name}`} member={member} />
        ))}
        </div>
    </section>
    
    {/* 2. 기수 섹션: 기수별로 묶어서 배치 (중복 방지) */}
    <section className="max-w-[900px] mx-auto px-6">
      <h2 className="text-center text-xl font-medium text-black mb-10">집행부</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-20 justify-items-center">
        {generationMembers.map((member, index) => (
            <div key={`gen-${index}`} className="flex flex-col items-center">
            <GlowingCard member={member} />
            </div>
        ))}
        </div>
    </section>
    </main>
      <Footer />
    </div>
  );
}