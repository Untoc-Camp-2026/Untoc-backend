import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { BoardCategory, BoardCategoryLabel, Post } from '@/types/board';
import { getPosts } from '@/api/board';

// 분리한 도메인 종속 컴포넌트 불러오기
import PostItem from '@/components/board/PostItem';
import FloatingWriteBtn from '@/components/board/FloatingWriteBtn';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Pagination } from '@/components/common/Pagination';

export default function BoardList() {
  const router = useRouter();
  const [currentCategory, setCurrentCategory] = useState<BoardCategory>('FREE');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const postsPerPage = 10;
  const totalPages = Math.ceil(totalCount / postsPerPage) || 1;

  useEffect(() => {
    const queryCategory = router.query.category;
    if (typeof queryCategory !== 'string') return;

    const allowedCategories: BoardCategory[] = ['FREE', 'EXAM', 'STUDY', 'JOB', 'GAME'];
    if (allowedCategories.includes(queryCategory as BoardCategory)) {
      setCurrentCategory(queryCategory as BoardCategory);
      setCurrentPage(1);
    }
  }, [router.query.category]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setErrorMessage('');
      try {
        const response = await getPosts(currentCategory, currentPage, searchKeyword);
        setPosts(response.items || []);
        setTotalCount(response.total_count || 0);
      } catch (error) {
        console.error('게시글 로드 실패:', error);
        setPosts([]);
        setTotalCount(0);
        setErrorMessage(error instanceof Error ? error.message : '게시글을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [currentCategory, currentPage, searchKeyword]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearchKeyword(searchQuery.trim());
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#6B4E48] font-sans flex flex-col relative pb-24">
      <Head>
        <title>{BoardCategoryLabel[currentCategory]}게시판 - UNTOC</title>
      </Head>

      <Header />

      {/* 본문 컨텐츠 영역 */}
      <main className="flex-1 flex flex-col items-center w-full max-w-4xl mx-auto px-4 py-12 gap-6">
        
        {/* 타이틀 */}
        <div className="flex items-center gap-2 text-4xl font-extrabold text-[#6B4E48]">
          <h1>{BoardCategoryLabel[currentCategory]}게시판</h1>
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
          ) : errorMessage ? (
            <div className="bg-white rounded-2xl border border-[#F0C7C7] py-10 px-6 text-center text-[#B04A4A] font-bold shadow-sm">
              {errorMessage}
            </div>
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
        <Pagination
          currentPage={currentPage}
          totalPage={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>

      <FloatingWriteBtn />
      <Footer />
    </div>
  );
}