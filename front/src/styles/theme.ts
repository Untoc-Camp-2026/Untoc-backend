export const theme = {
  colors: {
    primary: '#F7D988',       // 포인트 및 버튼 (따뜻한 노란색)
    background: '#FFFDF5',    // 웹페이지 전체 배경 (크림색)
    surface: '#FFFFFF',       // 카드, 모달, 게시글 박스 배경 (흰색)
    textMain: '#6B4E48',      // 기본 텍스트 (짙은 갈색)
    textLight: '#A3918D',     // 플레이스홀더, 비활성 텍스트
    border: '#E8E0D5',        // 연한 테두리 및 구분선
    danger: '#FF6B6B',        // 에러, 결석 등 경고 색상
  },
  borderRadius: {
    small: '8px',             // 얇은 입력창, 작은 라벨
    medium: '12px',           // 일반 버튼, 드롭다운 메뉴
    large: '24px',            // 역대 작품들 카드, 게시글 박스
    xlarge: '32px',           // 상세 팝업(모달) 창
    pill: '999px',            // 26-1 같은 기수 탭 버튼, 검색창
  }
} as const;

export type Theme = typeof theme;