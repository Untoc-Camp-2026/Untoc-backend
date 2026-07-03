// front/src/pages/board/[id].tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { getPostDetail, deletePost, createComment, deleteComment } from '@/api/board';
import { BoardCategoryLabel } from '@/types/board';

export default function PostDetail() {
  const router = useRouter();
  const { id } = router.query;
  
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // 댓글 입력 상태
  const [commentInput, setCommentInput] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await getPostDetail(Number(id));
        setPost(data);
      } catch (error) {
        console.error('상세 정보 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  // 게시글 삭제
  const handleDeletePost = async () => {
    if (!confirm('정말 이 게시글을 삭제하시겠습니까?')) return;
    try {
      await deletePost(Number(id));
      alert('게시글이 삭제되었습니다.');
      router.push('/board'); // 목록으로 이동
    } catch (error) {
      alert('게시글 삭제에 실패했습니다.');
    }
  };

  // 댓글 등록
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    try {
      await createComment(Number(id), commentInput, isAnonymous);
      alert('댓글이 등록되었습니다. (더미)');
      setCommentInput(''); // 입력창 초기화
      // 실제로는 여기서 getPostDetail을 다시 호출하여 댓글 목록을 갱신합니다.
    } catch (error) {
      alert('댓글 등록 실패');
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return;
    try {
      await deleteComment(commentId);
      alert('댓글이 삭제되었습니다. (더미)');
    } catch (error) {
      alert('댓글 삭제 실패');
    }
  };

  if (loading || !post) {
    return <div className="min-h-screen pt-32 text-center text-[#A3918D] font-bold">로딩 중...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 flex flex-col gap-8 pb-24">
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
            {post.is_owner && (
              <div className="flex gap-2 text-sm font-bold">
                <button 
                  onClick={() => alert('수정 페이지로 이동 (예: /board/write?id=' + id + ')')}
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
      </article>

      {/* 2. 댓글 영역 (올려주신 이미지 시안 100% 반영) */}
      <section className="flex flex-col gap-4">
        
        {/* 댓글 입력창 */}
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

        {/* 댓글 목록 리스트 */}
        {post.comments?.map((comment: any) => (
          <div 
            key={comment.comment_id} 
            className="bg-white rounded-[20px] border border-[#E8E0D5] p-4 px-6 flex items-center justify-between shadow-sm"
          >
            {/* 좌측: 익명 프로필 원 + 댓글 내용 */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 shrink-0 flex items-center justify-center bg-[#FFF9E6] rounded-full text-[#6B4E48] font-extrabold text-sm">
                {comment.user_id}
              </div>
              <span className="font-extrabold text-[#3A2E2B]">
                {comment.content}
              </span>
            </div>

            {/* 우측: 내 댓글일 경우에만 수정/삭제 버튼 표시 */}
            {comment.is_owner && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => alert('댓글 수정 기능 (구현 예정)')}
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
              </div>
            )}
          </div>
        ))}
        
      </section>
    </div>
  );
}