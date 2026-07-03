// front/src/pages/board/index.tsx
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { BoardCategory, Post } from '@/types/board';
import { getPosts } from '@/api/board';

// 분리한 도메인 종속 컴포넌트 불러오기
import PostItem from '@/components/board/PostItem';
import FloatingWriteBtn from '@/components/board/FloatingWriteBtn';

// 로고 이미지 자산
import untocLogo from '@/assets/images/언톡_스티커.webp';

export default function BoardList() {
  const [currentCategory, setCurrentCategory] = useState<BoardCategory>('FREE');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const postsPerPage = 10;
  const totalPages = Math.ceil(totalCount / postsPerPage) || 1;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await getPosts(currentCategory, currentPage);
        if (response && response.items) {
          setPosts(response.items);
          setTotalCount(response.total_count || 0);
        } else if (Array.isArray(response)) {
          setPosts(response);
          setTotalCount(response.length);
        }
      } catch (error) {
        console.error('게시글 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [currentCategory, currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('검색어 제출:', searchQuery);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#6B4E48] font-sans flex flex-col relative pb-24">
      <Head>
        <title>자유게시판 - UNTOC</title>
      </Head>

      {/* 상단 GNB */}
      <header className="w-full h-20 flex items-center justify-between px-8 md:px-16 bg-white border-b border-[#E8E0D5]">
        <Link href="/" className="flex items-center gap-3">
          <Image src={untocLogo} alt="UNTOC 로고" width={45} height={45} className="object-contain" />
          <span className="text-xl font-extrabold tracking-widest text-[#6B4E48]">UNTOC</span>
        </Link>

        <nav className="flex items-center gap-8 font-bold text-base">
          <Link href="/board" className="text-[#6B4E48] border-b-2 border-[#6B4E48] pb-1">
            게시판
          </Link>
          <Link href="/calendar" className="text-[#A3918D] hover:text-[#6B4E48] transition-colors">
            캘린더
          </Link>
          <Link href="/attendance" className="text-[#A3918D] hover:text-[#6B4E48] transition-colors">
            출석
          </Link>
          <Link href="/mypage" className="text-[#A3918D] hover:text-[#6B4E48] transition-colors">
            마이페이지
          </Link>
          <span className="text-[#E8E0D5]">|</span>
          <Link href="/logout" className="text-[#6B4E48] hover:text-black flex items-center gap-1">
            <span>[→ 로그아웃</span>
          </Link>
        </nav>
      </header>

      {/* 본문 컨텐츠 영역 */}
      <main className="flex-1 flex flex-col items-center w-full max-w-4xl mx-auto px-4 py-12 gap-6">
        
        {/* 타이틀 */}
        <div className="flex items-center gap-2 text-4xl font-extrabold text-[#6B4E48]">
          <h1>자유게시판</h1>
          <span className="text-3xl">💬</span>
        </div>

        {/* 검색바 */}
        <form onSubmit={handleSearch} className="relative w-full max-w-3xl mt-2">
          <input
            type="text"
            placeholder="검색어를 입력하세요..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 pl-6 pr-16 rounded-full bg-white border border-[#E8E0D5] outline-none shadow-inner text-[#6B4E48] placeholder:text-[#D1C9BC]"
          />
          <button 
            type="submit"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#3A2E2B] hover:bg-black rounded-full flex items-center justify-center transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="white" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>
        </form>

        {/* 게시글 목록 카드 리스트 (분리한 PostItem 적용) */}
        <div className="w-full max-w-3xl flex flex-col gap-3.5 mt-4">
          {loading ? (
            <div className="text-center py-20 text-[#A3918D] font-bold">로딩 중...</div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-full border border-[#E8E0D5] py-10 text-center text-[#A3918D] font-bold shadow-sm">
              등록된 게시물이 없습니다.
            </div>
          ) : (
            posts.map((post) => (
              <PostItem key={post.board_id} post={post} />
            ))
          )}
        </div>

        {/* 하단 제어 페이지네이션 */}
        <div className="flex items-center gap-2 mt-8">
          <button 
            type="button"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`w-10 h-10 flex items-center justify-center rounded-full bg-white border border-[#E8E0D5] text-[#6B4E48] font-bold shadow-sm transition-colors ${
              currentPage === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#F7D988]'
            }`}
          >
            &lt;
          </button>
          
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all shadow-sm ${
                currentPage === i + 1 
                  ? 'bg-[#2A2421] text-white' 
                  : 'bg-white border border-[#E8E0D5] text-[#6B4E48] hover:bg-[#F7D988]'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button 
            type="button"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`w-10 h-10 flex items-center justify-center rounded-full bg-white border border-[#E8E0D5] text-[#6B4E48] font-bold transition-colors ${
              currentPage === totalPages ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#F7D988]'
            }`}
          >
            &gt;
          </button>
        </div>
      </main>

      {/* 우측 하단 플로팅 글쓰기 버튼 컴포넌트 적용 */}
      <FloatingWriteBtn />
    </div>
  );
}