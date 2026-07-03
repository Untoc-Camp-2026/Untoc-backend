import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/images/언톡_스티커.webp";

export default function Footer() {
  return (
    <footer className="border-t border-[#FAEDBE] bg-[#E8E0D3]">
      <div className="mx-auto flex max-w-7xl flex-col items-center py-4">

        {/* Logo */}
        <Link href="/">
          <Image
            src={Logo}
            alt="UNTOC Logo"
            width={55}
            height={55}
            className="cursor-pointer"
          />
        </Link>

        {/* Title */}
        <h2 className="mt-1 text-base font-semibold text-[#6B4E48]">
          UNTOC
        </h2>

        {/* Description */}
        <p className="mt-1 text-center text-[12px] leading-5 text-gray-500">
          부산대학교 정보컴퓨터공학부 학술동아리
        </p>

        <p className="text-center text-[11px] text-gray-500">
          Chase Your Dreams. You can do anything with UNTOC!
        </p>

        {/* SNS */}
        <div className="mt-2 flex gap-6 text-xs text-[#6B4E48]">
          <a
            href="https://www.instagram.com/pnu_untoc/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#D9AE2B]"
          >
            Instagram
          </a>

          <a
            href="https://www.youtube.com/@untocpnu4499"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#D9AE2B]"
          >
            YouTube
          </a>
        </div>

        {/* Copyright */}
        <p className="mt-2 text-[10px] text-gray-400">
          © 2026 UNTOC. All rights reserved.
        </p>

      </div>
    </footer>
  );
}