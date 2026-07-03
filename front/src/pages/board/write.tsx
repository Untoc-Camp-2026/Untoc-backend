// front/src/pages/board/write.tsx
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { BoardCategory, BoardCategoryLabel } from '@/types/board';
import { createPost } from '@/api/board';

// 디자인 자산
import untocLogo from '@/assets/images/언톡_스티커.webp';
import fileIcon from '@/assets/images/chumboofile.png';

export default function BoardWrite() {
  const router = useRouter();
  const [category, setCategory] = useState<BoardCategory>('FREE');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPost({
        category,
        title,
        content,
        anonymous: isAnonymous,
      });
      alert('게시글이 등록되었습니다!');
      router.push('/board');
    } catch (error) {
      console.error('글쓰기 실패:', error);
      alert('게시글 등록에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#6B4E48] font-sans flex flex-col pb-20">
      <Head>
        <title>글쓰기 - UNTOC</title>
      </Head>

      {/* 글쓰기 본문 영역 */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold text-[#6B4E48] mb-8">글쓰기</h1>
        
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
            
            {/* 좌측: 파일 첨부 */}
            <button type="button" className="flex items-center gap-2 bg-[#FFFDF5] border border-[#F7D988] text-[#6B4E48] font-bold px-6 py-3 rounded-full hover:bg-[#F7D988] transition-colors">
              <Image src={fileIcon} alt="첨부파일" width={20} height={20} className="object-contain" />
              <span>파일 첨부</span>
            </button>
            
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
                className="px-8 py-3 rounded-full bg-[#F7D988] text-[#6B4E48] font-extrabold hover:bg-[#E5C77A] transition-colors shadow-sm"
              >
                완료
              </button>
            </div>
            
          </div>
        </form>
      </main>
    </div>
  );
}
