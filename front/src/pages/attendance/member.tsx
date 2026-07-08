'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { verifyAttendance } from '@/api/attendance';

export default function MemberAttendancePage() {
  const router = useRouter();
  const auth = useAuth();
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (auth.isHydrated && !auth.isLoggedIn) {
      router.replace('/login');
    }
  }, [auth.isHydrated, auth.isLoggedIn, router]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setCode(value);
  };

  const handleSubmit = async () => {
    if (code.length !== 6) {
      alert('6자리 출석 코드를 모두 입력해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await verifyAttendance(code);
      alert(result.message || '출석이 완료되었습니다.');
      setCode('');
    } catch (error) {
      alert(error instanceof Error ? error.message : '출석 인증에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!auth.isHydrated || !auth.isLoggedIn) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF8EB]">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-6 pt-28 pb-24">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl w-full max-w-md border border-[#D1C7BD] flex flex-col items-center transition-all duration-500">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#6B4E48] mb-2 text-center">
            출석 코드를 입력해주세요
          </h1>
          <p className="text-[#9B827D] mb-8 text-sm md:text-base text-center">
            관리자가 화면에 띄운 6자리 숫자를 입력하세요.
          </p>

          <input
            type="text"
            value={code}
            onChange={handleCodeChange}
            placeholder="000000"
            className="w-full h-16 text-center text-4xl tracking-[0.5em] font-bold text-[#6D4E48] bg-white border-2 border-[#D1C7BD] rounded-lg focus:outline-none focus:border-[#6B4E48] focus:ring-1 focus:ring-[#6B4E48] mb-8 placeholder-[#E2DCD3]"
          />

          <div className="w-full flex flex-col gap-3">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-[#F2C94C] hover:bg-[#E5B94E] text-[#6B4E48] font-extrabold py-4 rounded-4xl transition-all duration-300 hover:scale-105 shadow-md text-lg disabled:opacity-50"
            >
              {submitting ? '확인 중...' : '출석 확인'}
            </button>
            <button
              onClick={() => setCode('')}
              className="w-full bg-[#F1EEEA] hover:bg-[#E2DCD3] text-[#9B827D] font-bold py-3 rounded-4xl transition-all duration-300 text-sm"
            >
              입력 취소
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
