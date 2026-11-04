import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/adminAuth';
import AdminDashboard, { AdminComplaintItem } from '@/components/AdminDashboard';

export default async function AdminPage() {
  const admin = await getAdminSession();
  if (!admin) {
    redirect('/admin/login');
  }

  const complaints = await prisma.complaint.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { comments: true },
      },
    },
  });

  const formattedComplaints: AdminComplaintItem[] = complaints.map((item) => ({
    id: item.id,
    trackingCode: item.trackingCode,
    title: item.title,
    content: item.content,
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

  return (
    <AdminDashboard
      initialComplaints={formattedComplaints}
      adminUsername={admin.username}
    />
  );
}

