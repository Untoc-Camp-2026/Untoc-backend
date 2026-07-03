// front/src/components/layout/Layout.tsx
import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

type LayoutProps = {
  children: ReactNode;
  isLogin?: boolean;
};

export default function Layout({ children, isLogin = false }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#FFFDF5] font-sans">
      {/* 1. 상단 공통 헤더 */}
      <Header isLogin={isLogin} />

      {/* 2. 각 페이지의 본문 내용이 들어갈 자리 */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* 3. 하단 공통 푸터 */}
      <Footer />
    </div>
  );
}