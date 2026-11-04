'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CATEGORIES } from '@/lib/constants';
import StatusBadge from './StatusBadge';
import ChalkboardFrame from './ChalkboardFrame';
import {
  Lock,
  Search,
  MessageSquare,
  Eye,
  KeyRound,
  X,
  FileQuestion,
  ArrowRight,
  PlusCircle,
  Sparkles,
} from 'lucide-react';
import { verifyComplaintPasswordAction } from '@/actions/complaintActions';

export interface ComplaintListItem {
  id: string;
  trackingCode: string;
  title: string;
  category: string;
  status: string;
  isSecret: boolean;
  authorNickname: string;
  viewCount: number;
  commentsCount: number;
  createdAt: string;
}

export default function ComplaintTable({
  initialComplaints,
}: {
  initialComplaints: ComplaintListItem[];
}) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [trackingLookup, setTrackingLookup] = useState<string>('');

  // Password Modal state for secret post
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [targetPost, setTargetPost] = useState<ComplaintListItem | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Filtered complaints
  const filteredComplaints = useMemo(() => {
    return initialComplaints.filter((item) => {
      // Category filter
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'ALL' && item.status !== selectedStatus) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchTracking = item.trackingCode.toLowerCase().includes(query);
        const matchNickname = item.authorNickname.toLowerCase().includes(query);
        if (!matchTitle && !matchTracking && !matchNickname) {
          return false;
        }
      }
      return true;
    });
  }, [initialComplaints, selectedCategory, selectedStatus, searchQuery]);

  const handlePostClick = (complaint: ComplaintListItem, e: React.MouseEvent) => {
    if (complaint.isSecret) {
      const savedToken = sessionStorage.getItem(`unlocked_${complaint.id}`);
      if (!savedToken) {
        e.preventDefault();
        setTargetPost(complaint);
        setPasswordInput('');
        setPasswordError('');
        setIsPasswordModalOpen(true);
      }
    }
  };

  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPost || !passwordInput.trim()) return;

    setIsVerifying(true);
    setPasswordError('');

    try {
      const res = await verifyComplaintPasswordAction(targetPost.id, passwordInput);
      if (res.success && res.token) {
        sessionStorage.setItem(`unlocked_${targetPost.id}`, res.token);
        setIsPasswordModalOpen(false);
        router.push(`/complaints/${targetPost.id}?token=${res.token}`);
      } else {
        setPasswordError(res.error || '비밀번호가 올바르지 않습니다.');
      }
    } catch {
      setPasswordError('인증 중 오류가 발생했습니다.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleTrackingSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = trackingLookup.trim().toUpperCase();
    if (!query) return;

    const matched = initialComplaints.find(
      (c) => c.trackingCode.toUpperCase() === query
    );

    if (matched) {
      if (matched.isSecret) {
        setTargetPost(matched);
        setPasswordInput('');
        setPasswordError('');
        setIsPasswordModalOpen(true);
      } else {
        router.push(`/complaints/${matched.id}`);
      }
    } else {
      alert(`접수번호 [${query}]에 해당하는 게시글을 찾을 수 없습니다.`);
    }
  };

  return (
    <ChalkboardFrame
      title="우리들의 익명 소리함"
      subtitle="규칙을 지키고 서로 배려하며 따뜻한 의견을 나눠주세요 ✨"
      showMascots={true}
    >
      {/* Search & Fast Tracking Code Bar */}
      <div className="bg-[#1b462e]/90 p-3 sm:p-4 rounded-2xl border border-[#31734c] shadow-inner space-y-3">
        {/* Quick Tracking Search Form */}
        <form onSubmit={handleTrackingSearch} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="내 접수번호로 바로 조회 (예: CMP-2611-1234)"
              value={trackingLookup}
              onChange={(e) => setTrackingLookup(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#143724] text-white placeholder-green-200/50 border border-[#347950] focus:outline-none focus:ring-2 focus:ring-yellow-400 text-xs sm:text-sm font-medium"
            />
            <Search className="w-4 h-4 text-green-300 absolute left-3 top-2.5" />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-[#3d2402] font-black text-xs sm:text-sm transition-transform active:scale-95 shadow flex items-center justify-center gap-1"
          >
            <span>접수조회</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'ALL'
                ? 'bg-yellow-400 text-[#3d2402] shadow'
                : 'bg-[#153a25] text-green-100 hover:bg-[#1a442c] border border-[#2c6543]'
            }`}
          >
            전체 ({initialComplaints.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = initialComplaints.filter((c) => c.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-yellow-400 text-[#3d2402] shadow'
                    : 'bg-[#153a25] text-green-100 hover:bg-[#1a442c] border border-[#2c6543]'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-filter row: Status filter & keyword search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 px-1">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-green-200">진행 상태:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs bg-[#173e28] border border-[#31734c] rounded-lg px-2.5 py-1.5 font-bold text-white focus:outline-none focus:ring-1 focus:ring-yellow-400"
          >
            <option value="ALL">전체 상태 보기</option>
            <option value="PENDING">접수대기</option>
            <option value="IN_REVIEW">검토중</option>
            <option value="ANSWERED">답변완료</option>
            <option value="RESOLVED">해결완료</option>
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="제목, 닉네임 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-1.5 bg-[#173e28] border border-[#31734c] rounded-xl text-white placeholder-green-200/50 focus:outline-none focus:ring-1 focus:ring-yellow-400"
          />
          <Search className="w-3.5 h-3.5 text-green-300 absolute left-2.5 top-2" />
        </div>
      </div>

      {/* Chalkboard Complaint Items (Exact style as reference image) */}
      <div className="space-y-3">
        {filteredComplaints.length === 0 ? (
          <div className="py-12 text-center bg-[#1b462e]/60 rounded-2xl border border-[#31734c] space-y-3">
            <FileQuestion className="w-10 h-10 text-green-300/60 mx-auto" />
            <p className="text-sm font-bold text-green-100">
              등록된 불만/건의 내역이 없습니다.
            </p>
            <Link
              href="/complaints/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-[#3d2402] text-xs font-black shadow transition-transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>첫 번째 소리 남기기</span>
            </Link>
          </div>
        ) : (
          filteredComplaints.map((item, index) => (
            <Link
              key={item.id}
              href={`/complaints/${item.id}`}
              onClick={(e) => handlePostClick(item, e)}
              className="group block p-3.5 sm:p-4 rounded-2xl bg-[#1c4930] hover:bg-[#183e29] border-2 border-[#2e6d48] hover:border-yellow-400/80 transition-all shadow-md active:scale-[0.99]"
            >
              <div className="flex items-center justify-between gap-3">
                {/* Left Number & Title */}
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  {/* Number - Yellow/Gold font as in image */}
                  <span className="font-black text-xl sm:text-2xl text-yellow-400 w-6 sm:w-8 text-center flex-shrink-0 drop-shadow-sm">
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
                    </div>

                    <div className="mt-1 flex items-center gap-2">
                      {item.isSecret ? (
                        <>
                          <span className="inline-flex items-center gap-1 text-yellow-300 font-black text-xs sm:text-sm bg-[#133521] px-2 py-0.5 rounded-md border border-yellow-500/40">
                            <Lock className="w-3 h-3 text-yellow-400" />
                            <span>비밀글</span>
                          </span>
                          <span className="text-sm sm:text-base font-bold text-green-100/90 truncate">
                            비밀글로 보호된 게시글입니다.
                          </span>
                        </>
                      ) : (
                        <h2 className="text-sm sm:text-base font-bold text-white group-hover:text-yellow-200 transition-colors truncate">
                          {item.title}
                        </h2>
                      )}

                      {/* Comments Badge */}
                      {item.commentsCount > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs font-black text-yellow-300 bg-[#143924] px-2 py-0.5 rounded-full border border-yellow-400/40">
                          <MessageSquare className="w-3 h-3" />
                          {item.commentsCount}
                        </span>
                      )}
                    </div>

                    <div className="mt-1 text-[11px] text-green-200/60 flex items-center gap-3">
                      <span>작성자: {item.authorNickname}</span>
                      <span>{item.createdAt}</span>
                      <span>조회 {item.viewCount}</span>
                    </div>
                  </div>
                </div>

                {/* Right Status Badge */}
                <div className="flex-shrink-0 pl-2">
                  <StatusBadge status={item.status} />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Secret Post Password Verification Modal */}
      {isPasswordModalOpen && targetPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-[#24583b] text-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border-4 border-[#5a3825] space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-[#31734c]">
              <div className="flex items-center gap-2 font-black text-lg text-white">
                <div className="w-8 h-8 rounded-xl bg-yellow-400 flex items-center justify-center text-[#3d2402]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <span>비밀글 열람 인증</span>
              </div>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-green-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-green-100 leading-relaxed font-medium">
              작성 시 설정한 <span className="font-black text-yellow-300">비밀번호</span>를 입력하시면 글 내용과 대화 스레드를 확인하실 수 있습니다.
            </p>

            <form onSubmit={handleVerifyPassword} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="비밀번호 입력 (4자리 이상)"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  autoFocus
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#3f885d] bg-[#143724] text-white placeholder-green-300/40 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                {passwordError && (
                  <p className="mt-1.5 text-xs text-rose-300 font-bold">{passwordError}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-green-200 hover:bg-[#1a442c]"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="px-5 py-2 rounded-xl text-xs font-black bg-yellow-400 hover:bg-yellow-300 text-[#3d2402] shadow transition-transform active:scale-95 disabled:opacity-50"
                >
                  {isVerifying ? '확인 중...' : '확인'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ChalkboardFrame>
  );
}
