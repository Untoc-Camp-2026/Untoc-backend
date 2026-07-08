import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { BoardCategory, BoardCategoryLabel } from '@/types/board';
import { createPost, getPostDetail, updatePost } from '@/api/board';
import { useAuth } from '@/contexts/AuthContext';
import BoardFileAttachment from '@/components/board/BoardFileAttachment';

export default function BoardWrite() {
  const router = useRouter();
  const auth = useAuth();
  const rawId = router.query.id;

  useEffect(() => {
    if (auth.isHydrated && !auth.isLoggedIn) {
      router.replace('/login');
      alert('글쓰기는 로그인 후 이용할 수 있습니다.');
    }
  }, [auth.isHydrated, auth.isLoggedIn, router]);

  const boardId = useMemo(() => {
    if (typeof rawId !== 'string') return null;
    const parsed = Number(rawId);
    return Number.isNaN(parsed) ? null : parsed;
  }, [rawId]);

  const isEditMode = boardId !== null;

  const [category, setCategory] = useState<BoardCategory>('FREE');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);

  useEffect(() => {
    if (!isEditMode || boardId === null) return;

    const fetchPost = async () => {
      setLoadingPost(true);
      try {
        const post = await getPostDetail(boardId);
        setCategory(post.category);
        setTitle(post.title);
        setContent(post.content);
        setIsAnonymous(post.anonymous);
        setFileUrl(post.file_url || null);
        setFileName(post.file_url ? post.file_url.split('/').pop() || '첨부파일' : null);
      } catch (error) {
        console.error('게시글 수정 데이터 로드 실패:', error);
        alert('수정할 게시글 정보를 불러오지 못했습니다.');
        router.push('/board');
      } finally {
        setLoadingPost(false);
      }
    };

    fetchPost();
  }, [isEditMode, boardId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (submitting || loadingPost) return;

    setSubmitting(true);
    try {
      if (isEditMode && boardId !== null) {
        await updatePost(boardId, {
          category,
          title,
          content,
          anonymous: isAnonymous,
          file_url: fileUrl || undefined,
        });
        alert('게시글이 수정되었습니다!');
      } else {
        await createPost({
          category,
          title,
          content,
          anonymous: isAnonymous,
          file_url: fileUrl || undefined,
        });
        alert('게시글이 등록되었습니다!');
      }
      router.push('/board');
    } catch (error) {
      console.error('글 저장 실패:', error);
      alert(isEditMode ? '게시글 수정에 실패했습니다.' : '게시글 등록에 실패했습니다. 로그인 상태를 확인해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!auth.isHydrated || !auth.isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#6B4E48] font-sans flex flex-col pb-20">
      <Head>
        <title>{isEditMode ? '작성글 수정' : '글쓰기'} - UNTOC</title>
      </Head>

      {/* 글쓰기 본문 영역 */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold text-[#6B4E48] mb-8">{isEditMode ? '작성글 수정' : '글쓰기'}</h1>

        {loadingPost && (
          <div className="mb-6 rounded-[12px] border border-[#E8E0D5] bg-white px-4 py-3 text-[#8C8279] font-bold">
            게시글 정보를 불러오는 중입니다...
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="bg-white rounded-[24px] border border-[#E8E0D5] p-8 shadow-sm flex flex-col gap-6">
          
          {/* 상단: 카테고리 + 제목 */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-32 relative">
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value as BoardCategory)}
                className="w-full h-14 pl-4 pr-10 rounded-[12px] border border-[#E8E0D5] text-[#6B4E48] font-bold outline-none focus:border-[#F7D988] appearance-none bg-white cursor-pointer shadow-sm"
              >
                {(Object.keys(BoardCategoryLabel) as BoardCategory[]).map((key) => (
                  <option key={key} value={key}>{BoardCategoryLabel[key]}</option>
                ))}
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A3918D] pointer-events-none text-xs">▼</span>
            </div>
            
            <input 
              type="text" 
              placeholder="제목을 입력하세요" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="flex-1 h-14 px-5 rounded-[12px] border border-[#E8E0D5] outline-none focus:border-[#F7D988] transition-colors placeholder:text-[#D1C9BC] font-bold text-[#6B4E48] shadow-sm"
            />
          </div>

          {/* 중단: 내용 입력 */}
          <textarea 
            placeholder="내용을 입력하세요..." 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full h-[400px] p-5 rounded-[12px] border border-[#E8E0D5] outline-none focus:border-[#F7D988] transition-colors placeholder:text-[#D1C9BC] text-[#6B4E48] font-medium resize-none shadow-sm"
          />

          {/* 하단: 컨트롤 버튼 바 */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
            
            <BoardFileAttachment
              fileUrl={fileUrl}
              fileName={fileName}
              onChange={(nextUrl, nextName) => {
                setFileUrl(nextUrl);
                setFileName(nextName);
              }}
              disabled={submitting || loadingPost}
            />
            
            {/* 우측: 익명, 취소, 완료 */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-[#8C8279] font-bold">
                <input 
                  type="checkbox" 
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 accent-[#6B4E48] cursor-pointer"
                />
                익명
              </label>
              
              <button 
                type="button" 
                onClick={() => router.back()}
                className="px-8 py-3 rounded-full border border-[#E8E0D5] text-[#A3918D] font-bold hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              
              <button 
                type="submit" 
                disabled={submitting || loadingPost}
                className="px-8 py-3 rounded-full bg-[#F7D988] text-[#6B4E48] font-extrabold hover:bg-[#E5C77A] transition-colors shadow-sm"
              >
                {submitting ? (isEditMode ? '수정 중...' : '등록 중...') : '완료'}
              </button>
            </div>
            
          </div>
        </form>
      </main>
    </div>
  );
}
