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
  const [date, setDate] = useState('2026-07-03');
  const [allowTime, setAllowTime] = useState('10');
  const [attendanceCode, setAttendanceCode] = useState('------');
  const [isStarted, setIsStarted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // 팝업 제어용 상태 추가
  const [members, setMembers] = useState(INITIAL_MEMBERS);

  // 🎲 6자리 랜덤 출석 코드 생성 및 팝업 오픈 로직
  const handleStartAttendance = () => {
    if (isStarted) {
      if (confirm('출석 지정을 종료하시겠습니까?')) {
        setAttendanceCode('------');
        setIsStarted(false);
        setIsModalOpen(false);
      }
      return;
    }

    // 6자리 랜덤 숫자 생성
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setAttendanceCode(randomCode);
    setIsStarted(true);
    setIsModalOpen(true); // 팝업창 열기
  };

  // 🔘 부원 개별 상태 수동 변경 함수
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

      {/* 메인 본문 영역 */}
      <main className="flex-grow w-full max-w-5xl mx-auto px-6 pt-28 pb-24">
        
        {/* 👑 페이지 메인 타이틀 */}
        <div className="mb-10 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div>
            <h1 className="text-[#6B4E48] text-4xl font-extrabold mb-[-10px] relative z-10 ml-4">
              출석 관리자 모드
            </h1>
            <div className="h-3 w-48 bg-[#F2C94C] opacity-60 rounded-full ml-2 relative z-0" />
          </div>

          {/* 💡 [추가] 출석 진행 중일 때 언제든 팝업을 다시 열 수 있는 리오픈 버튼 */}
          {isStarted && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white hover:bg-[#FDFAF5] text-[#6B4E48] border border-[#D1C7BD] font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto"
            >
              🔢 출석 코드 다시 확인하기
            </button>
          )}
        </div>

        {/* ⚙️ 출석 조건 설정 패널 (기존 좌우 분할 구조에서 풀 사이즈 형태로 넓고 시원하게 변경) */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-[#D1C7BD] flex flex-col justify-between mb-12">
          <h2 className="text-xl font-bold text-[#6B4E48] mb-6 flex items-center gap-2">
            <span>⚙️</span> 출석 조건 설정
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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

          {/* 시작 / 종료 토글 버튼 */}
          <button
            onClick={handleStartAttendance}
            className={`w-full py-4 rounded-4xl font-extrabold text-lg shadow-sm transition-all duration-300 hover:scale-[1.01] ${
              isStarted 
                ? 'bg-[#F1EEEA] text-[#9B827D] hover:bg-[#E2DCD3]' 
                : 'bg-[#F2C94C] text-[#6B4E48] hover:bg-[#E5B94E]'
            }`}
          >
            {isStarted ? '⏱️ 출석 지정 종료하기 (마감)' : '🚀 랜덤 출석 코드 생성 및 팝업창 띄우기'}
          </button>
        </div>

        {/* 📋 부원 실시간 출석부 현황 리스트 */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#D1C7BD] overflow-hidden">
          <div className="bg-[#F1EEEA] px-6 py-5 border-b border-[#D1C7BD] flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-extrabold text-[#6B4E48]">📋 동아리 명부 및 실시간 상태</h3>
              <span className="bg-[#6B4E48] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {members.length}명
              </span>
            </div>
            <button 
              onClick={handleSaveAll}
              className="bg-[#6B4E48] hover:bg-[#573E39] text-white font-bold px-6 py-2 rounded-4xl text-sm transition-all shadow-sm hover:scale-105"
            >
              💾 변경 사항 저장
            </button>
          </div>

          {/* 실시간 부원 현황 테이블 */}
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
                    <td className="p-4 pl-8 text-center font-medium text-[#9B827D]">{index + 1}</td>
                    <td className="p-4 font-bold text-[#6D4E48] text-base">{member.name}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap items-center gap-3 sm:gap-6 justify-center sm:justify-start">
                        {['출석', '지각', '결석'].map((status) => {
                          const isChecked = member.status === status;
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

      {/* 🚨 [새로운 컴포넌트] 출석코드 전광판 모달 팝업창 영역 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* 어두운 배경 반투명 필터 + 블러 효과 */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)} // 바깥 어두운 영역 누르면 닫히기
          />
          
          {/* 팝업 본체 박스 (UNTOC 톤앤매너 매칭) */}
          <div className="relative bg-white w-full max-w-lg p-8 md:p-10 rounded-2xl shadow-2xl border border-[#D1C7BD] text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
            
            <h2 className="text-sm font-black text-[#9B827D] tracking-widest uppercase mb-6">
              📢 생성된 출석보안코드
            </h2>
            
            {/* 자간을 넓혀 아주 큼직하게 배치한 번호 디스플레이 */}
            <div className="bg-[#FDFAF5] border border-[#D1C7BD] w-full py-8 rounded-2xl mb-6 shadow-inner">
              <span className="text-5xl md:text-6xl font-black tracking-[0.25em] text-[#6B4E48] pl-[0.25em]">
                {attendanceCode}
              </span>
            </div>

            <div className="text-sm text-[#6D4E48] font-medium leading-6 mb-8">
              <p>부원들에게 위 6자리 코드를 즉시 공지해 주세요.</p>
              <p className="mt-1 text-xs text-[#9B827D]">
                설정된 제한시간(<span className="text-[#6B4E48] font-bold">{allowTime}분</span>) 동안 시스템이 활성화됩니다.
              </p>
            </div>

            {/* 팝업 닫기 버튼 */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full bg-[#F2C94C] hover:bg-[#E5B94E] text-[#6B4E48] font-extrabold py-3.5 rounded-4xl transition-all duration-300 shadow-sm hover:scale-105 text-base"
            >
              창 닫고 출석부 확인하기
            </button>
          </div>
        </div>
      )}

      {/* 하단 푸터 */}
      <Footer />
    </div>
  );
}