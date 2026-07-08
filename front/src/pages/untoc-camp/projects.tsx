'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Header';
import FilterTabs from '../../components/untoc-camp/FilterTabs';
import ProjectCard, { Project } from '../../components/untoc-camp/ProjectCard';
import ProjectDetailModal from '../../components/untoc-camp/ProjectDetailModal';
import Footer from '../../components/layout/Footer';
import { getCampProjects, getCampTerms } from '@/api/camp';
import { mapCampProjectToCard } from '@/types/camp';
import { resolveMediaUrl } from '@/utils/media';

export default function UntocCampPage() {
  const [terms, setTerms] = useState<string[]>([]);
  const [activeTerm, setActiveTerm] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTerms = async () => {
      try {
        const fetchedTerms = await getCampTerms();
        setTerms(fetchedTerms);
        if (fetchedTerms.length > 0) {
          setActiveTerm(fetchedTerms[0]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    void loadTerms();
  }, []);

  useEffect(() => {
    if (!activeTerm) return;

    const loadProjects = async () => {
      setLoading(true);
      try {
        const fetchedProjects = await getCampProjects(activeTerm);
        setProjects(
          fetchedProjects.map((project) => {
            const card = mapCampProjectToCard(project);
            return {
              ...card,
              imgUrl: card.imgUrl.startsWith('#')
                ? card.imgUrl
                : resolveMediaUrl(card.imgUrl),
            };
          })
        );
      } catch (error) {
        console.error(error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    void loadProjects();
  }, [activeTerm]);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      <Navbar />
      <main className="flex-grow w-full flex flex-col px-6 max-w-[1200px] mx-auto pt-12">
        <div className="mb-8">
          <h6 className="text-[#9C7B75] inline-flex items-center gap-2 px-3 py-1 bg-[#FEF3D0] rounded-full mb-4">
            🏆 UNTOC CAMP
          </h6>
          <h1 className="text-3xl font-bold text-[#6B4E48]">역대 작품들</h1>
        </div>

        <FilterTabs
          terms={terms.length > 0 ? terms : [activeTerm || '26-1']}
          activeTerm={activeTerm}
          onTabChange={setActiveTerm}
        />

        {loading ? (
          <p className="py-16 text-center font-bold text-[#9B827D]">작품을 불러오는 중...</p>
        ) : projects.length === 0 ? (
          <p className="py-16 text-center font-bold text-[#9B827D]">등록된 작품이 없습니다.</p>
        ) : (
          <section className="flex overflow-x-auto snap-x gap-6 pt-1 pb-4 scrollbar-thin scrollbar-thumb-[#F7D988] scrollbar-track-transparent">
            {projects.map((project) => (
              <div
                key={project.id}
                className="snap-center flex-shrink-0 w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] max-w-[300px]"
              >
                <ProjectCard project={project} onClick={() => setSelectedProject(project)} />
              </div>
            ))}
          </section>
        )}
      </main>

      <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      <Footer />
    </div>
  );
}
