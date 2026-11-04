import { prisma } from '@/lib/prisma';
import ComplaintTable, { ComplaintListItem } from '@/components/ComplaintTable';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const complaints = await prisma.complaint.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { comments: true },
      },
    },
  });

  const formattedComplaints: ComplaintListItem[] = complaints.map((item) => ({
    id: item.id,
    trackingCode: item.trackingCode,
    title: item.title,
    category: item.category,
    status: item.status,
    isSecret: item.isSecret,
    authorNickname: item.authorNickname,
    viewCount: item.viewCount,
    commentsCount: item._count.comments,
    createdAt: new Intl.DateTimeFormat('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date(item.createdAt)),
  }));

  return <ComplaintTable initialComplaints={formattedComplaints} />;
}
