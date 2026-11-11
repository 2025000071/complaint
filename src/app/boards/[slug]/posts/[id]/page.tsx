import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Image as ImageIcon, Lock } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import ChalkboardFrame from '@/components/ChalkboardFrame';
import BoardPostContent from '@/components/BoardPostContent';

interface PageProps {
  params: Promise<{ slug: string; id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function BoardPostPage({ params }: PageProps) {
  const { slug, id } = await params;
  const post = await prisma.post.findFirst({
    where: { id, board: { slug, isActive: true } },
    include: {
      board: { select: { name: true, slug: true } },
      images: { orderBy: { sortOrder: 'asc' } },
    },
  });

  if (!post) notFound();

  if (post.status === 'HIDDEN') notFound();

  await prisma.post.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } },
  });

  const date = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(post.createdAt);

  return (
    <ChalkboardFrame title={post.board.name} showMascots={false}>
      <Link href={`/boards/${post.board.slug}`} className="inline-flex items-center gap-1 text-sm font-bold text-green-100 hover:text-yellow-300">
        <ArrowLeft className="h-4 w-4" /> 목록으로
      </Link>
      <article className="rounded-3xl border-2 border-[#2f754c] bg-[#1c4930] p-5 text-white shadow-md sm:p-7">
        <div className="border-b border-green-700 pb-4">
          <h1 className="text-xl font-black sm:text-2xl">{post.isSecret ? '비밀글' : post.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-green-100/75">
            <span>{post.authorName || '익명'}</span>
            <time>{date}</time>
            <span>{post.status}</span>
            {post.rating !== null && <span>별점 {post.rating}/5</span>}
          </div>
        </div>
        {post.productId && (
          <p className="mt-4 rounded-lg bg-[#143724] px-3 py-2 text-xs text-green-100">상품 ID: {post.productId}</p>
        )}
        {post.isSecret ? (
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-yellow-600/50 bg-[#143724] p-4 text-sm text-yellow-100">
            <Lock className="h-4 w-4 shrink-0" />
            비밀글입니다. 작성 시 설정한 비밀번호를 입력해 내용을 확인하세요.
          </div>
        ) : (
          <>
            <BoardPostContent postId={post.id} isSecret={false} initialContent={post.content} />
            {post.images.length > 0 && (
              <div className="mt-5 space-y-2 border-t border-green-700 pt-4">
                <h2 className="flex items-center gap-2 text-sm font-bold"><ImageIcon className="h-4 w-4" /> 첨부 이미지</h2>
                {post.images.map((image) => (
                  <a key={image.id} href={image.imageUrl} target="_blank" rel="noreferrer" className="block break-all text-xs text-yellow-200 underline underline-offset-2">
                    {image.imageUrl}
                  </a>
                ))}
              </div>
            )}
          </>
        )}
        {post.isSecret && <BoardPostContent postId={post.id} isSecret initialContent="" />}
      </article>
    </ChalkboardFrame>
  );
}
