import Link from "next/link";
import { useState } from "react";
import Logo from "@/assets/images/언톡_스티커.webp"
import Image from "next/image";

type HeaderProps = {
  isLogin?: boolean;
};

export default function Header({ isLogin = false }: HeaderProps) {
  const [showUntoc, setShowUntoc] = useState(false);
  const [showCamp, setShowCamp] = useState(false);

  return (
    <header className="w-full border-b border-gray-200 bg-white">
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
          <nav className="flex items-center gap-6 text-[15px] font-medium text-[#6B4E48]">

            {!isLogin ? (
              <>
                {/* UNTOC */}
                <div
                  className="relative px-3 py-3"
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

                  {showUntoc && ( //여기 mt-3이 문제!!
                    <div className="absolute top-full left-0 w-36 overflow-hidden rounded-xl border border-[#6B4E48] bg-white shadow-lg">
                      <Link href="/untoc/about" className="block px-4 py-3 hover:bg-gray-100">
                        소개
                      </Link>

                      <Link href="/untoc/history" className="block px-4 py-3 hover:bg-gray-100">
                        연혁
                      </Link>

                      <Link href="/untoc/members" className="block px-4 py-3 hover:bg-gray-100">
                        구성원
                      </Link>
                    </div>
                  )}
                </div>

                {/* CAMP */}
                <div
                  className="relative px-3 py-3"
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
                    <div className="absolute top-full left-0 w-36 overflow-hidden rounded-xl border border-[#6B4E48] bg-white shadow-lg">
                      <Link href="/untoc-camp/about" className="block px-4 py-3 hover:bg-gray-100">
                        소개
                      </Link>

                      <Link href="/untoc-camp/projects" className="block px-4 py-3 hover:bg-gray-100">
                        역대 작품들
                      </Link>
                    </div>
                  )}
                </div>

                <Link
                  href="/gallery"
                  className="rounded-full px-4 py-2 transition-all duration-200 hover:bg-[#F7D988] hover:shadow-md"
                >
                  Gallery
                </Link>
              </>
            ) : (
              <>
                <Link href="/board/free">게시판</Link>
                <Link href="/calendar">캘린더</Link>
                <Link href="/attendance">출석</Link>
                <Link href="/mypage">마이페이지</Link>
              </>
            )}
          </nav>

          {/* Right */}
          {!isLogin ? (
            <Link
              href="/login"
              className="
    rounded-full
    border-2
    border-[#F7D988]
    px-6
    py-2
    text-sm
    font-semibold
    text-[#6B4E48]
    transition-all
    hover:bg-[#F7D988]
  "
>
              Login
            </Link>
          ) : (
            <button className="
    rounded-full
    border-2
    border-[#F7D988]
    px-6
    py-2
    text-sm
    font-semibold
    text-[#6B4E48]
    transition-all
    hover:bg-[#F7D988]
  "
>
              로그아웃
            </button>
          )}

        </div>

      </div>
    </header>
  );
}