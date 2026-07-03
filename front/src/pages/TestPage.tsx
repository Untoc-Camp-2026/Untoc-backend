// pages/TestPage.tsx
import { useState } from 'react';
import { Pagination } from '../components/common/Pagination';
import { WriteButton } from '../components/common/WriteButton';
import { SearchBar } from '../components/common/SearchBar'; // 검색창 불러오기

export default function TestPage() {
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState(''); // 검색어 상태 관리

  return (
    <div style={{ padding: '40px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      
      <h2>검색창 테스트</h2>
      <div style={{ marginBottom: '40px' }}>
        {/* 방금 만든 검색창 */}
        <SearchBar 
          value={searchText} 
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={() => alert(`'${searchText}' 검색 실행!`)}
        />
      </div>

      <h2>글쓰기 버튼 테스트</h2>
      <div style={{ marginBottom: '40px' }}>
        <WriteButton onClick={() => alert('글쓰기 버튼 클릭됨!')} />
      </div>

      <h2>페이지네이션 테스트</h2>
      <Pagination
        currentPage={page}
        totalPage={5}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
}