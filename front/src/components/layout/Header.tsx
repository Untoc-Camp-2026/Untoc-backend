import React from 'react';

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-sm z-50 px-12 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span className="text-[#CDA869] text-2xl font-bold tracking-wider flex items-center gap-1.5 cursor-pointer">
          <img src="/images/logo.png" className="w-14 h-14"/>
        </span>
      </div>
      
      <nav className="flex items-center gap-8 text-[15px] font-medium text-gray-700">
        <span className="cursor-pointer hover:text-amber-700 flex items-center gap-0.5">게시판 <span className="text-[10px]">▼</span></span>
        <span className="cursor-pointer hover:text-amber-700">캘린더</span>
        <span className="cursor-pointer hover:text-amber-700">출석</span>
        <span className="text-[#0f0f0f]"> | </span>
        <span className="cursor-pointer font-bold text-amber-700"><a href='../../mypage/page.tsx'>마이페이지</a></span>
        
        <button className="border border-[#CDA869] text-[#5A4A32] hover:bg-[#FAF8F5] px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          로그아웃
        </button>
      </nav>
    </header>
  );
}