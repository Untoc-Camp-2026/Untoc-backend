src/
├── assets/                 # 이미지, 아이콘 등 정적 파일
│   └── images/
│       └── untoc_logo.svg  # 공통: 좌상단 언톡 아이콘
│
├── components/             # 재사용 가능한 UI 컴포넌트
│   ├── layout/             # 레이아웃 관련
│   │   ├── Header.tsx      # GNB (게스트/로그인 상태에 따라 분기 처리)
│   │   └── Footer.tsx
│   ├── common/             # 공통 UI 요소
│   │   ├── Button.tsx
│   │   ├── SearchBar.tsx
│   │   └── Pagination.tsx
│   ├── untoc-camp/         # UNTOC CAMP 도메인 종속 컴포넌트
│   │   ├── FilterTabs.tsx          # 26-1, 25-2 등 학기 필터 버튼
│   │   ├── ProjectCard.tsx         # 역대 작품들 썸네일 카드
│   │   └── ProjectDetailModal.tsx  # 작품 상세 팝업 (모달)
│   └── board/              # 게시판 도메인 종속 컴포넌트
│       ├── PostItem.tsx            # 게시글 박스
│       └── FloatingWriteBtn.tsx    # 우측 하단 플로팅 글쓰기 버튼
│
├── pages/                  # 실제 화면 페이지 (라우팅 구조와 1:1 매칭)
│   ├── index.tsx           # 게스트 메인 페이지 (/)
│   ├── main.tsx            # 로그인 메인 페이지 (/main 또는 대시보드)
│   │
│   ├── login/              # 로그인
│   │   └── index.tsx       
│   │
│   ├── untoc/              # UNTOC 탭
│   │   ├── about.tsx       
│   │   ├── history.tsx     
│   │   └── members.tsx     
│   │
│   ├── untoc-camp/         # UNTOC CAMP 탭
│   │   ├── about.tsx       
│   │   └── projects.tsx    
│   │
│   ├── gallery/            # 갤러리 탭
│   │   └── index.tsx       
│   │
│   ├── board/              # 게시판 탭
│   │   ├── [category].tsx  # OO게시판 페이지 (동적 라우팅: 자유, 시험 등)
│   │   └── write.tsx       # 글쓰기 페이지
│   │
│   ├── calendar/           # 캘린더 탭
│   │   └── index.tsx       
│   │
│   ├── attendance/         # 출석 탭
│   │   └── index.tsx       
│   │
│   └── mypage/             # 마이페이지 탭
│       └── index.tsx       
│
├── types/                  # 💡 [TS 전용] 인터페이스 및 타입 정의 폴더
│   ├── user.ts             # 유저 정보 타입 (User, LoginResponse 등)
│   ├── board.ts            # 게시글 관련 타입 (Post, Comment 등)
│   └── camp.ts             # UNTOC CAMP 프로젝트 타입 (Project, Team 등)
│
├── styles/                 # 글로벌 스타일 및 테마
│   └── theme.ts            # #FFFFFF, #F7D988, #6B4E48 등 지정 (TS 파일로 관리 권장)
│
└── utils/                  # 공통 유틸 함수
    ├── api.ts              # API 호출 모듈 (Axios 인스턴스 등)
    └── formatters.ts       # 날짜 포맷팅 등