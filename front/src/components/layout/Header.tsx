import Link from "next/link";
import { useState } from "react";
import Logo from "@/assets/images/untoc_logo.svg";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

type HeaderProps = {
  isLogin?: boolean;
  isAdmin?: boolean;
};

export default function Header({ isLogin, isAdmin }: HeaderProps) {
  const auth = useAuth();
  const resolvedIsLogin = isLogin ?? auth.isLoggedIn;
  const resolvedIsAdmin = isAdmin ?? auth.isAdmin;
  const [showUntoc, setShowUntoc] = useState(false);
  const [showCamp, setShowCamp] = useState(false);
  // 게시판 드롭다운 상태 추가
  const [showBoard, setShowBoard] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="flex h-24 items-center justify-between px-12">

        {/* Logo */}
        <Link href="/">
          <Image
            src={Logo}
            alt="UNTOC Logo"
            width={75}
            height={75}
            className="cursor-pointer"
          />
        </Link>

        {/* 오른쪽 메뉴 전체 */}
        <div className="flex items-center gap-10">
          {/* Navigation */}
          <nav className="flex items-center gap-4 text-[15px] font-bold text-[#6B4E48]">
            {!resolvedIsLogin ? (
              <>
                {/* UNTOC */}
                <div
                  className="relative px-2 py-3"
                  onMouseEnter={() => setShowUntoc(true)}
                  onMouseLeave={() => setShowUntoc(false)}
                >
                  <button
                    className={`rounded-full px-4 py-2 transition-all duration-200 ${
                      showUntoc
                        ? "bg-[#F7D988] shadow-sm"
                        : "hover:bg-[#F7D988] hover:shadow-sm"
                    }`}
                  >
                    UNTOC {showUntoc ? "▲" : "▼"}
                  </button>

                  {showUntoc && (
                    <div className="absolute top-full left-0 w-36 overflow-hidden rounded-xl border border-[#E8E0D5] bg-white shadow-lg pt-1">
                      <Link href="/untoc/about" className="block px-4 py-3 hover:bg-[#FFFDF5] transition-colors">
                        소개
                      </Link>
                      <Link href="/untoc/history" className="block px-4 py-3 hover:bg-[#FFFDF5] transition-colors">
                        연혁
                      </Link>
                      <Link href="/untoc/members" className="block px-4 py-3 hover:bg-[#FFFDF5] transition-colors">
                        구성원
                      </Link>
                    </div>
                  )}
                </div>

                {/* CAMP */}
                <div
                  className="relative px-2 py-3"
                  onMouseEnter={() => setShowCamp(true)}
                  onMouseLeave={() => setShowCamp(false)}
                >
                  <button
                    className={`rounded-full px-4 py-2 transition-all duration-200 ${
                      showCamp
                        ? "bg-[#F7D988] shadow-sm"
                        : "hover:bg-[#F7D988] hover:shadow-sm"
                    }`}
                  >
                    UNTOC CAMP {showCamp ? "▲" : "▼"}
                  </button>

                  {showCamp && (
                    <div className="absolute top-full left-0 w-36 overflow-hidden rounded-xl border border-[#E8E0D5] bg-white shadow-lg pt-1">
                      <Link href="/untoc-camp/about" className="block px-4 py-3 hover:bg-[#FFFDF5] transition-colors">
                        소개
                      </Link>
                      <Link href="/untoc-camp/projects" className="block px-4 py-3 hover:bg-[#FFFDF5] transition-colors">
                        역대 작품들
                      </Link>
                    </div>
                  )}
                </div>

                <Link
                  href="/gallery"
                  className="rounded-full px-4 py-2 transition-all duration-200 hover:bg-[#F7D988] hover:shadow-sm"
                >
                  Gallery
                </Link>
              </>
            ) : (
              <>
                {/* 게시판 (로그인 상태) */}
                <div
                  className="relative px-2 py-3"
                  onMouseEnter={() => setShowBoard(true)}
                  onMouseLeave={() => setShowBoard(false)}
                >
                  <button
                    className={`rounded-full px-4 py-2 transition-all duration-200 ${
                      showBoard
                        ? "bg-[#F7D988] shadow-sm"
                        : "hover:bg-[#F7D988] hover:shadow-sm"
                    }`}
                  >
                    게시판 {showBoard ? "▲" : "▼"}
                  </button>

                  {showBoard && (
                    <div className="absolute top-full left-0 w-44 overflow-hidden rounded-xl border border-[#E8E0D5] bg-white shadow-lg pt-1 flex flex-col">
                      {/* 👇 href 파라미터 적용 */}
                      <Link href="/board?category=FREE" className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#FFFDF5] transition-colors">
                        <span className="text-lg">💬</span> 자유게시판
                      </Link>
                      <Link href="/board?category=EXAM" className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#FFFDF5] transition-colors">
                        <span className="text-lg">📝</span> 시험게시판
                      </Link>
                      <Link href="/board?category=STUDY" className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#FFFDF5] transition-colors">
                        <span className="text-lg">📚</span> 스터디게시판
                      </Link>
                      <Link href="/board?category=JOB" className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#FFFDF5] transition-colors">
                        <span className="text-lg">💼</span> 취업게시판
                      </Link>
                      <Link href="/board?category=GAME" className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#FFFDF5] transition-colors">
                        <span className="text-lg">🎮</span> 게임게시판
                      </Link>
                    </div>
                  )}
                </div>

                <Link
                  href="/calendar"
                  className="rounded-full px-4 py-2 transition-all duration-200 hover:bg-[#F7D988] hover:shadow-sm"
                >
                  캘린더
                </Link>
                {resolvedIsAdmin && (
                  <span className="rounded-full border border-[#F7D988] px-4 py-2 text-sm font-semibold text-[#6B4E48]">
                    관리자
                  </span>
                )}
                <Link
                  href="/attendance"
                  className="rounded-full px-4 py-2 transition-all duration-200 hover:bg-[#F7D988] hover:shadow-sm"
                >
                  출석
                </Link>
                <Link
                  href="/mypage"
                  className="rounded-full px-4 py-2 transition-all duration-200 hover:bg-[#F7D988] hover:shadow-sm"
                >
                  마이페이지
                </Link>
              </>
            )}
          </nav>

          {/* Right (로그인 / 로그아웃) */}
          {!resolvedIsLogin ? (
            <Link
              href="/login"
              className="rounded-full border-2 border-[#F7D988] px-6 py-2 text-sm font-semibold text-[#6B4E48] transition-all hover:bg-[#F7D988]"
            >
              Login
            </Link>
          ) : (
            <Link
              href="/logout"
              className="rounded-full border-2 border-[#F7D988] px-6 py-2 text-sm font-semibold text-[#6B4E48] transition-all hover:bg-[#F7D988]"
            >
              로그아웃
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}