// front/src/pages/login/index.tsx
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const router = useRouter();
  const auth = useAuth();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (submitting) return;

    setSubmitting(true);
    try {
      await auth.login(loginId, password);
      router.push('/main');
    } catch (error) {
      console.error('로그인 실패:', error);
      alert(error instanceof Error ? error.message : '로그인에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#6B4E48] font-sans flex flex-col relative">
      <Navbar />
      <Head>
        <title>로그인 - UNTOC</title>
      </Head>
      {/* 2. 로그인 폼 영역 (PDF 15페이지 참조) */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-[24px] shadow-sm border border-[#E8E0D5] p-10">
          
          <h1 className="text-5xl font-extrabold text-center mb-10 text-[#6B4E48]">로그인</h1>
          
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            
            {/* 아이디 입력칸 (Placeholder 적용) */}
            <input
              id="id"
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder="아이디"
              className="w-full px-4 py-3 rounded-[8px] border border-[#E8E0D5] outline-none focus:border-[#F7D988] focus:ring-1 focus:ring-[#F7D988] transition-colors bg-[#FFFDF5] text-[#6B4E48] placeholder:text-[#A3918D] placeholder:font-bold"
              required
            />

            {/* 비밀번호 입력칸 (Placeholder 적용) */}
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              className="w-full px-4 py-3 rounded-[8px] border border-[#E8E0D5] outline-none focus:border-[#F7D988] focus:ring-1 focus:ring-[#F7D988] transition-colors bg-[#FFFDF5] text-[#6B4E48] placeholder:text-[#A3918D] placeholder:font-bold"
              required
            />

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-6 bg-[#6B4E48] hover:bg-[#E5C77A] text-[#FFFFFF] font-extrabold text-lg py-4 rounded-tr-[40px] rounded-bl-[40px] transition-colors shadow-sm"
            >
              {submitting ? '로그인 중...' : '로그인'}
            </button>

          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}