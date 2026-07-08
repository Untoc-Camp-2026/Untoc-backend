'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import {
  createAttendanceSession,
  getAttendanceRecords,
  updateAttendanceStatus,
} from '@/api/attendance';
import type { AttendanceMemberRow, AttendanceStatus } from '@/types/attendance';

const todayString = () => new Date().toISOString().slice(0, 10);

export default function AdminAttendancePage() {
  const router = useRouter();
  const auth = useAuth();
  
  // State from API Code
  const [date, setDate] = useState(todayString());
  const [allowTime, setAllowTime] = useState('10');
  const [attendanceCode, setAttendanceCode] = useState('------');
  const [isStarted, setIsStarted] = useState(false);
  const [members, setMembers] = useState<AttendanceMemberRow[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Record<string, AttendanceStatus>>({});

  // State from UI Code
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🛡️ 접근 권한 체크
  useEffect(() => {
    if (!auth.isHydrated) return;

    if (!auth.isLoggedIn) {
      router.replace('/login');
      return;
    }

    if (!auth.isAdmin) {
      alert('관리자만 접근할 수 있는 페이지입니다.');
      router.replace('/attendance/member');
    }
  }, [auth.isHydrated, auth.isLoggedIn, auth.isAdmin, router]);

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

  // 🛑 출석 종료(마감) 함수
  const handleEndAttendance = () => {
    cleanAttendanceStorage();
    setAttendanceCode('------');
    setIsStarted(false);
    setIsModalOpen(false);
  };

  const loadRecords = useCallback(async (targetDate: string) => {
    setLoadingRecords(true);
    try {
      const records = await getAttendanceRecords(targetDate);
      setMembers(
        records.map((record) => ({
          userId: record.user_id,
          status: record.status,
        }))
      );
      setPendingChanges({});
    } catch (error) {
      setMembers([]);
      alert(error instanceof Error ? error.message : '출석 명단을 불러오지 못했습니다.');
    } finally {
      setLoadingRecords(false);
    }
  }, []);

  useEffect(() => {
    if (!auth.isAdmin) return;
    void loadRecords(date);
  }, [auth.isAdmin, date, loadRecords]);

  if (!auth.isHydrated || !auth.isLoggedIn || !auth.isAdmin) {
    return null;
  }

  // 🚀 출석 시작 및 백엔드 API 연동
  const handleStartAttendance = async () => {
    if (isStarted) {
      if (confirm('출석 지정을 종료하시겠습니까? 종료 시 코드가 만료됩니다.')) {
        handleEndAttendance();
      }
      return;
    }

    try {
      // 1. API를 통해 세션 생성
      const session = await createAttendanceSession({
        title: `${date} 출석`,
        location: 'UNTOC',
        duration_minutes: Number(allowTime),
      });

      // 2. 만료 시간 계산 및 LocalStorage 저장
      const authCode = session.auth_code;
      const expireTime = new Date().getTime() + parseInt(allowTime) * 60 * 1000;

      localStorage.setItem('untoc_attendance_code', authCode);
      localStorage.setItem('untoc_attendance_expire_time', expireTime.toString());
      localStorage.setItem('untoc_attendance_date', date);
      localStorage.setItem('untoc_attendance_allow_time', allowTime);

      // 3. State 업데이트 및 모달 오픈
      setAttendanceCode(authCode);
      setIsStarted(true);
      setIsModalOpen(true);
      await loadRecords(date);
    } catch (error) {
      alert(error instanceof Error ? error.message : '출석 세션 생성에 실패했습니다.');
    }
  };

  const handleStatusChange = (userId: string, newStatus: AttendanceStatus) => {
    setMembers((prev) =>
      prev.map((member) =>
        member.userId === userId ? { ...member, status: newStatus } : member
      )
    );
    setPendingChanges((prev) => ({ ...prev, [userId]: newStatus }));
  };

  const handleSaveAll = async () => {
    const entries = Object.entries(pendingChanges);
    if (entries.length === 0) {
      alert('저장할 변경 사항이 없습니다.');
      return;
    }

    setSaving(true);
    try {
      await Promise.all(
        entries.map(([userId, status]) =>
          updateAttendanceStatus({
            userId,
            targetDate: date,
            status,
          })
        )
      );
      setPendingChanges({});
      await loadRecords(date);
      alert('출석부가 성공적으로 저장되었습니다.');
    } catch (error) {
      alert(error instanceof Error ? error.message : '출석부 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF8EB]">
      <Navbar />

      <main className="flex-grow w-full max-w-5xl mx-auto px-6 pt-28 pb-24">
        
        {/* 페이지 타이틀 & 모달 오픈 버튼 병합 */}
        <div className="mb-10 window-title-area flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div>
            <h1 className="text-[#6B4E48] text-4xl font-extrabold mb-[-10px] relative z-10 ml-4">
              출석 관리자 모드
            </h1>
            <div className="h-3 w-48 bg-[#F2C94C] opacity-60 rounded-full ml-2 relative z-0" />
          </div>

          {isStarted && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white hover:bg-[#FDFAF5] text-[#6B4E48] border border-[#D1C7BD] font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto hover:scale-105"
            >
              🔢 출석 코드 다시 확인하기
            </button>
          )}
        </div>

        {/* 2번째 코드의 3-Column 대시보드 구조 적용 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* 출석 조건 설정 (좌측 2칸) */}
          <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow-md border border-[#D1C7BD] flex flex-col justify-between">
            <h2 className="text-xl font-bold text-[#6B4E48] mb-6 flex items-center gap-2">
              <span>⚙️</span> 출석 조건 설정
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
              onClick={handleStartAttendance}
              className={`w-full py-4 rounded-4xl font-extrabold text-lg shadow-sm transition-all duration-300 hover:scale-[1.01] ${
                isStarted
                  ? 'bg-[#F1EEEA] text-[#9B827D] hover:bg-[#E2DCD3]'
                  : 'bg-[#F2C94C] text-[#6B4E48] hover:bg-[#E5B94E]'
              }`}
            >
              {isStarted ? '⏱️ 출석 생성 종료하기' : '🚀 랜덤 출석 코드 생성 및 팝업창 띄우기'}
            </button>
          </div>

          {/* 현재 코드 상태 안내 (우측 1칸) */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-[#D1C7BD] flex flex-col items-center justify-center text-center">
            <h2 className="text-sm font-bold text-[#9B827D] tracking-wider uppercase mb-4">
              CURRENT ATTENDANCE CODE
            </h2>
            <div className="bg-[#FDFAF5] border border-[#D1C7BD] w-full py-6 rounded-2xl mb-4 transition-all duration-300">
              <span className="text-4xl md:text-5xl font-black tracking-[0.2em] text-[#6B4E48] pl-[0.2em]">
                {attendanceCode}
              </span>
            </div>
            <p className="text-xs text-[#9B827D] leading-5 whitespace-pre-line">
              {isStarted
                ? `부원들에게 위 6자리 코드를 안내하세요.\n설정된 시간(${allowTime}분) 동안 유효합니다.`
                : '출석 시작 버튼을 누르면\n6자리 랜덤 보안 코드가 발급됩니다.'}
            </p>
          </div>
        </div>

        {/* 동아리 명부 리스트 */}
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
              disabled={saving || loadingRecords}
              className="bg-[#6B4E48] hover:bg-[#573E39] text-white font-bold px-6 py-2 rounded-4xl text-sm transition-all shadow-sm hover:scale-105 disabled:opacity-50"
            >
              {saving ? '저장 중...' : '💾 변경 사항 저장'}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FDFAF5] text-[#9B827D] font-bold text-sm border-b border-[#D1C7BD]">
                  <th className="p-4 pl-8 w-24 text-center">번호</th>
                  <th className="p-4 w-40">아이디</th>
                  <th className="p-4 text-center sm:text-left">출석 상태 수동 변경</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loadingRecords ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-sm font-bold text-[#9B827D]">
                      출석 명단을 불러오는 중...
                    </td>
                  </tr>
                ) : members.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-sm font-bold text-[#9B827D]">
                      해당 날짜의 출석 기록이 없습니다. 출석 세션을 먼저 생성하세요.
                    </td>
                  </tr>
                ) : (
                  members.map((member, index) => (
                    <tr key={member.userId} className="hover:bg-[#FDF8EB]/30 transition-colors">
                      <td className="p-4 pl-8 text-center font-medium text-[#9B827D]">{index + 1}</td>
                      <td className="p-4 font-bold text-[#6D4E48] text-base">{member.userId}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap items-center gap-3 sm:gap-6 justify-center sm:justify-start">
                          {/* API 요구사항인 AttendanceStatus에 맞춰 출석, 결석 옵션 유지 + 1번 코드 스타일 적용 */}
                          {(['출석', '결석'] as AttendanceStatus[]).map((status) => {
                            const isChecked = member.status === status;
                            const accentColor =
                              status === '출석' ? 'checked:bg-green-500' : 'checked:bg-red-500';

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
                                  name={`member-${member.userId}`}
                                  value={status}
                                  checked={isChecked}
                                  onChange={() => handleStatusChange(member.userId, status)}
                                  className={`w-4 h-4 text-[#6B4E48] border-gray-300 focus:ring-0 ${accentColor}`}
                                />
                                {status}
                              </label>
                            );
                          })}
                          <span
                            className={`text-xs px-2.5 py-1 rounded-md font-bold ml-auto hidden md:inline-block ${
                              member.status === '출석'
                                ? 'bg-green-50 text-green-600'
                                : member.status === '결석'
                                  ? 'bg-red-50 text-red-600'
                                  : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            현재: {member.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* 모달 팝업 구역 (1번 코드에서 가져옴) */}
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