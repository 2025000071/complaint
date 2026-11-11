import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Lock, MessageSquarePlus, Star } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import ChalkboardFrame from '@/components/ChalkboardFrame';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export default async function BoardPage({ params }: PageProps) {
  const { slug } = await params;
  const board = await prisma.board.findUnique({
    where: { slug, isActive: true },
    include: {
      posts: {
        where: { status: { not: 'HIDDEN' } },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          authorName: true,
          isSecret: true,
          rating: true,
          status: true,
          createdAt: true,
        },
      },
      complaints: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          authorNickname: true,
          isSecret: true,
          status: true,
          createdAt: true,
        },
      },
    },
  });

  if (!board) notFound();

  const entries = [
    ...board.posts.map((post) => ({
      id: post.id,
      title: post.isSecret ? '비밀글입니다.' : post.title,
      author: post.authorName || '익명',
      isSecret: post.isSecret,
      rating: post.rating,
      status: post.status,
      createdAt: post.createdAt,
      href: `/boards/${board.slug}/posts/${post.id}`,
    })),
    ...board.complaints.map((complaint) => ({
      id: complaint.id,
      title: complaint.isSecret ? '비밀글입니다.' : complaint.title,
      author: complaint.authorNickname,
      isSecret: complaint.isSecret,
      rating: null,
      status: complaint.status,
      createdAt: complaint.createdAt,
      href: `/complaints/${complaint.id}`,
    })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <ChalkboardFrame
      title={board.name}
      subtitle={board.description || `${board.type} 게시판 · 전체 ${entries.length}개`}
      showMascots={false}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/boards" className="inline-flex items-center gap-1 text-xs font-bold text-green-100 hover:text-yellow-300">
          <ArrowLeft className="h-4 w-4" /> 게시판 모아보기
        </Link>
        <Link
          href={`/boards/${board.slug}/new`}
          className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-4 py-2 text-sm font-black text-[#3d2402] hover:bg-yellow-300"
        >
          <MessageSquarePlus className="h-4 w-4" /> 글쓰기
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#31734c] bg-[#143724]/80">
        {entries.map((entry) => (
          <Link
            key={`${entry.href}-${entry.id}`}
            href={entry.href}
            className="flex items-center justify-between gap-3 border-b border-green-900/80 px-4 py-4 last:border-b-0 hover:bg-[#1b462e]"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {entry.isSecret && <Lock className="h-3.5 w-3.5 shrink-0 text-yellow-300" />}
                <span className="truncate text-sm font-bold text-white">{entry.title}</span>
                {entry.rating !== null && entry.rating !== undefined && (
                  <span className="inline-flex shrink-0 items-center gap-1 text-xs text-yellow-300">
                    <Star className="h-3.5 w-3.5 fill-current" /> {entry.rating}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-green-100/70">
                {entry.author} · {entry.status}
              </p>
            </div>
            <time className="shrink-0 text-xs text-green-100/60">
              {new Intl.DateTimeFormat('ko-KR', { month: '2-digit', day: '2-digit' }).format(entry.createdAt)}
            </time>
          </Link>
        ))}
        {entries.length === 0 && (
          <p className="p-8 text-center text-sm text-green-100/80">아직 등록된 글이 없습니다. 첫 글을 남겨보세요.</p>
        )}
      </div>
    </ChalkboardFrame>
  );
}
