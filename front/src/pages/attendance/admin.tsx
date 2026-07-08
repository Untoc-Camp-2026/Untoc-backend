'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [members, setMembers] = useState(INITIAL_MEMBERS);

  // 💾 1. 컴포넌트 최초 로드 시 localStorage에서 기존 출석 정보 복구
  useEffect(() => {
    const savedCode = localStorage.getItem('untoc_attendance_code');
    const savedExpireTime = localStorage.getItem('untoc_attendance_expire_time');
    const savedDate = localStorage.getItem('untoc_attendance_date');
    const savedAllowTime = localStorage.getItem('untoc_attendance_allow_time');

    if (savedCode && savedExpireTime) {
      const now = new Date().getTime();
      // 만료 시간이 아직 지나지 않은 경우에만 상태 복구
      if (now < parseInt(savedExpireTime)) {
        setAttendanceCode(savedCode);
        setIsStarted(true);
        if (savedDate) setDate(savedDate);
        if (savedAllowTime) setAllowTime(savedAllowTime);
      } else {
        // 시간이 지났다면 데이터 정리
        cleanAttendanceStorage();
      }
    }
  }, []);

  // ⏱️ 2. 실시간 시간 만료 체크 타이머 (다른 페이지에 갔다 와도 계속 작동)
  useEffect(() => {
    if (!isStarted) return;

    const checkExpiryId = setInterval(() => {
      const savedExpireTime = localStorage.getItem('untoc_attendance_expire_time');
      if (savedExpireTime) {
        const now = new Date().getTime();
        // 설정한 시간이 종료되면 자동으로 마감 처리
        if (now >= parseInt(savedExpireTime)) {
          alert('설정된 출석 제한 시간이 만료되어 자동 종료되었습니다.');
          handleEndAttendance();
        }
      }
    }, 1000);

    return () => clearInterval(checkExpiryId);
  }, [isStarted]);

  // Storage 비우기 공통 함수
  const cleanAttendanceStorage = () => {
    localStorage.removeItem('untoc_attendance_code');
    localStorage.removeItem('untoc_attendance_expire_time');
    localStorage.removeItem('untoc_attendance_date');
    localStorage.removeItem('untoc_attendance_allow_time');
  };

  // 🎲 출석 코드 생성 및 세션 저장
  const handleStartAttendance = () => {
    // 6자리 랜덤 숫자 생성
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // ⏰ 만료 시간 계산 (현재 시간 + 설정된 분)
    const expireTime = new Date().getTime() + parseInt(allowTime) * 60 * 1000;

    // 브라우저 창고(localStorage)에 구워버리기
    localStorage.setItem('untoc_attendance_code', randomCode);
    localStorage.setItem('untoc_attendance_expire_time', expireTime.toString());
    localStorage.setItem('untoc_attendance_date', date);
    localStorage.setItem('untoc_attendance_allow_time', allowTime);

    setAttendanceCode(randomCode);
    setIsStarted(true);
    setIsModalOpen(true);
  };

  // 🛑 출석 종료(마감) 함수
  const handleEndAttendance = () => {
    cleanAttendanceStorage();
    setAttendanceCode('------');
    setIsStarted(false);
    setIsModalOpen(false);
  };

  const toggleAttendanceState = () => {
    if (isStarted) {
      if (confirm('출석 지정을 종료하시겠습니까? 종료 시 코드가 만료됩니다.')) {
        handleEndAttendance();
      }
    } else {
      handleStartAttendance();
    }
  };

  const handleStatusChange = (memberId: number, newStatus: string) => {
    setMembers((prev) =>
      prev.map((member) =>
        member.id === memberId ? { ...member, status: newStatus } : member
      )
    );
  };

  const handleSaveAll = () => {
    alert('현재 출석부 상태가 임시 저장되었습니다! (백엔드 연결 대기)');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF8EB]">
      <Navbar />

      <main className="flex-grow w-full max-w-5xl mx-auto px-6 pt-28 pb-24">
        
        {/* 페이지 타이틀 */}
        <div className="mb-10 window-title-area flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div>
            <h1 className="text-[#6B4E48] text-4xl font-extrabold mb-[-10px] relative z-10 ml-4">
              출석 관리자 모드
            </h1>
            <div className="h-3 w-48 bg-[#F2C94C] opacity-60 rounded-full ml-2 relative z-0" />
          </div>

          {/* 복구되었거나 진행 중일 때만 등장하는 실시간 팝업 링크 버튼 */}
          {isStarted && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white hover:bg-[#FDFAF5] text-[#6B4E48] border border-[#D1C7BD] font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto hover:scale-105"
            >
              🔢 출석 코드 다시 확인하기
            </button>
          )}
        </div>

        {/* 설정 대시보드 */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-[#D1C7BD] flex flex-col justify-between mb-12">
          <h2 className="text-xl font-bold text-[#6B4E48] mb-6 flex items-center gap-2">
            <span>⚙️</span> 출석 조건 설정
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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

          <button
            onClick={toggleAttendanceState}
            className={`w-full py-4 rounded-4xl font-extrabold text-lg shadow-sm transition-all duration-300 hover:scale-[1.01] ${
              isStarted 
                ? 'bg-[#F1EEEA] text-[#9B827D] hover:bg-[#E2DCD3]' 
                : 'bg-[#F2C94C] text-[#6B4E48] hover:bg-[#E5B94E]'
            }`}
          >
            {isStarted ? '⏱️ 출석 지정 종료하기 (마감)' : '🚀 랜덤 출석 코드 생성 및 팝업창 띄우기'}
          </button>
        </div>

        {/* 명부 리스트 */}
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* 모달 팝업 구역 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-lg p-8 md:p-10 rounded-2xl shadow-2xl border border-[#D1C7BD] text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-sm font-black text-[#9B827D] tracking-widest uppercase mb-6">📢 생성된 출석보안코드</h2>
            <div className="bg-[#FDFAF5] border border-[#D1C7BD] w-full py-8 rounded-2xl mb-6 shadow-inner">
              <span className="text-5xl md:text-6xl font-black tracking-[0.25em] text-[#6B4E48] pl-[0.25em]">{attendanceCode}</span>
            </div>
            <div className="text-sm text-[#6D4E48] font-medium leading-6 mb-8">
              <p>부원들에게 위 6자리 코드를 즉시 공지해 주세요.</p>
              <p className="mt-1 text-xs text-[#9B827D]">설정된 제한시간 동안 코드가 유지되며 다른 페이지로 이동해도 만료되지 않습니다.</p>
            </div>
            <button onClick={() => setIsModalOpen(false)} className="w-full bg-[#F2C94C] hover:bg-[#E5B94E] text-[#6B4E48] font-extrabold py-3.5 rounded-4xl transition-all duration-300 shadow-sm hover:scale-105 text-base">
              창 닫고 출석부 확인하기
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}