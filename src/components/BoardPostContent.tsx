'use client';

import { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { readBoardPostAction } from '@/actions/boardActions';

export default function BoardPostContent({
  postId,
  isSecret,
  initialContent,
}: {
  postId: string;
  isSecret: boolean;
  initialContent: string;
}) {
  const [content, setContent] = useState(initialContent);
  const [title, setTitle] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(!isSecret);

  async function unlock(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    const result = await readBoardPostAction(postId, password);
    if (result.success && result.content !== undefined) {
      setContent(result.content);
      setTitle(result.title || '');
      setImages(result.images);
      setUnlocked(true);
    } else {
      setError(result.error || '글을 불러오지 못했습니다.');
    }
    setLoading(false);
  }

  if (isSecret && !unlocked) {
    return (
      <form onSubmit={unlock} className="mt-4 space-y-3 rounded-xl border border-green-700 bg-[#143724] p-4">
        <label className="flex items-center gap-2 text-sm font-bold">
          <Lock className="h-4 w-4 text-yellow-300" /> 비밀번호를 입력해 내용을 확인하세요.
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required className="ml-auto w-40 rounded-lg border border-green-700 bg-[#102d1d] px-3 py-2 text-white" />
        </label>
        {error && <p role="alert" className="text-xs font-bold text-rose-300">{error}</p>}
        <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-lg bg-yellow-400 px-4 py-2 text-sm font-black text-[#3d2402] disabled:opacity-60">
          <Unlock className="h-4 w-4" /> {loading ? '확인 중...' : '글 확인하기'}
        </button>
      </form>
    );
  }

  return (
    <div className="mt-5 whitespace-pre-wrap break-words leading-7 text-green-50">
      {title && <h2 className="mb-4 text-xl font-black">{title}</h2>}
      {content}
      {images.length > 0 && (
        <div className="mt-5 space-y-2 border-t border-green-700 pt-4">
          <h3 className="text-sm font-bold">첨부 이미지</h3>
          {images.map((imageUrl) => (
            <a key={imageUrl} href={imageUrl} target="_blank" rel="noreferrer" className="block break-all text-xs text-yellow-200 underline underline-offset-2">
              {imageUrl}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
