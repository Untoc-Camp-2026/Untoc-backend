// front/src/components/board/PostItem.tsx
import Link from 'next/link';
import { Post } from '@/types/board';

interface PostItemProps {
  post: Post;
}

export default function PostItem({ post }: PostItemProps) {
  return (
    <Link 
      href={`/board/${post.board_id}`}
      className="flex items-center justify-between w-full h-16 px-6 bg-white rounded-full border border-[#E8E0D5] shadow-sm hover:shadow hover:border-[#F7D988] transition-all"
    >
      {/* 좌측: 원형 인덱스 넘버 + 제목 + 익명 태그 */}
      <div className="flex items-center gap-4 overflow-hidden">
        {/* 시안의 연갈색 원형 번호판 */}
        <div className="w-8 h-8 shrink-0 flex items-center justify-center bg-[#C4B29D] rounded-full text-white font-bold text-sm">
          {post.board_id}
        </div>
        
        {/* 게시글 제목 */}
        <span className="font-bold text-[#3A2E2B] truncate">
          {post.title}
        </span>
        
        {/* 익명일 경우 태그 노출 */}
        {post.anonymous && (
          <span className="shrink-0 text-[11px] bg-[#8C8279] text-white px-2 py-0.5 rounded-full font-medium">
            익명
          </span>
        )}
      </div>
      
      {/* 우측: 작성자 정보 (시안의 구분선 스타일 반영) */}
      <div className="shrink-0 text-[#8C8279] text-xs font-bold flex items-center gap-2">
        <span>작성자</span>
        <span className="text-[#E8E0D5]">|</span>
        <span className="text-[#6B4E48] truncate max-w-[100px]">{post.user_id}</span>
      </div>
    </Link>
  );
}