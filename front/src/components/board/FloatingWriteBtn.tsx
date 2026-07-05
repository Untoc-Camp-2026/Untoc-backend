import Link from 'next/link';
import Image from 'next/image';
import writeBtnIcon from '@/assets/images/writeBTN.png';

export default function FloatingWriteBtn() {
  return (
    <Link 
      href="/board/write" 
      className="fixed bottom-10 right-10 w-20 h-20 rounded-full overflow-hidden hover:scale-105 transition-transform z-50 block"
    >
      <Image 
        src={writeBtnIcon} 
        alt="글쓰기 버튼" 
        fill
        sizes="80px"
        priority
        className="object-cover w-full h-full"
      />
    </Link>
  );
}