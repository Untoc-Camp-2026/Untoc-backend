import React from 'react';

// 프로젝트 데이터의 타입 정의
export interface Project {
  id: number;
  term: string;
  title: string;
  subtitle: string;
  imgUrl: string;
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
  const isColorPlaceholder = project.imgUrl.startsWith('#');

  return (
    <div
      className="group cursor-pointer bg-white rounded-[1.5rem] overflow-hidden shadow-sm border border-gray-50 flex flex-col h-full transition-transform duration-200 hover:-translate-y-1 hover:shadow-md"
      onClick={onClick}
    >
      {/* 썸네일 이미지 영역 */}
      <div className="w-full aspect-[4/5] relative bg-gray-100">
        {/* 우측 상단 기수 뱃지 */}
        <div className="absolute top-4 right-4 bg-[#FAF8F5] px-3 py-1 rounded-full text-[11px] font-extrabold text-gray-700 shadow-sm z-10">
          {project.term}
        </div>

        {/* 실제 이미지 */}
        {isColorPlaceholder ? (
          <div className="w-full h-full" style={{ backgroundColor: project.imgUrl }} />
        ) : (
          <img
            src={project.imgUrl}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* 텍스트 정보 영역 */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-extrabold text-xl text-[#6B4E48] mb-1.5">
          {project.title}
        </h3>
        <p className="text-sm font-semibold text-[#9C7B75]">
          {project.subtitle}
        </p>
      </div>
    </div>
  );
}