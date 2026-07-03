// front/src/pages/board/index.tsx
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { BoardCategory, Post } from '@/types/board';
import { getPosts } from '@/api/board';

import PostItem from '@/components/board/PostItem';
import FloatingWriteBtn from '@/components/board/FloatingWriteBtn';

// 💡 프로의 팁: 카테고리별 렌더링 정보를 객체(Dictionary)로 분리하여 관리
const CATEGORY_INFO: Record<BoardCategory, { label: string; emoji: string }> = {
  FREE: { label: '자유게시판', emoji: '💬' },
  EXAM: { label: '시험게시판', emoji: '📝' },
  STUDY: { label: '스터디게시판', emoji: '📚' },
  JOB: { label: '취업게시판', emoji: '💼' },
  GAME: { label: '게임게시판', emoji: '🎮' },
};

export default function BoardList() {
  const router = useRouter();
  
  const [currentCategory, setCurrentCategory] = useState<BoardCategory>('FREE');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const postsPerPage = 10;
  const totalPages = Math.ceil(totalCount / postsPerPage) || 1;

  // 1. 라우터에서 카테고리를 감지하여 상태 업데이트
  useEffect(() => {
    if (router.isReady) {
      const queryCategory = router.query.category as BoardCategory;
      if (queryCategory && CATEGORY_INFO[queryCategory]) {
        setCurrentCategory(queryCategory);
        setCurrentPage(1); // 카테고리가 바뀌면 1페이지로 초기화
      }
    }
  }, [router.isReady, router.query.category]);

  // 2. 카테고리 변경 시 데이터 패칭
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

  // 현재 화면에 띄울 라벨과 이모지 추출
  const { label, emoji } = CATEGORY_INFO[currentCategory];

  return (
    <div className="w-full flex flex-col relative pb-24">
      <Head>
        <title>{label} - UNTOC</title>
      </Head>

      <main className="flex-1 flex flex-col items-center w-full max-w-4xl mx-auto px-4 py-12 gap-6">
        
        {/* 💡 동적 타이틀 렌더링 (클릭한 메뉴에 맞게 이모지와 텍스트 변경) */}
        <div className="flex items-center gap-3 text-4xl font-extrabold text-[#6B4E48]">
          <span className="text-3xl">{emoji}</span>
          <h1>{label}</h1>
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

        {/* 게시글 목록 카드 리스트 */}
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