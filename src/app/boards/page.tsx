import Link from 'next/link';
import { ArrowRight, Bell, HelpCircle, MessageCircle, Star } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import ChalkboardFrame from '@/components/ChalkboardFrame';

export const dynamic = 'force-dynamic';

const boardIcons: Record<string, typeof Bell> = {
  GENERAL: Bell,
  INQUIRY: MessageCircle,
  QNA: HelpCircle,
  REVIEW: Star,
};

const boardDescriptions: Record<string, string> = {
  GENERAL: '쇼핑몰의 새로운 소식과 안내를 확인하세요.',
  INQUIRY: '주문과 이용에 관한 문의를 남겨주세요.',
  QNA: '상품에 대해 궁금한 점을 질문해보세요.',
  REVIEW: '구매한 상품의 경험과 별점을 공유해주세요.',
};

export default async function BoardsPage() {
  const boards = await prisma.board.findMany({
    where: { isActive: true },
    orderBy: [{ type: 'asc' }, { createdAt: 'asc' }],
    include: {
      _count: { select: { posts: true, complaints: true } },
    },
  });

  return (
    <ChalkboardFrame
      title="쇼핑몰 게시판"
      subtitle="공지사항부터 상품 문의와 리뷰까지, 필요한 게시판으로 바로 이동하세요."
      showMascots={false}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {boards.map((board) => {
          const Icon = boardIcons[board.type] ?? MessageCircle;
          const count = board._count.posts + board._count.complaints;
          return (
            <Link
              key={board.id}
              href={`/boards/${board.slug}`}
              className="group rounded-2xl border border-[#31734c] bg-[#1b462e]/90 p-5 transition hover:-translate-y-0.5 hover:bg-[#205638]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400 text-[#3d2402]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-black text-white">{board.name}</h2>
                    <p className="mt-1 text-xs text-green-100/80">
                      {board.description || boardDescriptions[board.type] || '게시판 글을 확인하세요.'}
                    </p>
                  </div>
                </div>
                <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-yellow-300 transition group-hover:translate-x-1" />
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-green-800 pt-3 text-xs font-bold text-green-100/80">
                <span>{board.type}</span>
                <span>게시글 {count}개</span>
              </div>
            </Link>
          );
        })}
      </div>
      {boards.length === 0 && (
        <p className="rounded-2xl border border-green-700 bg-green-950/40 p-6 text-center text-sm text-green-100">
          표시할 게시판이 없습니다. 기본 게시판을 만들려면 데이터베이스 시드를 실행하세요.
        </p>
      )}
      <div className="text-center">
        <Link href="/complaints" className="text-xs font-bold text-green-100 underline underline-offset-4">
          기존 익명 소리함 바로가기
        </Link>
      </div>
    </ChalkboardFrame>
  );
}
