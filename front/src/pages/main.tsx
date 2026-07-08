import Head from 'next/head';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { getCampProjects, getCampTerms } from '@/api/camp';
import { mapCampProjectToRow, type MainProjectRow } from '@/types/camp';

const PAGE_SIZE = 10;

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <tr key={index} className="border-b border-[#F0E8DC] last:border-b-0">
          {Array.from({ length: 4 }).map((__, cellIndex) => (
            <td key={cellIndex} className="px-6 py-5">
              <div className="h-4 w-full max-w-[180px] animate-pulse rounded-full bg-[#E8E0D5]/70" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export default function MainPage() {
  const auth = useAuth();
  const router = useRouter();
  const termMenuRef = useRef<HTMLDivElement>(null);

  const [terms, setTerms] = useState<string[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<string>('');
  const [projects, setProjects] = useState<MainProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [termMenuOpen, setTermMenuOpen] = useState(false);

  useEffect(() => {
    if (auth.isHydrated && !auth.isLoggedIn) {
      router.replace('/login');
    }
  }, [auth.isHydrated, auth.isLoggedIn, router]);

  useEffect(() => {
    const loadTerms = async () => {
      try {
        const fetchedTerms = await getCampTerms();
        setTerms(fetchedTerms);
        if (fetchedTerms.length > 0) {
          setSelectedTerm(fetchedTerms[0]);
        }
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : '학기 목록을 불러오지 못했습니다.');
      }
    };

    if (auth.isLoggedIn) {
      void loadTerms();
    }
  }, [auth.isLoggedIn]);

  useEffect(() => {
    if (!selectedTerm) return;

    const loadProjects = async () => {
      setLoading(true);
      setErrorMessage('');
      setCurrentPage(1);

      try {
        const fetchedProjects = await getCampProjects(selectedTerm);
        setProjects(fetchedProjects.map(mapCampProjectToRow));
      } catch (error) {
        setProjects([]);
        setErrorMessage(error instanceof Error ? error.message : '프로젝트 목록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    void loadProjects();
  }, [selectedTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!termMenuRef.current?.contains(event.target as Node)) {
        setTermMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalPages = Math.max(1, Math.ceil(projects.length / PAGE_SIZE));
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return projects.slice(start, start + PAGE_SIZE);
  }, [projects, currentPage]);

  const showingFrom = projects.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const showingTo = projects.length === 0 ? 0 : Math.min(currentPage * PAGE_SIZE, projects.length);

  if (!auth.isHydrated || !auth.isLoggedIn) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FFFDF8]">
      <Head>
        <title>프로젝트 - UNTOC</title>
      </Head>

      <Header />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10 md:px-10 md:py-14">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#6B4E48] md:text-5xl">
              프로젝트
            </h1>
            <p className="mt-2 text-sm font-medium text-[#8C8279] md:text-base">
              현재 학기 진행중인 프로젝트들
            </p>
          </div>

          <div ref={termMenuRef} className="relative self-start">
            <button
              type="button"
              onClick={() => setTermMenuOpen((prev) => !prev)}
              className="rounded-full border border-[#E8D49A] bg-[#FFF4C9] px-5 py-2.5 text-sm font-bold text-[#6B4E48] shadow-sm transition-colors hover:bg-[#F7D988]"
            >
              학기 선택{selectedTerm ? ` · ${selectedTerm}` : ''}
            </button>

            {termMenuOpen && (
              <div className="absolute right-0 z-20 mt-2 min-w-[140px] overflow-hidden rounded-2xl border border-[#E8E0D5] bg-white py-2 shadow-lg">
                {terms.length === 0 ? (
                  <p className="px-4 py-2 text-sm font-bold text-[#A3918D]">등록된 학기 없음</p>
                ) : (
                  terms.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => {
                        setSelectedTerm(term);
                        setTermMenuOpen(false);
                      }}
                      className={`block w-full px-4 py-2 text-left text-sm font-bold transition-colors ${
                        term === selectedTerm
                          ? 'bg-[#FFF4C9] text-[#6B4E48]'
                          : 'text-[#8C8279] hover:bg-[#FFFDF5]'
                      }`}
                    >
                      {term}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <section className="overflow-hidden rounded-[28px] border border-[#E8E0D5] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-[#F7D988] text-left text-sm font-extrabold text-[#6B4E48]">
                  <th className="px-6 py-4">팀명</th>
                  <th className="px-6 py-4">프로젝트명</th>
                  <th className="px-6 py-4">주제</th>
                  <th className="px-6 py-4">
                    <span className="inline-flex items-center gap-1">
                      팀 노션
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M14 5h5v5M10 14L19 5M19 5h-5M19 5v5M5 10v9h9"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <TableSkeleton />
                ) : errorMessage ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-16 text-center text-sm font-bold text-[#B04A4A]">
                      {errorMessage}
                    </td>
                  </tr>
                ) : paginatedProjects.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-16 text-center text-sm font-bold text-[#A3918D]">
                      표시할 프로젝트가 없습니다.
                    </td>
                  </tr>
                ) : (
                  paginatedProjects.map((project) => (
                    <tr key={project.id} className="border-b border-[#F0E8DC] last:border-b-0">
                      <td className="px-6 py-5 text-sm font-bold text-[#6B4E48]">{project.teamName}</td>
                      <td className="px-6 py-5 text-sm font-bold text-[#6B4E48]">{project.projectName}</td>
                      <td className="px-6 py-5 text-sm font-medium text-[#8C8279]">{project.subject}</td>
                      <td className="px-6 py-5">
                        {project.notionUrl ? (
                          <a
                            href={project.notionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm font-bold text-[#6B4E48] hover:underline"
                          >
                            바로가기
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                              <path
                                d="M14 5h5v5M10 14L19 5M19 5h-5M19 5v5M5 10v9h9"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </a>
                        ) : (
                          <span className="text-sm font-medium text-[#C4B8AE]">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-[#F0E8DC] px-6 py-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm font-medium text-[#8C8279]">
              Showing {showingFrom} – {showingTo} of {projects.length} teams
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1 || loading}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8E0D5] bg-white text-[#6B4E48] disabled:opacity-40"
              >
                &lt;
              </button>

              {Array.from({ length: totalPages }).map((_, index) => {
                const page = index + 1;
                const isActive = page === currentPage;

                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    disabled={loading}
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                      isActive
                        ? 'bg-[#F7D988] text-[#6B4E48]'
                        : 'border border-[#E8E0D5] bg-white text-[#6B4E48] hover:bg-[#FFF4C9]'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages || loading}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8E0D5] bg-white text-[#6B4E48] disabled:opacity-40"
              >
                &gt;
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
