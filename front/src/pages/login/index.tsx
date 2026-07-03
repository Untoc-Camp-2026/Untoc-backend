// front/src/pages/login/index.tsx
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

// assets/images/ 에 있는 로고 불러오기 (svg가 있다면 해당 파일명으로 변경하셔도 됩니다)
import untocLogo from '@/assets/images/언톡_스티커.webp';

export default function Login() {
  const router = useRouter();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: 백엔드 API 연동 (src/api/auth.ts 활용)
    console.log('로그인 시도:', { loginId, password });
    
    // 임시로 로그인 후 메인 대시보드로 이동
    router.push('/main');
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#6B4E48] font-sans flex flex-col relative">
      <Head>
        <title>로그인 - UNTOC</title>
      </Head>

      {/* 상단 네비게이션 바 (좌상단 홈 이동 로고 + 우측 메뉴 전체 정상화) */}
      <header className="absolute top-0 left-0 w-full h-20 flex items-center justify-between px-8 md:px-6 bg-transparent z-10">
        
        {/* [좌상단] 로고 아이콘 + 텍스트 (클릭 시 메인 index.tsx '/' 로 이동) */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Image 
            src={untocLogo} 
            alt="UNTOC 로고" 
            width={100} 
            height={100} 
            className="object-contain"
          />
        </Link>

        {/* [우측] 도면에 맞춰 UNTOC 메뉴부터 순서대로 배치 */}
        <nav className="flex items-center gap-8 font-semibold">
          {/* 복구된 UNTOC 소개 메뉴 */}
          <Link href="/about" className="hover:text-[#A3918D] transition-colors">
            UNTOC
          </Link>
          <Link href="/untoc-camp" className="hover:text-[#A3918D] transition-colors">
            UNTOC CAMP
          </Link>
          <Link href="/gallery" className="hover:text-[#A3918D] transition-colors">
            Gallery
          </Link>
          {/* 현재 활성화된 로그인 메뉴 */}
          <Link href="/login" className="text-[#A3918D] font-bold">
            → Login
          </Link>
        </nav>
      </header>

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
              className="w-full mt-6 bg-[#6B4E48] hover:bg-[#E5C77A] text-[#FFFFFF] font-extrabold text-lg py-4 rounded-tr-[40px] rounded-bl-[40px] transition-colors shadow-sm"
            >
              로그인
            </button>

          </form>
        </div>
      </main>
    </div>
  );
}