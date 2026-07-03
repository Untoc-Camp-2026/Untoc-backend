import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/images/언톡_스티커.webp";

export default function Footer() {
  return (
    <footer className="border-t border-[#FAEDBE] bg-[#E8E0D3]">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-8 py-10">

        {/* Logo */}
        <Link href="/">
          <Image
            src={Logo}
            alt="UNTOC Logo"
            width={70}
            height={70}
            className="cursor-pointer"
          />
        </Link>

        {/* Title */}
        <h2 className="mt-2 text-2xl font-bold text-[#6B4E48]">
          UNTOC
        </h2>

        {/* Description */}
        <p className="mt-2 text-center text-sm text-gray-500">
          부산대학교 정보컴퓨터공학부 학술동아리
          <br />
    
        </p>

        <p className="mt-2 text-center text-xs text-gray-500">
          Chase Your Dreams. 
          <br/>You can do anything with UNTOC!
        </p>


        {/* SNS */}
        <div className="mt-8 flex items-center gap-6 text-sm text-[#6B4E48]">

          <a
            href="https://www.instagram.com/pnu_untoc/" 
            target="_blank"
            rel="noreferrer"
            className="transition-colors duration-200 hover:text-[#D9AE2B]"
          >
            Instagram
          </a>


          <a
            href="https://www.youtube.com/@untocpnu4499"
            target="_blank"
            rel="noreferrer"
            className="transition-colors duration-200 hover:text-[#D9AE2B]"
          >
            youtube
          </a>

        </div>

        {/* Copyright */}
        <div className="mt-8 w-full pt-5 text-center text-xs text-gray-400">
          © 2026 UNTOC. All rights reserved.
        </div>

      </div>
    </footer>
  );
}