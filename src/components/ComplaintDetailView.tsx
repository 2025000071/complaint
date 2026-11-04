'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import StatusBadge from './StatusBadge';
import ChalkboardFrame from './ChalkboardFrame';
import {
  Lock,
  Calendar,
  Eye,
  MessageSquare,
  Send,
  Trash2,
  KeyRound,
  ShieldCheck,
  User,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import {
  addCommentAction,
  adminUpdateStatusAction,
  deleteComplaintAction,
  verifyComplaintPasswordAction,
} from '@/actions/complaintActions';

export interface CommentItem {
  id: string;
  senderType: string;
  senderName: string;
  content: string;
  createdAt: string;
}

export interface ComplaintDetailData {
  id: string;
  trackingCode: string;
  title: string;
  content: string;
  category: string;
  status: string;
  isSecret: boolean;
  authorNickname: string;
  viewCount: number;
  createdAt: string;
  comments: CommentItem[];
}

export default function ComplaintDetailView({
  initialData,
  isAdmin,
  isUnlockedInitially,
}: {
  initialData: ComplaintDetailData;
  isAdmin: boolean;
  isUnlockedInitially: boolean;
}) {
  const router = useRouter();
  const [data, setData] = useState<ComplaintDetailData>(initialData);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(
    !initialData.isSecret || isAdmin || isUnlockedInitially
  );

  // Unlock password state
  const [unlockPassword, setUnlockPassword] = useState('');
  const [unlockError, setUnlockError] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockedToken, setUnlockedToken] = useState<string>('');

  // Comment input state
  const [commentText, setCommentText] = useState('');
  const [authorPasswordInput, setAuthorPasswordInput] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState('');

  // Admin status update state
  const [selectedStatus, setSelectedStatus] = useState(initialData.status);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Unlock handler
  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unlockPassword.trim()) return;

    setIsUnlocking(true);
    setUnlockError('');

    try {
      const res = await verifyComplaintPasswordAction(data.id, unlockPassword);
      if (res.success && res.token) {
        setIsUnlocked(true);
        setUnlockedToken(res.token);
        sessionStorage.setItem(`unlocked_${data.id}`, res.token);
      } else {
        setUnlockError(res.error || '비밀번호가 올바르지 않습니다.');
      }
    } catch {
      setUnlockError('인증 중 오류가 발생했습니다.');
    } finally {
      setIsUnlocking(false);
    }
  };

  // Add Comment (Interactive Thread)
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmittingComment(true);
    setCommentError('');

    try {
      const savedToken = unlockedToken || sessionStorage.getItem(`unlocked_${data.id}`) || undefined;

      const res = await addCommentAction({
        complaintId: data.id,
        content: commentText,
        unlockedToken: savedToken,
        authorPassword: authorPasswordInput || unlockPassword || undefined,
      });

      if (res.success) {
        setCommentText('');
        router.refresh();
      } else {
        setCommentError(res.error || '메시지 전송에 실패했습니다.');
      }
    } catch {
      setCommentError('전송 중 오류가 발생했습니다.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Status Change (Admin)
  const handleStatusChange = async (newStatus: string) => {
    setSelectedStatus(newStatus);
    setIsUpdatingStatus(true);
    try {
      const res = await adminUpdateStatusAction(data.id, newStatus);
      if (res.success) {
        setData((prev) => ({ ...prev, status: newStatus }));
        router.refresh();
      }
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Delete
  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeleting(true);
    setDeleteError('');

    try {
      const res = await deleteComplaintAction(data.id, isAdmin ? undefined : deletePassword);
      if (res.success) {
        router.push(isAdmin ? '/admin' : '/complaints');
      } else {
        setDeleteError(res.error || '삭제 중 문제가 발생했습니다.');
      }
    } catch {
      setDeleteError('삭제 요청 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  // If secret and locked
  if (!isUnlocked) {
    return (
      <ChalkboardFrame
        title="비밀글 열람 인증"
        subtitle="작성자 및 관리자만 내용을 확인하실 수 있습니다 🔒"
        showMascots={true}
      >
        <div className="max-w-md mx-auto bg-[#1c4930] border-2 border-[#2f754c] rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-yellow-400 text-[#3d2402] flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-xl font-black text-white">
              비밀글로 보호된 게시글입니다
            </h2>
            <p className="mt-1.5 text-xs text-green-100/80 leading-relaxed font-medium">
              등록 시 설정한 비밀번호를 입력하시면 본문 내용 및 1:1 대화 스레드를 확인하실 수 있습니다.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={unlockPassword}
                onChange={(e) => setUnlockPassword(e.target.value)}
                autoFocus
                required
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-[#3b8558] bg-[#143724] text-white placeholder-green-300/40 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold"
              />
              {unlockError && (
                <p className="mt-1.5 text-xs text-rose-300 font-bold">{unlockError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isUnlocking}
              className="w-full py-2.5 px-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-[#3d2402] font-black text-sm transition-transform active:scale-95 shadow disabled:opacity-50"
            >
              {isUnlocking ? '인증 중...' : '확인'}
            </button>
          </form>

          <div className="pt-2">
            <Link
              href="/complaints"
              className="text-xs text-green-200 hover:text-white inline-flex items-center gap-1 font-bold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>게시판으로 돌아가기</span>
            </Link>
          </div>
        </div>
      </ChalkboardFrame>
    );
  }

  return (
    <ChalkboardFrame
      title="상세 내용 및 대화 나누기"
      subtitle="따뜻한 피드백과 1:1 소통을 통해 문제를 함께 해결해요 ✨"
      showMascots={true}
    >
      {/* Top Navigation & Actions */}
      <div className="flex items-center justify-between text-xs font-bold text-green-100">
        <Link
          href={isAdmin ? '/admin' : '/complaints'}
          className="inline-flex items-center gap-1.5 hover:text-yellow-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isAdmin ? '관리자 대시보드로 돌아가기' : '게시판 목록으로 돌아가기'}</span>
        </Link>

        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="inline-flex items-center gap-1 text-rose-300 hover:text-rose-100 font-bold transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>게시글 삭제</span>
        </button>
      </div>

      {/* Main Complaint Header & Content Card */}
      <div className="bg-[#1c4930] border-2 border-[#2f754c] rounded-3xl p-5 sm:p-7 shadow-md space-y-5">
        {/* Meta badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#2d6845]">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-[#133722] text-green-200 border border-[#2d6845]">
              {data.category}
            </span>
            <span className="font-mono text-xs font-bold text-yellow-300 bg-[#133722] px-2.5 py-1 rounded-lg border border-yellow-400/40">
              {data.trackingCode}
            </span>
            {data.isSecret && (
              <span className="inline-flex items-center gap-1 text-xs font-black text-yellow-300 bg-[#133521] px-2 py-0.5 rounded border border-yellow-500/40">
                <Lock className="w-3 h-3" />
                <span>비밀글</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isAdmin ? (
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-green-200">상태 변경:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={isUpdatingStatus}
                  className="text-xs bg-[#133722] border border-[#3b8558] rounded-lg px-2.5 py-1 font-black text-white focus:outline-none focus:ring-1 focus:ring-yellow-400"
                >
                  <option value="PENDING">접수대기</option>
                  <option value="IN_REVIEW">검토중</option>
                  <option value="ANSWERED">답변완료</option>
                  <option value="RESOLVED">해결완료</option>
                </select>
              </div>
            ) : (
              <StatusBadge status={data.status} />
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white leading-snug">
            {data.title}
          </h1>

          <div className="flex items-center gap-4 mt-2.5 text-xs text-green-200/70 font-medium">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              <span>{data.authorNickname}</span>
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{data.createdAt}</span>
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>조회 {data.viewCount}</span>
            </span>
          </div>
        </div>

        {/* Original Content Body */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#143724] border border-[#2b6644] text-sm sm:text-base leading-relaxed text-green-50 font-medium whitespace-pre-wrap">
          {data.content}
        </div>
      </div>

      {/* Interactive Communication Thread (대화형 스레드) */}
      <div className="bg-[#1c4930] border-2 border-[#2f754c] rounded-3xl p-5 sm:p-7 shadow-md space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#2d6845]">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-yellow-300" />
            <h2 className="text-base sm:text-lg font-black text-white">
              소통 및 답변 스레드 ({data.comments.length})
            </h2>
          </div>
          <span className="text-xs text-green-200/70 font-medium">
            담당자와 1:1로 대화를 주고받을 수 있습니다
          </span>
        </div>

        {/* Comments / Messages List */}
        {data.comments.length === 0 ? (
          <div className="py-6 text-center text-xs sm:text-sm text-green-200/70 space-y-1 font-medium">
            <p>아직 등록된 공식 답변이나 추가 의견이 없습니다.</p>
            <p className="text-[11px] text-green-300/50">
              담당자가 확인 후 곧 따뜻한 답변을 남겨드릴 예정입니다.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {data.comments.map((comment) => {
              const isAdminMsg = comment.senderType === 'ADMIN';

              return (
                <div
                  key={comment.id}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    isAdminMsg
                      ? 'bg-[#183e29] border-yellow-400/60 ml-0 sm:ml-4'
                      : 'bg-[#143724] border-[#2e6d48] mr-0 sm:mr-4'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {isAdminMsg ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-yellow-400 text-[#3d2402] shadow-xs">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{comment.senderName}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#2d6945] text-green-100">
                          <User className="w-3.5 h-3.5" />
                          <span>{comment.senderName}</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-green-300/70 font-mono">
                      {comment.createdAt}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-white leading-relaxed whitespace-pre-wrap font-medium">
                    {comment.content}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Add Message Form */}
        <form onSubmit={handleAddComment} className="pt-4 border-t border-[#2d6845] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-yellow-300">
              {isAdmin ? '운영진 공식 답변 등록' : '작성자 추가 문의 / 의견 작성'}
            </span>
            {isAdmin && (
              <span className="text-[11px] text-yellow-200/80 font-bold">
                * 답변 등록 시 자동으로 &quot;답변완료&quot; 처리됩니다.
              </span>
            )}
          </div>

          <textarea
            rows={3}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
            placeholder={
              isAdmin
                ? '불만에 대한 공식 답변 또는 진행 상황 안내 메시지를 작성해주세요.'
                : '답변에 대한 추가 문의나 보충 의견을 입력해주세요.'
            }
            className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-[#3b8558] bg-[#143724] text-white placeholder-green-300/40 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-y leading-relaxed font-medium"
          />

          {/* Author verification if not admin and no token in session */}
          {!isAdmin && !unlockedToken && !sessionStorage.getItem(`unlocked_${data.id}`) && (
            <div className="flex items-center gap-2">
              <input
                type="password"
                placeholder="게시글 비밀번호 입력"
                value={authorPasswordInput}
                onChange={(e) => setAuthorPasswordInput(e.target.value)}
                required
                className="w-44 text-xs px-3 py-2 rounded-lg border border-[#3b8558] bg-[#143724] text-white placeholder-green-300/40 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold"
              />
              <span className="text-[11px] text-green-200/70">
                작성자 확인을 위해 비밀번호가 필요합니다.
              </span>
            </div>
          )}

          {commentError && (
            <p className="text-xs text-rose-300 font-bold">{commentError}</p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmittingComment}
              className="px-5 py-2 rounded-xl text-xs sm:text-sm font-black bg-yellow-400 hover:bg-yellow-300 text-[#3d2402] shadow transition-transform active:scale-95 flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmittingComment ? '등록 중...' : isAdmin ? '공식 답변 등록' : '추가 의견 보내기'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-[#24583b] text-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border-4 border-[#5a3825] space-y-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-base font-black text-white">
                게시글을 삭제하시겠습니까?
              </h3>
              <p className="mt-1 text-xs text-green-100/80 font-medium">
                삭제된 게시글과 모든 대화 내역은 복구할 수 없습니다.
              </p>
            </div>

            <form onSubmit={handleDelete} className="space-y-4">
              {!isAdmin && (
                <div>
                  <input
                    type="password"
                    placeholder="게시글 비밀번호 입력"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    required
                    autoFocus
                    className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-[#3b8558] bg-[#143724] text-white placeholder-green-300/40 focus:outline-none focus:ring-2 focus:ring-rose-400 font-bold"
                  />
                  {deleteError && (
                    <p className="mt-1 text-xs text-rose-300 font-bold">{deleteError}</p>
                  )}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-green-200 hover:bg-[#1a442c]"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-xl text-xs font-black bg-rose-500 hover:bg-rose-600 text-white shadow transition-transform active:scale-95 disabled:opacity-50"
                >
                  {isDeleting ? '삭제 중...' : '삭제 확인'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ChalkboardFrame>
  );
}
