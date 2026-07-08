'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { formatTerm, getGalleries, parseTerm } from '@/api/gallery';
import { resolveMediaUrl } from '@/utils/media';
import type { GalleryItem } from '@/types/gallery';

const formatTermLabel = (term: string) => term.replace('-', ' - ');

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activeTerm, setActiveTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGalleries = async () => {
      setLoading(true);
      try {
        const galleries = await getGalleries();
        setItems(galleries);
        if (galleries.length > 0) {
          setActiveTerm(formatTerm(galleries[0].year, galleries[0].semester));
        }
      } catch (error) {
        console.error(error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    void loadGalleries();
  }, []);

  const terms = useMemo(() => {
    const unique = new Set(items.map((item) => formatTerm(item.year, item.semester)));
    return Array.from(unique);
  }, [items]);

  const filteredItems = useMemo(() => {
    const parsed = parseTerm(activeTerm);
    if (!parsed) return items;
    return items.filter(
      (item) => item.year === parsed.year && item.semester === parsed.semester
    );
  }, [activeTerm, items]);

  const rotations = ['rotate-2', '-rotate-3', 'rotate-1', '-rotate-2', 'rotate-3', '-rotate-1'];

  return (
    <main className="flex flex-col min-h-screen bg-[#FDF8EB]">
      <Navbar />

      <div className="flex-grow w-full max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-[#6D4E48] mb-8 mt-12">UNTOC 활동 사진</h1>

        <div className="relative mb-12">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-[#6B4E48] rounded-4xl px-6 py-2 font-bold text-white shadow-sm flex items-center gap-2"
          >
            {activeTerm ? formatTermLabel(activeTerm) : '학기 선택'} <span className="text-xs">▼</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 bg-white border border-[#D1C7BD] rounded-lg shadow-xl w-32 z-50">
              {terms.map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setActiveTerm(term);
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-[#FDF8EB] text-[#6D4E48]"
                >
                  {formatTermLabel(term)}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <p className="text-center text-[#9B827D] font-bold py-20">갤러리를 불러오는 중...</p>
        ) : filteredItems.length === 0 ? (
          <p className="text-center text-[#9B827D] font-bold py-20">등록된 활동 사진이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 justify-items-center mb-20">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className={`group w-[300px] transition-all duration-500 hover:rotate-0 hover:scale-105 ${rotations[index % rotations.length]}`}
              >
                <div className="bg-white p-4 pb-10 rounded-lg shadow-lg border border-gray-100">
                  <div className="w-full aspect-[4/3] bg-gray-200 rounded mb-4 overflow-hidden">
                    <img
                      src={resolveMediaUrl(item.image_url)}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="text-center font-bold text-[#6D4E48]">{item.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
