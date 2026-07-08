import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext'; // 인증 컨텍스트 임포트
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Home() {
  const auth = useAuth();
  const router = useRouter();

  // 💡 로그인된 사용자는 자동으로 /main 대시보드로 이동시킵니다.
  useEffect(() => {
    if (auth.isHydrated && auth.isLoggedIn) {
      router.replace('/main');
    }
  }, [auth.isHydrated, auth.isLoggedIn, router]);

  // 이미 로그인되어 이동 중일 때는 랜딩 페이지 UI가 잠깐 깜빡이며 노출되는 것을 방지합니다.
  if (auth.isLoggedIn) {
    return null;
  }
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main
        className="relative flex flex-col flex-grow items-center justify-center overflow-hidden"
        style={{
          background: `
            radial-gradient(circle at 85% 20%, rgba(247, 217, 136, 0.28), transparent 30%),
            radial-gradient(circle at 15% 85%, rgba(247, 217, 136, 0.22), transparent 30%),
            #FFFDF8
          `,
        }}
      >
        <section className="-mt-16 flex flex-col items-center text-center">
          <div className="rounded-full bg-[#FBEFBE] px-6 py-2 text-[18px] font-medium text-[#A07A72] shadow-sm">
            PNU CSE Club · Est. 2008
          </div>

          <h1 className="mt-2 text-[100px] font-black leading-none tracking-tight text-[#6B4E48]">
            UNTOC
          </h1>

          <p className="mt-2 text-[24px] font-medium text-[#9A7870]">
            Untouchable Ceaseless
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}