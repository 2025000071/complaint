'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, AlertTriangle, Send } from 'lucide-react';
import { createBoardPostAction } from '@/actions/boardActions';

type BoardFormInfo = {
  name: string;
  slug: string;
  type: string;
  allowSecret: boolean;
  allowAttachments: boolean;
  allowProductLink: boolean;
};

export default function BoardPostForm({ board }: { board: BoardFormInfo }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const result = await createBoardPostAction({
      boardSlug: board.slug,
      title: String(formData.get('title') || ''),
      content: String(formData.get('content') || ''),
      authorName: String(formData.get('authorName') || ''),
      isSecret: formData.get('isSecret') === 'on',
      password: String(formData.get('password') || ''),
      rating: Number(formData.get('rating')) || undefined,
      productId: String(formData.get('productId') || ''),
      imageUrls: String(formData.get('imageUrls') || '')
        .split(/\r?\n/)
        .map((url) => url.trim())
        .filter(Boolean),
    });

    if (result.success && result.postId) {
      router.push(`/boards/${board.slug}/posts/${result.postId}`);
      router.refresh();
      return;
    }

    setError(result.error || '게시글 등록에 실패했습니다.');
    setSubmitting(false);
  }

  return (
    <section className="mx-auto max-w-3xl space-y-5 py-3">
      <div className="flex items-center justify-between">
        <Link href={`/boards/${board.slug}`} className="inline-flex items-center gap-1 text-sm font-bold text-[#5c3e29] hover:text-[#276241]">
          <ArrowLeft className="h-4 w-4" /> {board.name}
        </Link>
        <span className="rounded-full bg-[#e3d5be] px-3 py-1 text-xs font-bold text-[#5c3e29]">{board.type}</span>
      </div>

      <div className="rounded-3xl border-2 border-[#2f754c] bg-[#1c4930] p-5 text-white shadow-md sm:p-7">
        <h1 className="mb-5 text-2xl font-black">{board.name} 글쓰기</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p role="alert" className="flex items-center gap-2 rounded-xl border border-rose-500 bg-rose-900/60 p-3 text-sm font-bold text-rose-100">
              <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
            </p>
          )}

          <label className="block space-y-1.5 text-sm font-bold">
            제목
            <input name="title" required minLength={2} maxLength={120} className="w-full rounded-xl border border-green-700 bg-[#143724] px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-yellow-400" />
          </label>

          <label className="block space-y-1.5 text-sm font-bold">
            내용
            <textarea name="content" required minLength={5} maxLength={50000} rows={9} className="w-full resize-y rounded-xl border border-green-700 bg-[#143724] px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-yellow-400" />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5 text-sm font-bold">
              작성자 표시
              <input name="authorName" maxLength={40} placeholder="익명" className="w-full rounded-xl border border-green-700 bg-[#143724] px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-yellow-400" />
            </label>
            {board.type === 'REVIEW' && (
              <label className="block space-y-1.5 text-sm font-bold">
                별점
                <select name="rating" required defaultValue="" className="w-full rounded-xl border border-green-700 bg-[#143724] px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-yellow-400">
                  <option value="" disabled>별점을 선택하세요</option>
                  {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating}점</option>)}
                </select>
              </label>
            )}
          </div>

          {board.allowProductLink && (
            <label className="block space-y-1.5 text-sm font-bold">
              상품 ID <span className="font-normal text-green-100/70">(선택)</span>
              <input name="productId" maxLength={120} placeholder="연결할 상품 ID" className="w-full rounded-xl border border-green-700 bg-[#143724] px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-yellow-400" />
            </label>
          )}

          {board.allowAttachments && (
            <label className="block space-y-1.5 text-sm font-bold">
              이미지 URL <span className="font-normal text-green-100/70">(선택, 한 줄에 하나씩 최대 10개)</span>
              <textarea name="imageUrls" rows={3} placeholder="https://example.com/image.jpg" className="w-full rounded-xl border border-green-700 bg-[#143724] px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-yellow-400" />
            </label>
          )}

          {board.allowSecret && (
            <div className="rounded-xl border border-green-700 bg-[#143724]/70 p-4">
              <label className="flex items-center gap-2 text-sm font-bold">
                <input type="checkbox" name="isSecret" className="h-4 w-4 accent-yellow-400" />
                비밀글로 등록
              </label>
              <label className="mt-3 block space-y-1.5 text-sm font-bold">
                비밀번호 <span className="font-normal text-green-100/70">(비밀글일 때 4자 이상)</span>
                <input type="password" name="password" autoComplete="new-password" minLength={4} className="w-full rounded-xl border border-green-700 bg-[#102d1d] px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-yellow-400" />
              </label>
            </div>
          )}

          <button type="submit" disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-4 py-3 font-black text-[#3d2402] transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60">
            <Send className="h-4 w-4" /> {submitting ? '등록 중...' : '게시글 등록'}
          </button>
        </form>
      </div>
    </section>
  );
}
