import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cropper from 'react-easy-crop';

type CropArea = { x: number; y: number; width: number; height: number };
import Navbar from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { updatePassword, updateProfile, updateProfileImage, uploadProfileImage } from '@/api/auth';
import { resolveMediaUrl } from '@/utils/media';

// --- 캔버스에서 이미지를 잘라내는 유틸리티 함수 ---
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); 
    image.src = url;
  });

async function getCroppedImg(imageSrc: string, pixelCrop: { x: number; y: number; width: number; height: number }) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  // 잘라낼 크기(예: 48x48 비율의 원본 픽셀 크기) 설정
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/jpeg', 0.95);
  });
}
// --------------------------------------------------

export default function MyPage() {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (auth.isHydrated && !auth.isLoggedIn) {
      router.replace('/login');
      alert('회원 전용 페이지입니다. 로그인 페이지로 이동합니다.');
    }
  }, [auth.isHydrated, auth.isLoggedIn, router]);

  const [viewMode, setViewMode] = useState<'intro' | 'upload'>('intro');

  // 프로필 변경 및 자르기 상태 관리
  const [profileImageUrl, setProfileImageUrl] = useState(auth.session?.profileImageUrl || '');
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // 자기소개
  const [introduction, setIntroduction] = useState(auth.session?.introduction || '');
  const [editIntroduction, setEditIntroduction] = useState(false);
  const [tempIntroduction, setTempIntroduction] = useState('');

  // 비밀번호 변경
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingIntroduction, setSavingIntroduction] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingProfileImage, setSavingProfileImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!auth.session) return;
    setProfileImageUrl(auth.session.profileImageUrl || '');
    setIntroduction(auth.session.introduction || '');
  }, [auth.session]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!auth.session?.accessToken) return;

    if (newPassword !== confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    setSavingPassword(true);
    try {
      await updatePassword(auth.session.accessToken, currentPassword, newPassword);
      alert('비밀번호가 변경되었습니다.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      alert(error instanceof Error ? error.message : '비밀번호 변경에 실패했습니다.');
    } finally {
      setSavingPassword(false);
    }
  };

  // 공통 파일 처리 함수 (미리보기 URL 생성)
  const processSelectedFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreviewUrl(reader.result as string);
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processSelectedFile(file);
  };

  // 드래그 앤 드롭 이벤트
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processSelectedFile(file);
  };

  // 자르기 영역 변경 시 저장
  const onCropComplete = useCallback((_croppedArea: CropArea, croppedPixels: CropArea) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  // '적용하기' 버튼 클릭 시 캔버스로 잘라내고 백엔드 전송 준비
  const handleCropSave = async () => {
    if (!imagePreviewUrl || !croppedAreaPixels || !auth.session?.accessToken) return;

    try {
      setSavingProfileImage(true);
      const croppedImageBlob = await getCroppedImg(imagePreviewUrl, croppedAreaPixels);
      if (croppedImageBlob) {
        const uploadedImageUrl = await uploadProfileImage(auth.session.accessToken, croppedImageBlob);
        const savedProfileImageUrl = await updateProfileImage(auth.session.accessToken, uploadedImageUrl);
        setProfileImageUrl(savedProfileImageUrl);
        auth.updateSession({
          ...auth.session,
          profileImageUrl: savedProfileImageUrl,
        });

        // 초기화 및 화면 전환
        setImagePreviewUrl(null);
        setViewMode('intro');
      }
    } catch (e) {
      console.error('이미지 자르기 실패:', e);
      alert(e instanceof Error ? e.message : '프로필 이미지 저장에 실패했습니다.');
    } finally {
      setSavingProfileImage(false);
    }
  };
  if (!auth.isHydrated || !auth.isLoggedIn) {
    return null; // 로그인 상태가 아니면 아무것도 렌더링하지 않음
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFAF5]">
      <Navbar />
      <div className="flex-grow w-full text-[#333333] font-sans antialiased py-10 px-8 flex justify-center items-start">
        <div className="max-w-6xl w-full bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col min-h-[800px]">

          <main className="flex-1 px-16 py-10">
            <h1 className="text-2xl font-bold tracking-tight mb-12 text-[#222222]">마이페이지</h1>

            <div className="flex gap-16 items-start mb-16">
              <div className="flex flex-col gap-3">
                <h2 className="text-lg font-bold text-[#222222]">프로필</h2>
                <div className="relative w-44 h-44">
                  <div className="w-full h-full bg-[#F7F2E8] border border-[#E8DFCE] rounded-2xl flex items-center justify-center overflow-hidden shadow-sm">
                    {profileImageUrl ? (
                      <img src={resolveMediaUrl(profileImageUrl)} alt="프로필" className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-20 h-20 text-[#4A4A4A]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    )}
                  </div>
                  <button 
                    onClick={() => {
                      setViewMode(viewMode === 'intro' ? 'upload' : 'intro');
                      setImagePreviewUrl(null); // 모드 변경 시 미리보기 초기화
                    }}
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
                              setTempIntroduction(introduction);
                              setEditIntroduction(false);
                            }}
                            className="px-3 py-1 bg-white border border-gray-300 text-gray-600 rounded-full text-xs hover:bg-gray-50 shadow-sm"
                          >
                            취소
                          </button>

                          <button
                            type="button"
                            disabled={savingIntroduction}
                            onClick={async () => {
                              if (!auth.session?.accessToken) return;
                              setSavingIntroduction(true);
                              try {
                                await updateProfile(auth.session.accessToken, tempIntroduction);
                                setIntroduction(tempIntroduction);
                                auth.updateSession({
                                  ...auth.session,
                                  introduction: tempIntroduction,
                                });
                                setEditIntroduction(false);
                                alert('자기소개가 저장되었습니다.');
                              } catch (error) {
                                alert(error instanceof Error ? error.message : '자기소개 저장에 실패했습니다.');
                              } finally {
                                setSavingIntroduction(false);
                              }
                            }}
                            className="px-3 py-1 bg-[#F7D988] hover:bg-[#e4d197] text-[#6B4E48] rounded-full text-xs font-bold shadow-sm"
                          >
                            {savingIntroduction ? '저장 중...' : '완료'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-bold text-[#222222]">
                        {imagePreviewUrl ? '사진 크기 및 위치 조정' : '사진 업로드'}
                      </h2>
                      <button 
                        onClick={() => {
                          setViewMode('intro');
                          setImagePreviewUrl(null);
                        }} 
                        className="text-xs text-gray-500 hover:text-amber-700 underline"
                      >
                        자기소개로 돌아가기
                      </button>
                    </div>

                    {!imagePreviewUrl ? (
                      // 1. 이미지 선택/드래그 영역
                      <div 
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`w-full h-44 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 shadow-sm transition-colors ${
                          isDragging ? 'bg-[#F7D988]/20 border-[#CDA869]' : 'bg-[#FAF8F5] border-[#CDA869]/40'
                        }`}
                      >
                        <svg className={`w-12 h-12 mb-2 transition-colors ${isDragging ? 'text-[#CDA869]' : 'text-gray-400'}`} fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-xs text-gray-500 mb-4 font-medium">
                          {isDragging ? '파일을 여기에 놓아주세요!' : '파일을 드래그 / 클릭하여 업로드 하세요.'}
                        </p>
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          className="hidden" 
                          accept="image/*"
                        />
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-[#F7D988] hover:bg-[#e4d197] text-[#5A4A32] text-xs font-bold px-5 py-2 rounded shadow-sm transition-colors"
                        >
                          파일 선택
                        </button>
                      </div>
                    ) : (
                      // 2. 이미지 자르기(Crop) 및 확대/축소(Zoom) 영역
                      <div className="w-full flex flex-col gap-4">
                        <div className="relative w-full h-64 bg-black rounded-2xl overflow-hidden shadow-inner">
                          <Cropper
                            image={imagePreviewUrl}
                            crop={crop}
                            zoom={zoom}
                            aspect={1} // 1:1 정사각형 비율 (프로필용)
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                            cropShape="rect" // "round"로 변경하면 원형으로 보입니다.
                            showGrid={false}
                          />
                        </div>
                        
                        <div className="flex items-center gap-4 px-2">
                          <span className="text-xs font-medium text-gray-500">축소</span>
                          <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="flex-1 h-1.5 bg-[#FDF8EB] rounded-lg appearance-none cursor-pointer accent-[#F7D988]"
                          />
                          <span className="text-xs font-medium text-gray-500">확대</span>
                        </div>

                        <div className="flex justify-end gap-2 mt-2">
                          <button
                            onClick={() => setImagePreviewUrl(null)}
                            className="px-4 py-2 bg-white border border-gray-300 text-gray-600 rounded-full text-xs font-medium hover:bg-gray-50 transition-colors"
                          >
                            다시 선택
                          </button>
                          <button
                            onClick={handleCropSave}
                            disabled={savingProfileImage}
                            className="px-6 py-2 bg-[#F7D988] hover:bg-[#e4d197] text-[#5A4A32] rounded-full text-xs font-bold shadow-sm transition-colors"
                          >
                            {savingProfileImage ? '저장 중...' : '적용하기'}
                          </button>
                        </div>
                      </div>
                    )}
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