import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { getPostDetail, deletePost, createComment, updateComment, deleteComment } from '@/api/board';
import { BoardCategoryLabel } from '@/types/board';
import type { PostDetail } from '@/types/board';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { resolveMediaUrl } from '@/utils/media';

// 1. 컴포넌트 상단 쯤에 이미지 확장자를 판별하는 정규식을 선언 (혹은 utils 함수로 분리)
const isImageFile = (url: string) => {
  return /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(url);
};

export default function PostDetail() {
  const router = useRouter();
  const auth = useAuth();
  const { id } = router.query;
  
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const boardId = Number(id);
  
  // 댓글 입력 상태
  const [commentInput, setCommentInput] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  const canManagePost = Boolean(post && (post.is_owner || auth.isAdmin));
  const canManageComment = (commentOwner: boolean) => commentOwner || auth.isAdmin;

  const refreshPostDetail = async () => {
    if (Number.isNaN(boardId)) return;
    const latest = await getPostDetail(boardId);
    setPost(latest);
  };

  useEffect(() => {
    if (!id || Number.isNaN(boardId)) return;

    const fetchDetail = async () => {
      setLoading(true);
      setErrorMessage('');
      try {
        await refreshPostDetail();
      } catch (error) {
        console.error('상세 정보 로드 실패:', error);
        setPost(null);
        setErrorMessage(
          error instanceof Error ? error.message : '게시글을 불러오지 못했습니다.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, boardId]);

  // 게시글 삭제
  const handleDeletePost = async () => {
    if (!confirm('정말 이 게시글을 삭제하시겠습니까?')) return;
    try {
      await deletePost(boardId);
      alert('게시글이 삭제되었습니다.');
      router.push('/board'); // 목록으로 이동
    } catch (error) {
      alert('게시글 삭제에 실패했습니다.');
    }
  };

  // 댓글 등록
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.isLoggedIn) {
      alert('댓글 작성은 로그인 후 이용할 수 있습니다.');
      router.push('/login');
      return;
    }
    if (!commentInput.trim() || !post) return;

    try {
      await createComment(boardId, commentInput.trim(), isAnonymous);
      await refreshPostDetail();
      alert('댓글이 등록되었습니다.');
      setCommentInput(''); // 입력창 초기화
    } catch (error) {
      alert('댓글 등록 실패');
    }
  };

  // 댓글 수정 시작
  const handleEditStart = (commentId: number, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditContent(currentContent);
  };

  // 댓글 수정 취소
  const handleEditCancel = () => {
    setEditingCommentId(null);
    setEditContent('');
  };

  // 댓글 수정 완료
  const handleEditComplete = async (commentId: number, anonymous: boolean) => {
    if (!editContent.trim()) return;

    try {
      await updateComment(commentId, editContent.trim(), anonymous);
      await refreshPostDetail();
      handleEditCancel();
      alert('댓글이 수정되었습니다.');
    } catch (error) {
      alert('댓글 수정 실패');
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return;
    try {
      await deleteComment(commentId);
      await refreshPostDetail();
      if (editingCommentId === commentId) {
        handleEditCancel();
      }
      alert('댓글이 삭제되었습니다.');
    } catch (error) {
      alert('댓글 삭제 실패');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 text-center text-[#A3918D] font-bold">로딩 중...</div>
    );
  }

  if (errorMessage || !post) {
    return (
      <div className="flex min-h-screen flex-col bg-[#FFFDF5]">
        <Header />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
          <p className="text-lg font-bold text-[#B04A4A]">
            {errorMessage || '게시글을 찾을 수 없습니다.'}
          </p>
          {!auth.isLoggedIn && (
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="rounded-full bg-[#F7D988] px-6 py-2 font-bold text-[#6B4E48]"
            >
              로그인하기
            </button>
          )}
          <Link href="/board" className="text-sm font-bold text-[#6B4E48] underline">
            게시판으로 돌아가기
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FFFDF5]">
      <Header />
      <div className="w-full max-w-4xl mx-auto px-4 py-12 flex flex-col gap-8 pb-24 flex-1">
      <Head>
        <title>{post.title} - UNTOC</title>
      </Head>

      {/* 1. 게시글 본문 영역 */}
      <article className="bg-white rounded-[24px] border border-[#E8E0D5] p-8 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E8E0D5] pb-4 mb-6">
          <div>
            <span className="text-sm font-bold text-[#A3918D] mb-1 block">
              {BoardCategoryLabel[post.category as keyof typeof BoardCategoryLabel]}게시판
            </span>
            <h1 className="text-3xl font-extrabold text-[#6B4E48]">{post.title}</h1>
          </div>
          <div className="text-right">
            <div className="text-[#6B4E48] font-bold mb-2">
              {post.anonymous ? "익명" : post.user_id}
            </div>
            {/* 게시글 본인(또는 관리자)일 경우 수정/삭제 버튼 노출 */}
            {canManagePost && (
              <div className="flex gap-2 text-sm font-bold">
                <button 
                  onClick={() => router.push(`/board/write?id=${post.board_id}`)}
                  className="px-3 py-1.5 bg-[#E8E0D5] text-[#6B4E48] rounded-[8px] hover:bg-[#D1C9BC] transition-colors"
                >
                  수정
                </button>
                <button 
                  onClick={handleDeletePost}
                  className="px-3 py-1.5 bg-[#E53E3E] text-white rounded-[8px] hover:bg-[#C53030] transition-colors"
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* 본문 내용 */}
        <div className="min-h-[200px] text-[#6B4E48] font-medium leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>

        {post.file_url && (
          <div className="mt-6 border-t border-[#E8E0D5] pt-4">
            
            {/* 파일이 이미지인 경우 화면에 렌더링 */}
            {isImageFile(post.file_url) && (
              <div className="mb-6">
                <img 
                  src={resolveMediaUrl(post.file_url)} 
                  alt="첨부 이미지" 
                  className="max-w-full rounded-[12px] border border-[#E8E0D5]"
                />
              </div>
            )}
            
            <a
              href={resolveMediaUrl(post.file_url)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#F7D988] bg-[#FFFDF5] px-4 py-2 text-sm font-bold text-[#6B4E48] hover:bg-[#F7D988]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              첨부파일 다운로드
            </a>
          </div>
        )}
      </article>

      {/* 2. 댓글 영역 (올려주신 이미지 시안 100% 반영) */}
      <section className="flex flex-col gap-4">
        
        {/* 댓글 입력창 */}
        {auth.isLoggedIn ? (
          <form 
            onSubmit={handleCommentSubmit}
            className="bg-white rounded-[20px] border border-[#E8E0D5] p-3 pl-6 flex items-center justify-between shadow-sm"
          >
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="댓글을 입력하세요"
              className="flex-1 outline-none text-[#6B4E48] font-bold placeholder:text-[#A3918D] bg-transparent"
            />
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 text-xs font-bold text-[#8C8279]">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="accent-[#6B4E48]"
                />
                익명
              </label>
              <button 
                type="submit"
                className="px-6 py-2.5 bg-[#F7D988] text-[#6B4E48] font-extrabold rounded-[12px] hover:bg-[#E5C77A] transition-colors"
              >
                등록
              </button>
              <button 
                type="button"
                onClick={() => setCommentInput('')}
                className="px-6 py-2.5 bg-white border border-[#E8E0D5] text-[#A3918D] font-extrabold rounded-[12px] hover:bg-[#FFFDF5] transition-colors"
              >
                취소
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-white rounded-[20px] border border-[#E8E0D5] p-6 text-center shadow-sm">
            <p className="text-[#8C8279] font-bold">댓글 작성은 로그인 후 이용할 수 있습니다.</p>
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="mt-3 rounded-full bg-[#F7D988] px-5 py-2 text-sm font-bold text-[#6B4E48]"
            >
              로그인하기
            </button>
          </div>
        )}

        {/* 댓글 목록 리스트 */}
        {post.comments?.map((comment) => (
          <div 
            key={comment.comment_id} 
            className="bg-white rounded-[20px] border border-[#E8E0D5] p-4 px-6 flex items-center justify-between shadow-sm"
          >
            {/* 좌측: 익명 프로필 원 + 댓글 내용 */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-10 h-10 shrink-0 flex items-center justify-center bg-[#FFF9E6] rounded-full text-[#6B4E48] font-extrabold text-sm">
                {comment.user_id}
              </div>
              {editingCommentId === comment.comment_id ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 rounded-[10px] border border-[#E8E0D5] outline-none focus:border-[#F7D988] text-[#3A2E2B] font-bold resize-none"
                />
              ) : (
                <span className="font-extrabold text-[#3A2E2B] break-words">
                  {comment.content}
                </span>
              )}
            </div>

            {/* 우측: 내 댓글일 경우에만 수정/삭제 버튼 표시 */}
            {canManageComment(comment.is_owner) && (
              <div className="flex items-center gap-2">
                {editingCommentId === comment.comment_id ? (
                  <>
                    <button 
                      onClick={handleEditCancel}
                      className="px-5 py-2 bg-white border border-[#E8E0D5] text-[#A3918D] font-extrabold rounded-[12px] hover:bg-[#FFFDF5] transition-colors"
                    >
                      취소
                    </button>
                    <button 
                      onClick={() => handleEditComplete(comment.comment_id, comment.anonymous)}
                      className="px-5 py-2 bg-[#F7D988] text-[#6B4E48] font-extrabold rounded-[12px] hover:bg-[#E5C77A] transition-colors"
                    >
                      완료
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => handleEditStart(comment.comment_id, comment.content)}
                      className="px-5 py-2 bg-[#E8E0D5] text-[#6B4E48] font-extrabold rounded-[12px] hover:bg-[#D1C9BC] transition-colors"
                    >
                      수정
                    </button>
                    <button 
                      onClick={() => handleDeleteComment(comment.comment_id)}
                      className="px-5 py-2 bg-[#E53E3E] text-white font-extrabold rounded-[12px] hover:bg-[#C53030] transition-colors"
                    >
                      삭제
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
        
      </section>
      </div>
      <Footer />
    </div>
  );
}