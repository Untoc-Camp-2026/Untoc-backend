import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';

export default function MainPage() {
  const auth = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-[#FFFDF8]">
      <Head>
        <title>메인 - UNTOC</title>
      </Head>

      <Header />

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <section className="w-full max-w-5xl rounded-[32px] border border-[#E8E0D5] bg-white p-10 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-[#A3918D]">로그인 완료</p>
              <h1 className="mt-2 text-4xl font-extrabold text-[#6B4E48]">UNTOC 대시보드</h1>
            </div>
            <div className="rounded-full bg-[#FFF4C9] px-4 py-2 text-sm font-bold text-[#6B4E48]">
              {auth.isAdmin ? '관리자' : '회원'}
            </div>
          </div>

          <div className="mb-8 rounded-[24px] bg-[#FFFDF5] p-6 text-[#6B4E48] shadow-inner">
            <p className="text-lg font-bold">{auth.session?.name || auth.session?.userId || '회원'} 님, 환영합니다.</p>
            <p className="mt-2 text-sm text-[#8C8279]">
              게시판, 캘린더, 마이페이지에서 로그인 상태와 권한을 기준으로 기능이 동작합니다.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/board" className="rounded-[24px] border border-[#E8E0D5] bg-white p-6 font-bold text-[#6B4E48] shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
              게시판 바로가기
              <p className="mt-2 text-sm font-normal text-[#8C8279]">목록, 상세, 작성, 수정, 댓글 관리</p>
            </Link>
            <Link href="/calendar" className="rounded-[24px] border border-[#E8E0D5] bg-white p-6 font-bold text-[#6B4E48] shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
              캘린더 바로가기
              <p className="mt-2 text-sm font-normal text-[#8C8279]">관리자 권한 시 일정 등록/수정 가능</p>
            </Link>
            <Link href="/mypage" className="rounded-[24px] border border-[#E8E0D5] bg-white p-6 font-bold text-[#6B4E48] shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
              마이페이지
              <p className="mt-2 text-sm font-normal text-[#8C8279]">프로필, 소개, 비밀번호 변경</p>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}