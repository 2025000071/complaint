import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import BoardPostForm from '@/components/BoardPostForm';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export default async function NewBoardPostPage({ params }: PageProps) {
  const { slug } = await params;
  const board = await prisma.board.findUnique({
    where: { slug, isActive: true },
    select: {
      name: true,
      slug: true,
      type: true,
      allowSecret: true,
      allowAttachments: true,
      allowProductLink: true,
    },
  });

  if (!board) notFound();

  return <BoardPostForm board={board} />;
}
