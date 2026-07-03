import React from 'react';
import { Project } from './ProjectCard'; // ProjectCard에서 정의한 타입 가져오기

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  // 선택된 프로젝트가 없으면 아무것도 그리지 않음 (렌더링 방지)
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* 어두운 배경 (클릭 시 닫힘) */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* 모달 콘텐츠 박스 */}
      <div className="relative bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* 왼쪽 썸네일 영역 */}
        <div className={`w-full md:w-1/3 aspect-[3/4] md:aspect-auto ${project.imageColor} relative`}>
            <div className="absolute top-4 right-4 bg-black/20 px-2 py-1 rounded text-xs font-bold text-white">
              {project.term}
            </div>
        </div>

        {/* 오른쪽 상세 정보 영역 */}
        <div className="flex-1 p-8">
          {/* 닫기 버튼 */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center bg-[#F5F1EB] text-[#CDA869] rounded-full hover:bg-[#E8DCC4] transition-colors"
          >
            ✕
          </button>

          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="w-1 h-5 bg-[#CDA869] inline-block rounded-full"></span>
            활동 설명
          </h2>
          
          <p className="text-sm text-gray-600 leading-relaxed mb-12 min-h-[100px]">
            {project.description}
          </p>

          {/* 하단 요약 정보 */}
          <div className="flex items-start gap-8 border-t border-gray-100 pt-6">
            <div>
              <div className="text-[10px] text-[#CDA869] font-bold mb-1 flex items-center gap-1">
                <span>📖</span> 주제
              </div>
              <div className="text-xs font-semibold text-gray-700">{project.topic}</div>
            </div>
            <div>
              <div className="text-[10px] text-[#CDA869] font-bold mb-1 flex items-center gap-1">
                <span>👤</span> 팀장
              </div>
              <div className="text-xs font-semibold text-gray-700">{project.leader}</div>
            </div>
            <div className="flex-1">
              <div className="text-[10px] text-[#CDA869] font-bold mb-1 flex items-center gap-1">
                <span>👥</span> 팀원
              </div>
              <div className="text-xs font-semibold text-gray-700 leading-tight">{project.members}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}