import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getAdminSession, verifyUnlockedToken } from '@/lib/adminAuth';
import ComplaintDetailView, { ComplaintDetailData } from '@/components/ComplaintDetailView';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function ComplaintDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { token } = await searchParams;

  const admin = await getAdminSession();
  const isAdmin = Boolean(admin);

  // Increment view count if not admin
  if (!isAdmin) {
    try {
      await prisma.complaint.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      });
    } catch {
      // ignore
    }
  }

  const complaint = await prisma.complaint.findUnique({
    where: { id },
    include: {
      comments: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!complaint) {
    notFound();
  }

  const isUnlockedInitially = Boolean(
    token && verifyUnlockedToken(complaint.id, token)
  );

  const formattedData: ComplaintDetailData = {
    id: complaint.id,
    trackingCode: complaint.trackingCode,
    title: complaint.title,
    content: complaint.content,
    category: complaint.category,
    status: complaint.status,
    isSecret: complaint.isSecret,
    authorNickname: complaint.authorNickname,
    viewCount: complaint.viewCount,
    createdAt: new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date(complaint.createdAt)),
    comments: complaint.comments.map((c) => ({
      id: c.id,
      senderType: c.senderType,
      senderName: c.senderName,
      content: c.content,
      createdAt: new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(new Date(c.createdAt)),
    })),
  };

  return (
    <ComplaintDetailView
      initialData={formattedData}
      isAdmin={isAdmin}
      isUnlockedInitially={isUnlockedInitially}
    />
  );
}

