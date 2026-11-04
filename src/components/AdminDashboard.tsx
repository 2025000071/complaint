'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CATEGORIES } from '@/lib/constants';
import StatusBadge from './StatusBadge';
import ChalkboardFrame from './ChalkboardFrame';
import {
  Search,
  MessageSquare,
  Lock,
  LogOut,
  Trash2,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';
import { adminLogoutAction } from '@/actions/adminActions';
import { adminUpdateStatusAction, deleteComplaintAction } from '@/actions/complaintActions';

export interface AdminComplaintItem {
  id: string;
  trackingCode: string;
  title: string;
  content: string;
  category: string;
  status: string;
  isSecret: boolean;
  authorNickname: string;
  viewCount: number;
  commentsCount: number;
  createdAt: string;
}

export default function AdminDashboard({
  initialComplaints,
  adminUsername,
}: {
  initialComplaints: AdminComplaintItem[];
  adminUsername: string;
}) {
  const router = useRouter();
  const [complaints, setComplaints] = useState<AdminComplaintItem[]>(initialComplaints);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Statistics
  const stats = useMemo(() => {
    return {
      total: complaints.length,
      pending: complaints.filter((c) => c.status === 'PENDING').length,
      inReview: complaints.filter((c) => c.status === 'IN_REVIEW').length,
      answered: complaints.filter((c) => c.status === 'ANSWERED').length,
      resolved: complaints.filter((c) => c.status === 'RESOLVED').length,
    };
  }, [complaints]);

  // Filtered
  const filtered = useMemo(() => {
    return complaints.filter((item) => {
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
      if (selectedStatus !== 'ALL' && item.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchCode = item.trackingCode.toLowerCase().includes(q);
        const matchContent = item.content.toLowerCase().includes(q);
        if (!matchTitle && !matchCode && !matchContent) return false;
      }
      return true;
    });
  }, [complaints, selectedCategory, selectedStatus, searchQuery]);

  // Quick Status Update
  const handleQuickStatusChange = async (id: string, newStatus: string) => {
    const res = await adminUpdateStatusAction(id, newStatus);
    if (res.success) {
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );
      router.refresh();
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    if (!confirm('정말로 이 접수글과 모든 대화 내역을 삭제하시겠습니까?')) return;

    const res = await deleteComplaintAction(id);
    if (res.success) {
      setComplaints((prev) => prev.filter((c) => c.id !== id));
      router.refresh();
    } else {
      alert(res.error || '삭제 중 문제가 발생했습니다.');
    }
  };

  return (
    <ChalkboardFrame
      title="운영 관리자 대시보드"
      subtitle={`접속자: ${adminUsername} 님 (접수 현황을 확인하고 정성껏 답변을 남겨주세요) ✨`}
      showMascots={true}
    >
      <div className="space-y-6">
        {/* Top Header controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#2d6845]">
          <span className="text-xs font-bold text-green-200">
            실시간 접수 목록 관리 및 답변 등록
          </span>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#143724] hover:bg-[#102d1d] text-green-100 border border-[#2d6845] transition-colors flex items-center gap-1.5"
            >
              <span>이용자 화면</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <form action={adminLogoutAction}>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700 transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>로그아웃</span>
              </button>
            </form>
          </div>
        </div>

        {/* Summary KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
          <div
            onClick={() => setSelectedStatus('ALL')}
            className={`cursor-pointer p-3 sm:p-4 rounded-2xl border-2 transition-all ${
              selectedStatus === 'ALL'
                ? 'bg-yellow-400 text-[#3d2402] border-yellow-300 shadow-md scale-102 font-black'
                : 'bg-[#1c4930] text-white border-[#2f754c] hover:border-yellow-400/60 font-bold'
            }`}
          >
            <span className="text-xs opacity-80 block">전체 접수</span>
            <span className="text-2xl font-black mt-1 block">{stats.total}건</span>
          </div>

          <div
            onClick={() => setSelectedStatus('PENDING')}
            className={`cursor-pointer p-3 sm:p-4 rounded-2xl border-2 transition-all ${
              selectedStatus === 'PENDING'
                ? 'bg-amber-400 text-[#3d2402] border-amber-300 shadow-md scale-102 font-black'
                : 'bg-[#1c4930] text-amber-300 border-[#2f754c] hover:border-amber-400/60 font-bold'
            }`}
          >
            <span className="text-xs opacity-80 block">접수대기</span>
            <span className="text-2xl font-black mt-1 block">{stats.pending}건</span>
          </div>

          <div
            onClick={() => setSelectedStatus('IN_REVIEW')}
            className={`cursor-pointer p-3 sm:p-4 rounded-2xl border-2 transition-all ${
              selectedStatus === 'IN_REVIEW'
                ? 'bg-sky-300 text-[#0c3652] border-sky-200 shadow-md scale-102 font-black'
                : 'bg-[#1c4930] text-sky-300 border-[#2f754c] hover:border-sky-400/60 font-bold'
            }`}
          >
            <span className="text-xs opacity-80 block">검토중</span>
            <span className="text-2xl font-black mt-1 block">{stats.inReview}건</span>
          </div>

          <div
            onClick={() => setSelectedStatus('ANSWERED')}
            className={`cursor-pointer p-3 sm:p-4 rounded-2xl border-2 transition-all ${
              selectedStatus === 'ANSWERED'
                ? 'bg-emerald-300 text-[#06381e] border-emerald-200 shadow-md scale-102 font-black'
                : 'bg-[#1c4930] text-emerald-300 border-[#2f754c] hover:border-emerald-400/60 font-bold'
            }`}
          >
            <span className="text-xs opacity-80 block">답변완료</span>
            <span className="text-2xl font-black mt-1 block">{stats.answered}건</span>
          </div>

          <div
            onClick={() => setSelectedStatus('RESOLVED')}
            className={`cursor-pointer p-3 sm:p-4 rounded-2xl border-2 col-span-2 sm:col-span-1 transition-all ${
              selectedStatus === 'RESOLVED'
                ? 'bg-zinc-200 text-[#27272a] border-zinc-100 shadow-md scale-102 font-black'
                : 'bg-[#1c4930] text-zinc-300 border-[#2f754c] hover:border-zinc-400/60 font-bold'
            }`}
          >
            <span className="text-xs opacity-80 block">해결완료</span>
            <span className="text-2xl font-black mt-1 block">{stats.resolved}건</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs bg-[#173e28] border border-[#31734c] rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:ring-1 focus:ring-yellow-400"
            >
              <option value="ALL">전체 카테고리</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs bg-[#173e28] border border-[#31734c] rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:ring-1 focus:ring-yellow-400"
            >
              <option value="ALL">전체 상태</option>
              <option value="PENDING">접수대기</option>
              <option value="IN_REVIEW">검토중</option>
              <option value="ANSWERED">답변완료</option>
              <option value="RESOLVED">해결완료</option>
            </select>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="제목, 내용, 접수번호 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 bg-[#173e28] border border-[#31734c] rounded-xl text-white placeholder-green-200/50 focus:outline-none focus:ring-1 focus:ring-yellow-400 font-medium"
            />
            <Search className="w-3.5 h-3.5 text-green-300 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Complaints List (Exact style from reference image) */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-sm text-green-200/70 font-bold bg-[#143724] rounded-2xl border border-[#2d6845]">
              해당 조건의 접수 내역이 없습니다.
            </div>
          ) : (
            filtered.map((item, index) => (
              <div
                key={item.id}
                className="p-3.5 sm:p-4 rounded-2xl bg-[#1c4930] border-2 border-[#2f754c] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                {/* Left Number & Title */}
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <span className="font-black text-xl text-yellow-400 w-6 sm:w-8 text-center flex-shrink-0 pt-0.5 sm:pt-0">
                    {index + 1}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#133722] text-green-200 border border-[#2d6845]">
                        {item.category}
                      </span>
                      <span className="font-mono text-[11px] text-green-300/70">
                        {item.trackingCode}
                      </span>
                      {item.isSecret && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-yellow-300 bg-[#133521] px-1.5 py-0.5 rounded border border-yellow-500/40">
                          <Lock className="w-2.5 h-2.5" />
                          비밀글 (관리자 열람가능)
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/complaints/${item.id}`}
                      className="mt-1 block font-bold text-white hover:text-yellow-200 text-sm sm:text-base truncate"
                    >
                      {item.title}
                    </Link>

                    <p className="text-xs text-green-200/70 line-clamp-1 mt-0.5 font-medium">
                      {item.content}
                    </p>

                    <div className="mt-1 text-[11px] text-green-200/50 flex items-center gap-3">
                      <span>작성자: {item.authorNickname}</span>
                      <span>{item.createdAt}</span>
                      <span>조회 {item.viewCount}</span>
                    </div>
                  </div>
                </div>

                {/* Right Status & Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                  <select
                    value={item.status}
                    onChange={(e) => handleQuickStatusChange(item.id, e.target.value)}
                    className="text-xs font-black px-2.5 py-1.5 rounded-xl border border-[#3b8558] bg-[#143724] text-white focus:outline-none focus:ring-1 focus:ring-yellow-400"
                  >
                    <option value="PENDING">접수대기</option>
                    <option value="IN_REVIEW">검토중</option>
                    <option value="ANSWERED">답변완료</option>
                    <option value="RESOLVED">해결완료</option>
                  </select>

                  <Link
                    href={`/complaints/${item.id}`}
                    className="px-3 py-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-[#3d2402] text-xs font-black shadow transition-transform active:scale-95"
                  >
                    답변하기
                  </Link>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-xl text-green-300 hover:text-rose-300 hover:bg-rose-950/60 transition-colors"
                    title="삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </ChalkboardFrame>
  );
}
