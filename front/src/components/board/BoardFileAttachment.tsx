import { useRef, useState } from 'react';
import Image from 'next/image';
import { uploadFile } from '@/api/file';
import { resolveMediaUrl } from '@/utils/media';
import fileIcon from '@/assets/images/chumboofile.svg';

type BoardFileAttachmentProps = {
  fileUrl: string | null;
  fileName: string | null;
  onChange: (fileUrl: string | null, fileName: string | null) => void;
  disabled?: boolean;
};

export default function BoardFileAttachment({
  fileUrl,
  fileName,
  onChange,
  disabled = false,
}: BoardFileAttachmentProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadedUrl = await uploadFile(file);
      onChange(uploadedUrl, file.name);
    } catch (error) {
      alert(error instanceof Error ? error.message : '파일 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange(null, null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        disabled={disabled || uploading}
        onChange={handleFileChange}
      />

      <button
        type="button"
        disabled={disabled || uploading}
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-2 bg-[#FFFDF5] border border-[#F7D988] text-[#6B4E48] font-bold px-6 py-3 rounded-full hover:bg-[#F7D988] transition-colors disabled:opacity-50"
      >
        <Image src={fileIcon} alt="첨부파일" width={20} height={20} className="object-contain" />
        <span>{uploading ? '업로드 중...' : '파일 첨부'}</span>
      </button>

      {fileUrl && (
        <div className="flex items-center gap-3 rounded-[12px] border border-[#E8E0D5] bg-[#FFFDF5] px-4 py-2 text-sm font-bold text-[#6B4E48]">
          <a
            href={resolveMediaUrl(fileUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate hover:underline"
          >
            {fileName || '첨부파일'}
          </a>
          <button
            type="button"
            disabled={disabled || uploading}
            onClick={handleRemove}
            className="shrink-0 text-[#A3918D] hover:text-[#B04A4A]"
          >
            삭제
          </button>
        </div>
      )}
    </div>
  );
}
