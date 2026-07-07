'use client';

import React, { useState } from 'react';

import webebebImg from '../../assets/images/webebeb.svg';
import Navbar from '../../components/layout/Header'; 
// 방금 만든 컴포넌트 3개 불러오기
import FilterTabs from '../../components/untoc-camp/FilterTabs';
import ProjectCard, { Project } from '../../components/untoc-camp/ProjectCard';
import ProjectDetailModal from '../../components/untoc-camp/ProjectDetailModal';

import Footer from '../../components/layout/Footer';

// 테스트용 데이터

const PROJECT_DATA = [
  {
    id: 1,
    term: '26-1',
    title: '웨베벱~',
    subtitle: '역대급 언톡 홈페이지 제작',
    imgUrl: webebebImg.src,
    topic: '언톡 홈페이지',
    leader: '박정빈',
    members: '김나경, 김지수, 김준우, 김태우...',
    description: '웹 개발 파트의 역량을 총동원하여 만든 역대급 UNTOC 공식 홈페이지입니다. 프론트엔드와 백엔드의 긴밀한 협업을 통해 완성되었습니다.'
  },
  { id: 2, term: '26-1', title: '프로젝트 2', subtitle: '설명 2', imgUrl: '#EED270', topic: '주제 2', leader: '리더', members: '팀원들', description: '설명' },
  { id: 3, term: '26-1', title: '프로젝트 3', subtitle: '설명 3', imgUrl: '#F2E774', topic: '주제 3', leader: '리더', members: '팀원들', description: '설명' },
  { id: 4, term: '26-1', title: '프로젝트 4', subtitle: '설명 4', imgUrl: '#F5E2C8', topic: '주제 4', leader: '리더', members: '팀원들', description: '설명' },
  { id: 5, term: '26-1', title: '프로젝트 5', subtitle: '설명 5', imgUrl: '#E3C8F5', topic: '주제 5', leader: '리더', members: '팀원들', description: '설명' },
  { id: 6, term: '26-1', title: '프로젝트 6', subtitle: '설명 6', imgUrl: '#C8F5D8', topic: '주제 6', leader: '리더', members: '팀원들', description: '설명' },
];
const TERMS = ['26-1', '25-2', '25-1', '24-2', '24-1', '23-2'];

export default function UntocCampPage() {
  const [activeTerm, setActiveTerm] = useState('26-1');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = PROJECT_DATA.filter((p) => p.term === activeTerm);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      <Navbar />
      <main className="flex-grow w-full flex flex-col px-6 max-w-[1200px] mx-auto pt-12">
          <div className="mb-8">
            <h6 className="text-[#9C7B75] inline-flex items-center gap-2 px-3 py-1 bg-[#FEF3D0] rounded-full mb-4">🏆 UNTOC CAMP</h6>
            <h1 className="text-3xl font-bold text-[#6B4E48]">역대 작품들</h1>
          </div>

          {/* 1. 필터 탭 컴포넌트 사용 */}
          <FilterTabs 
            terms={TERMS} 
            activeTerm={activeTerm} 
            onTabChange={(term) => setActiveTerm(term)} 
          />

          {/* 2. 프로젝트 카드 목록 렌더링 */}
          <section className="flex overflow-x-auto snap-x gap-6 pt-1 pb-4 scrollbar-thin scrollbar-thumb-[#F7D988] scrollbar-track-transparent">
            {filteredProjects.map((project) => (
            <div 
              key={project.id} 
              className="snap-center flex-shrink-0 w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] max-w-[300px]"
            >
              <ProjectCard
                project={project} 
                onClick={() => setSelectedProject(project)} 
              />
              </div>
            ))}
          </section>
      </main>

      {/* 3. 모달 컴포넌트 사용 */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)} 
      />
    <Footer /> 
    </div>
  );
}