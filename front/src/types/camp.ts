// types/camp.ts (UNTOC CAMP 작품들)
export interface Project {
  id: number;
  term: string;         // "26-1"
  title: string;        // "역대급 언톡 홈페이지 제작"
  subject: string;      // "언톡 홈페이지"
  teamName: string;     // "웨베벱~"
  thumbnailUrl: string; // 카드 이미지
  leader: string;
  members: string[];
  notionLink?: string;  // 테이블에서 이동할 팀 노션
}