'use client';

import React, { useState } from 'react';
import Navbar from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

// 테스트용 초기 부원 데이터 리스트
const INITIAL_MEMBERS = [
  { id: 1, name: '김수호', status: '출석' },
  { id: 2, name: '박민준', status: '결석' },
  { id: 3, name: '이서연', status: '지각' },
  { id: 4, name: '최도현', status: '미체크' },
  { id: 5, name: '정예은', status: '출석' },
  { id: 6, name: '강동우', status: '미체크' },
  { id: 7, name: '윤지민', status: '미체크' },
];

export default function AdminAttendancePage() {
  const [date, setDate] = useState('2026-07-03'); // 디자인 합본 기준 기본값
  const [allowTime, setAllowTime] = useState('10'); // 기본 10분 설정
  const [attendanceCode, setAttendanceCode] = useState('------');
  const [isStarted, setIsStarted] = useState(false);
  const [members, setMembers] = useState(INITIAL_MEMBERS);

  // 🎲 6자리 랜덤 출석 코드 생성 및 타이머 시작 로직
  const handleStartAttendance = () => {
    if (isStarted) {
      // 이미 시작된 상태에서 누르면 종료 처리
      if (confirm('출석 지정을 종료하시겠습니까?')) {
        setAttendanceCode('------');
        setIsStarted(false);
      }
      return;
    }

    // 6자리 랜덤 숫자 생성
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setAttendanceCode(randomCode);
    setIsStarted(true);
  };

  // 🔘 부원 개별 상태 수동 변경 함수 (라디오 버튼 핸들러)
  const handleStatusChange = (memberId: number, newStatus: string) => {
    setMembers((prev) =>
      prev.map((member) =>
        member.id === memberId ? { ...member, status: newStatus } : member
      )
    );
  };

  // 💾 전체 저장 버튼 이벤트
  const handleSaveAll = () => {
    alert('현재 출석부 상태가 임시 저장되었습니다! (백엔드 연결 대기)');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF8EB]">
      {/* 상단 네비게이션 바 */}
      <Navbar />

      {/* 메인 본문 영역 (너비 제한 및 중앙 정렬) */}
      <main className="flex-grow w-full max-w-5xl mx-auto px-6 pt-28 pb-24">
        
        {/* 👑 페이지 메인 타이틀 (ABOUT 페이지 스타일 차용) */}
        <div className="mb-10">
          <h1 className="text-[#6B4E48] text-4xl font-extrabold mb-[-10px] relative z-10 ml-4">
            출석 관리자 모드
          </h1>
          <div className="h-3 w-48 bg-[#F2C94C] opacity-60 rounded-full ml-2 relative z-0" />
        </div>

        {/* 윗단: 설정 및 코드 생성 대시보드 (2단 그리드 레이아웃) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* ⚙️ 1. 출석 조건 설정 카드 */}
          <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow-md border border-[#D1C7BD] flex flex-col justify-between">
            <h2 className="text-xl font-bold text-[#6B4E48] mb-6 flex items-center gap-2">
              <span>⚙️</span> 출석 조건 설정
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* 날짜 선택 필드 */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-[#9B827D]">출석 일자</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  disabled={isStarted}
                  className="w-full h-12 px-4 rounded-xl border border-[#D1C7BD] text-[#6D4E48] focus:outline-none focus:border-[#6B4E48] bg-[#FDFAF5] disabled:opacity-60 font-medium"
                />
              </div>

              {/* 허용 시간 선택 필드 */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-[#9B827D]">제한 시간 (분)</label>
                <div className="relative">
                  <select 
                    value={allowTime}
                    onChange={(e) => setAllowTime(e.target.value)}
                    disabled={isStarted}
                    className="w-full h-12 px-4 rounded-xl border border-[#D1C7BD] text-[#6D4E48] focus:outline-none focus:border-[#6B4E48] bg-[#FDFAF5] disabled:opacity-60 font-medium appearance-none"
                  >
                    <option value="5">5분</option>
                    <option value="10">10분</option>
                    <option value="20">20분</option>
                    <option value="30">30분</option>
                    <option value="60">1시간</option>
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#9B827D] pointer-events-none">▼</span>
                </div>
              </div>
            </div>

            {/* 시작 / 종료 대형 토글 버튼 */}
            <button
              onClick={handleStartAttendance}
              className={`w-full py-4 rounded-4xl font-extrabold text-lg shadow-sm transition-all duration-300 hover:scale-[1.02] ${
                isStarted 
                  ? 'bg-[#F1EEEA] text-[#9B827D] hover:bg-[#E2DCD3]' 
                  : 'bg-[#F2C94C] text-[#6B4E48] hover:bg-[#E5B94E]'
              }`}
            >
              {isStarted ? '⏱️ 출석 생성 종료하기' : '🚀 랜덤 출석 코드 생성 및 시작'}
            </button>
          </div>

          {/* 🔢 2. 발급된 출석 코드 전광판 카드 */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-[#D1C7BD] flex flex-col items-center justify-center text-center">
            <h2 className="text-sm font-bold text-[#9B827D] tracking-wider uppercase mb-4">
              CURRENT ATTENDANCE CODE
            </h2>
            
            {/* 6자리 코드 표시창 */}
            <div className="bg-[#FDFAF5] border border-[#D1C7BD] w-full py-6 rounded-2xl mb-4 transition-all duration-300">
              <span className="text-4xl md:text-5xl font-black tracking-[0.2em] text-[#6B4E48] pl-[0.2em]">
                {attendanceCode}
              </span>
            </div>

            <p className="text-xs text-[#9B827D] leading-5">
              {isStarted 
                ? `부원들에게 위 6자리 코드를 안내하세요.\n설정된 시간(${allowTime}분) 동안 유효합니다.`
                : '출석 시작 버튼을 누르면\n6자리 랜덤 보안 코드가 발급됩니다.'
              }
            </p>
          </div>

        </div>

        {/* 📋 아랫단: 부원 실시간 출석부 현황 리스트 */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#D1C7BD] overflow-hidden">
          
          {/* 출석부 상단 헤더 구역 */}
          <div className="bg-[#F1EEEA] px-6 py-5 border-b border-[#D1C7BD] flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-extrabold text-[#6B4E48]">📋 동아리 명부 및 실시간 상태</h3>
              <span className="bg-[#6B4E48] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {members.length}명
              </span>
            </div>
            
            {/* 전체 임시저장 버튼 */}
            <button 
              onClick={handleSaveAll}
              className="bg-[#6B4E48] hover:bg-[#573E39] text-white font-bold px-6 py-2 rounded-4xl text-sm transition-all shadow-sm hover:scale-105"
            >
              💾 변경 사항 저장
            </button>
          </div>

          {/* 실시간 부원 테이블 (반응형 대응) */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FDFAF5] text-[#9B827D] font-bold text-sm border-b border-[#D1C7BD]">
                  <th className="p-4 pl-8 w-24 text-center">번호</th>
                  <th className="p-4 w-40">이름</th>
                  <th className="p-4 text-center sm:text-left">출석 상태 상태 수동 변경</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {members.map((member, index) => (
                  <tr key={member.id} className="hover:bg-[#FDF8EB]/30 transition-colors">
                    {/* 부원 번호 */}
                    <td className="p-4 pl-8 text-center font-medium text-[#9B827D]">{index + 1}</td>
                    
                    {/* 부원 이름 */}
                    <td className="p-4 font-bold text-[#6D4E48] text-base">{member.name}</td>
                    
                    {/* 라디오 버튼 선택 구역 */}
                    <td className="p-4">
                      <div className="flex flex-wrap items-center gap-3 sm:gap-6 justify-center sm:justify-start">
                        {['출석', '지각', '결석'].map((status) => {
                          const isChecked = member.status === status;
                          
                          // 상태별 커스텀 스타일 입히기 (라디오 색상 디테일)
                          let accentColor = 'checked:bg-green-500';
                          if (status === '지각') accentColor = 'checked:bg-orange-400';
                          if (status === '결석') accentColor = 'checked:bg-red-500';

                          return (
                            <label 
                              key={status} 
                              className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition-all text-sm font-bold select-none ${
                                isChecked 
                                  ? 'bg-[#FDFAF5] border-[#6B4E48] text-[#6B4E48] shadow-sm' 
                                  : 'bg-white border-gray-200 text-gray-400 hover:border-[#D1C7BD]'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`member-${member.id}`}
                                value={status}
                                checked={isChecked}
                                onChange={() => handleStatusChange(member.id, status)}
                                className={`w-4 h-4 text-[#6B4E48] border-gray-300 focus:ring-0 ${accentColor}`}
                              />
                              {status}
                            </label>
                          );
                        })}
                        
                        {/* 현재 상태를 요약해 주는 미니 배지 */}
                        <span className={`text-xs px-2.5 py-1 rounded-md font-bold ml-auto hidden md:inline-block ${
                          member.status === '출석' ? 'bg-green-50 text-green-600' :
                          member.status === '지각' ? 'bg-orange-50 text-orange-600' :
                          member.status === '결석' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                          현재: {member.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </main>

      {/* 하단 푸터 */}
      <Footer />
    </div>
  );
}