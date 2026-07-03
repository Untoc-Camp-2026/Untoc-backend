// front/src/pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Layout from "@/components/layout/Layout";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // 현재 경로(path)를 기반으로 로그인 상태인지 유추하는 로직 (임시)
  // 실제로는 JWT 토큰이나 전역 상태(Zustand, Recoil 등)로 판단해야 합니다.
  const authRequiredPaths = ['/board', '/calendar', '/attendance', '/mypage', '/main'];
  
  // 현재 접속한 URL이 authRequiredPaths 중 하나로 시작하면 isLogin을 true로 줌
  const isLoginRoute = authRequiredPaths.some(path => router.pathname.startsWith(path));

  // 로그인 페이지나 회원가입 페이지에서는 헤더/푸터를 다르게 하거나 숨길 수도 있습니다.
  // 원치 않으시면 그냥 <Layout isLogin={isLoginRoute}> 로 감싸기만 하면 됩니다.
  const isAuthPage = router.pathname === '/login' || router.pathname === '/signup';

  if (isAuthPage) {
    return <Component {...pageProps} />; // 로그인 화면에선 Header/Footer 제외
  }

  return (
    <Layout isLogin={isLoginRoute}>
      <Component {...pageProps} />
    </Layout>
  );
}