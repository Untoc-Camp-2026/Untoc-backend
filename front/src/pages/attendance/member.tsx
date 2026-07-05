'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

export default function MemberAttendancePage() {
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 테스트용: 남은 시간 5분(300초) 설정

  // ⏰ 타이머 동작 로직
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timerId);
    }
  }, [timeLeft]);

  // 초(seconds)를 MM:SS 형식으로 예쁘게 바꿔주는 함수
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // ⌨️ 출석 코드 입력 처리 (숫자만, 최대 6자리)
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setCode(value);
  };

  // 🚀 출석 확인 버튼 클릭 이벤트
  const handleSubmit = () => {
    if (code.length === 6) {
      alert(`입력된 코드 [${code}]로 출석을 요청합니다! (백엔드 연결 대기)`);
    } else {
      alert('6자리 출석 코드를 모두 입력해주세요.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF8EB]">
      {/* 상단 네비게이션 바 */}
      <Navbar />

      {/* 메인 컨텐츠 영역 (화면 중앙 정렬) */}
      <main className="flex-grow flex items-center justify-center px-6 pt-28 pb-24">
        
        {/* ⬜ 하얀색 배경의 출석 입력 박스 */}
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl w-full max-w-md border border-[#D1C7BD] flex flex-col items-center transition-all duration-500">
          
          {/* 타이틀 문구 */}
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#6B4E48] mb-2 text-center">
            출석 코드를 입력해주세요
          </h1>
          <p className="text-[#9B827D] mb-8 text-sm md:text-base text-center">
            관리자가 화면에 띄운 6자리 숫자를 입력하세요.
          </p>

          {/* 타이머 표시 구역 */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[#6D4E48] font-bold">남은 시간 :</span>
            {/* 1분 이하로 남으면 빨간색으로 변하도록 디테일 추가 */}
            <span className={`text-xl font-extrabold tracking-widest ${timeLeft <= 60 ? 'text-red-500' : 'text-[#6B4E48]'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>

          {/* 6자리 코드 입력창 */}
          <input 
            type="text" 
            value={code}
            onChange={handleCodeChange}
            placeholder="000000"
            className="w-full h-16 text-center text-4xl tracking-[0.5em] font-bold text-[#6D4E48] bg-white border-2 border-[#D1C7BD] rounded-lg focus:outline-none focus:border-[#6B4E48] focus:ring-1 focus:ring-[#6B4E48] mb-8 placeholder-[#E2DCD3]"
          />

          {/* 버튼 그룹 */}
          <div className="w-full flex flex-col gap-3">
            <button 
              onClick={handleSubmit}
              // 피그마 가이드에 있던 노란색 버튼 디자인 + 호버(확대) 효과 반영
              className="w-full bg-[#F2C94C] hover:bg-[#E5B94E] text-[#6B4E48] font-extrabold py-4 rounded-4xl transition-all duration-300 hover:scale-105 shadow-md text-lg"
            >
              출석 확인
            </button>
            <button 
              onClick={() => setCode('')}
              // 취소 버튼은 회색/베이지 톤으로 눈에 덜 띄게 처리
              className="w-full bg-[#F1EEEA] hover:bg-[#E2DCD3] text-[#9B827D] font-bold py-3 rounded-4xl transition-all duration-300 text-sm"
            >
              입력 취소
            </button>
          </div>

        </div>
      </main>

      {/* 하단 푸터 */}
      <Footer />
    </div>
  );
}