import React from 'react';

// 프로젝트 데이터의 타입 정의 (다른 컴포넌트에서도 재사용)
export interface Project {
  id: number;
  term: string;
  title: string;
  subtitle: string;
  imageColor: string;
  topic: string;
  leader: string;
  members: string;
  description: string;
}

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <div className="group cursor-pointer" onClick={onClick}>
      {/* 썸네일 이미지 박스 */}
      <div className={`w-full aspect-[3/4] ${project.imageColor} rounded-2xl mb-4 relative overflow-hidden transition-transform group-hover:-translate-y-1 group-hover:shadow-md`}>
        <div className="absolute top-3 right-3 bg-white/50 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-gray-700">
          {project.term}
        </div>
        <div className="w-full h-full flex items-center justify-center text-white/50">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </div>
      </div>
      
      {/* 텍스트 정보 */}
      <h3 className="font-bold text-lg text-gray-800">{project.title}</h3>
      <p className="text-xs text-gray-500 mb-2">{project.subtitle}</p>
    </div>
  );
}