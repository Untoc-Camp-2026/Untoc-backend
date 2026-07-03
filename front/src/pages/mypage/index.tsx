'use client';

import React, { useState, useRef } from 'react';
// Navbar 컴포넌트를 불러옵니다 (경로는 폴더 구조에 맞게 조절하세요)
import Navbar from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

export default function MyPage() {
  const [viewMode, setViewMode] = useState<'intro' | 'upload'>('intro');

  // 프로필 변경
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // 자기소개
  const [introduction, setIntroduction] = useState('');
  const [editIntroduction, setEditIntroduction] = useState(false);
  const [tempIntroduction, setTempIntroduction] = useState('');

  // 비밀번호 변경
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    console.log('비밀번호 변경 요청 데이터:', { currentPassword, newPassword });
    alert('비밀번호 변경 요청이 콘솔에 기록되었습니다.');
  };

  const handleFileSelectClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('선택된 이미지 파일:', file.name);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFAF5]">
        <Navbar />
    <div className=" text-[#333333] font-sans antialiased py-10 px-8 flex justify-center items-start">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col min-h-[800px]">

        <main className="flex-1 px-16 py-10">
          <h1 className="text-2xl font-bold tracking-tight mb-12 text-[#222222]">마이페이지</h1>

          <div className="flex gap-16 items-start mb-16">
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-[#222222]">프로필</h2>
              <div className="relative w-44 h-44">
                <div className="w-full h-full bg-[#F7F2E8] border border-[#E8DFCE] rounded-2xl flex items-center justify-center overflow-hidden shadow-sm">
                  <svg className="w-20 h-20 text-[#4A4A4A]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <button 
                  onClick={() => setViewMode(viewMode === 'intro' ? 'upload' : 'intro')}
                  className="absolute bottom-[-6px] right-[-6px] bg-[#F7D988] hover:bg-[#e4d197] w-8 h-8 rounded-full border border-white flex items-center justify-center shadow-md transition-transform active:scale-95"
                >
                  <svg className="w-4 h-4 text-[#5A4A32]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 min-w-[500px]">
              {viewMode === 'intro' ? (
                <div className="flex flex-col gap-3 relative">
                    <h2 className="text-lg font-bold text-[#222222]">자기소개</h2>

                    <div className="relative h-44">
                    {editIntroduction ? (
                        <textarea
                        value={tempIntroduction}
                        onChange={(e) => setTempIntroduction(e.target.value)}
                        className="w-full h-44 p-5 bg-[#FAF8F5] border border-[#EADFC9] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#CDA869] focus:border-transparent resize-none shadow-inner"
                        placeholder="자기소개를 입력해주세요."
                        />
                    ) : (
                        <div className="w-full h-44 p-5 bg-[#FAF8F5] border border-[#EADFC9] rounded-2xl shadow-inner text-sm text-[#333333] whitespace-pre-wrap">
                        {introduction || '아직 작성된 자기소개가 없습니다.'}
                        </div>
                    )}

                    {!editIntroduction ? (
                        <button
                        type="button"
                        onClick={() => {
                            setTempIntroduction(introduction);
                            setEditIntroduction(true);
                        }}
                        className="absolute bottom-[-10px] right-3 bg-[#F7D988] hover:bg-[#e4d197] w-8 h-8 rounded-full border border-white flex items-center justify-center shadow-md"
                        >
                        <svg className="w-4 h-4 text-[#5A4A32]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        </button>
                    ) : (
                        <div className="absolute bottom-[-10px] right-3 flex gap-2">
                        <button
                            type="button"
                            onClick={() => {
                            setTempIntroduction('');
                            setEditIntroduction(false);
                            }}
                            className="px-3 py-1 bg-white border border-gray-300 text-gray-600 rounded-full text-xs hover:bg-gray-50 shadow-sm"
                        >
                            취소
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                            setIntroduction(tempIntroduction);
                            setEditIntroduction(false);

                            // 추후 백엔드 연결 위치
                            console.log('자기소개 저장 요청:', tempIntroduction);
                            }}
                            className="px-3 py-1 bg-[#F7D988] hover:bg-[#e4d197] text-[#6B4E48] rounded-full text-xs font-bold shadow-sm"
                        >
                            완료
                        </button>
                        </div>
                    )}
                    </div>
                </div>
                ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-[#222222]">사진 업로드</h2>
                    <button 
                      onClick={() => setViewMode('intro')} 
                      className="text-xs text-gray-500 hover:text-amber-700 underline"
                    >
                      자기소개로 돌아가기
                    </button>
                  </div>


                  <div className="w-full h-44 bg-[#FAF8F5] border-2 border-dashed border-[#CDA869]/40 rounded-2xl flex flex-col items-center justify-center p-6 shadow-sm">
                    <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-xs text-gray-500 mb-4 font-medium">파일을 드래그 / 클릭하여 업로드 하세요.</p>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden" 
                      accept="image/*"
                    />
                    <button 
                      onClick={handleFileSelectClick}
                      className="bg-[#F7D988] hover:bg-[#e4d197] text-[#5A4A32] text-xs font-bold px-5 py-2 rounded shadow-sm transition-colors"
                    >
                      파일 선택
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-10">
            <h2 className="text-xl font-bold mb-8 text-[#222222]">비밀번호 변경</h2>
            <form onSubmit={handlePasswordSubmit} className="w-[80%] max-w-2xl mx-auto flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-3.5 bg-[#FAF8F5] border border-[#D1C7BD] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CDA869] focus:border-transparent transition-all placeholder-gray-400"
                  placeholder="기존 비밀번호 입력"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3.5 bg-[#FAF8F5] border border-[#D1C7BD] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CDA869] focus:border-transparent transition-all placeholder-gray-400"
                  placeholder="새 비밀번호 입력"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3.5 bg-[#FAF8F5] border border-[#D1C7BD] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CDA869] focus:border-transparent transition-all placeholder-gray-400"
                  placeholder="새 비밀번호 확인"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="px-6 py-2 bg-white border border-gray-300 text-gray-600 rounded-full text-xs font-medium hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#F7D988] hover:bg-[#e4d197] text-[#6B4E48] rounded-full text-xs font-bold shadow-sm transition-colors"
                >
                  완료
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
    <Footer />
    </div>
  );
}