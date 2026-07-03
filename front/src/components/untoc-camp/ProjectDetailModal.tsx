import React from 'react';
import { Project } from './ProjectCard';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectDetailModal({
  project,
  onClose,
}: ProjectDetailModalProps) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* 어두운 배경 (클릭 시 닫힘) */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* 💡 1. 모달 전체 콘텐츠 박스 */}
      <div className="relative bg-white rounded-[2rem] w-full max-w-4xl p-8 shadow-2xl flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center bg-[#FDF8EB] text-[#CDA869] rounded-full hover:bg-[#F5EEDC] transition-colors font-bold text-sm z-20"
        >
          ✕
        </button>

        {/* 💡 2. 상단 영역 (이미지 + 활동 설명 텍스트) */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* 상단-왼쪽: 썸네일 이미지 영역 */}
          <div className="w-full md:w-[280px] shrink-0 aspect-[4/5] rounded-2xl relative overflow-hidden shadow-sm bg-gray-100">
            <img
              src={project.imgUrl}
              alt={project.title}
              className="w-full h-full object-cover"
            />

            <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-extrabold text-gray-700 shadow-sm z-10">
              {project.term}
            </div>
          </div>

          {/* 상단-오른쪽: 상세 정보 영역 */}
          <div className="flex-1 flex flex-col pt-2 md:pr-8">
            <h2 className="text-xl font-extrabold text-gray-800 mb-6 flex items-center gap-2.5">
              <span className="w-1.5 h-5 bg-[#F7D988] inline-block rounded-full"></span>
              활동 설명
            </h2>

            <p className="text-sm text-gray-500 leading-loose flex-1">
              {project.description}
            </p>
          </div>
        </div>

        {/* 💡 3. 하단 영역 (가로 구분선 + 요약 정보들) */}
        <div className="flex flex-col md:flex-row gap-8 border-t border-gray-100 pt-6 mt-8">
          {/* 하단-왼쪽: 주제 */}
          <div className="w-full md:w-[280px] shrink-0 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FDF8EB] flex items-center justify-center text-[13px]">
              📖
            </div>

            <div>
              <div className="text-[10px] text-gray-400 font-bold mb-0.5">
                주제
              </div>
              <div className="text-xs font-extrabold text-gray-800">
                {project.topic}
              </div>
            </div>
          </div>

          {/* 하단-오른쪽: 팀장, 팀원 */}
          <div className="flex-1 flex flex-col sm:flex-row gap-6 sm:gap-10 md:pr-8">
            <div className="flex gap-3 items-center shrink-0">
              <div className="w-8 h-8 rounded-full bg-[#FDF8EB] flex items-center justify-center text-[13px]">
                👤
              </div>

              <div>
                <div className="text-[10px] text-gray-400 font-bold mb-0.5">
                  팀장
                </div>
                <div className="text-xs font-extrabold text-gray-800">
                  {project.leader}
                </div>
              </div>
            </div>

            <div className="flex gap-3 items-center flex-1">
              <div className="w-8 h-8 rounded-full bg-[#FDF8EB] flex items-center justify-center text-[13px]">
                👥
              </div>

              <div>
                <div className="text-[10px] text-gray-400 font-bold mb-0.5">
                  팀원
                </div>
                <div className="text-xs font-extrabold text-gray-800 leading-snug">
                  {project.members}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}