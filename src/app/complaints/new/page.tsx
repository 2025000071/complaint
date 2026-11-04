'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/constants';
import { createComplaintAction } from '@/actions/complaintActions';
import ChalkboardFrame from '@/components/ChalkboardFrame';
import {
  ShieldCheck,
  Lock,
  Eye,
  KeyRound,
  CheckCircle2,
  Copy,
  ArrowRight,
  List,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

export default function NewComplaintPage() {
  const [category, setCategory] = useState<string>('시설/환경');
  const [title, setTitle] = useState('');
  const [authorNickname, setAuthorNickname] = useState('익명');
  const [content, setContent] = useState('');
  const [isSecret, setIsSecret] = useState(false);
  const [password, setPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successData, setSuccessData] = useState<{
    complaintId: string;
    trackingCode: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (title.trim().length < 2) {
      setErrorMessage('제목을 2자 이상 입력해주세요.');
      return;
    }
    if (content.trim().length < 5) {
      setErrorMessage('내용을 5자 이상 상세히 입력해주세요.');
      return;
    }
    if (password.trim().length < 4) {
      setErrorMessage('비밀번호를 최소 4자 이상 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await createComplaintAction({
        title,
        content,
        category,
        isSecret,
        password,
        authorNickname,
      });

      if (res.success && res.complaintId && res.trackingCode) {
        setSuccessData({
          complaintId: res.complaintId,
          trackingCode: res.trackingCode,
        });
      } else {
        setErrorMessage(res.error || '접수 중 문제가 발생했습니다.');
      }
    } catch {
      setErrorMessage('서버 요청 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyTrackingCode = () => {
    if (!successData) return;
    navigator.clipboard.writeText(successData.trackingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (successData) {
    return (
      <ChalkboardFrame
        title="접수가 완료되었습니다!"
        subtitle="여러분의 소중한 의견이 안전하게 등록되었습니다 ✨"
        showMascots={true}
      >
        <div className="bg-[#1b462e] border-2 border-[#31734c] rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-lg">
          <div className="w-16 h-16 rounded-3xl bg-yellow-400 text-[#3d2402] flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              소리함에 불만/건의가 잘 도착했어요!
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-green-100/90 leading-relaxed font-medium">
              담당자가 확인 후 정성껏 답변을 남겨드릴게요. 발급된 접수번호를 보관하시면 언제든 진행 상황을 확인하고 대화를 나눌 수 있습니다.
            </p>
          </div>

          {/* Tracking Code Box */}
          <div className="bg-[#143724] border-2 border-[#388256] rounded-2xl p-4 sm:p-5 text-left">
            <span className="text-[11px] font-bold text-yellow-300 uppercase tracking-wider block mb-1">
              발급된 고유 접수번호
            </span>
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-xl sm:text-2xl font-black text-white">
                {successData.trackingCode}
              </span>
              <button
                onClick={copyTrackingCode}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black bg-yellow-400 hover:bg-yellow-300 text-[#3d2402] transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? '복사 완료!' : '접수번호 복사'}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href={`/complaints/${successData.complaintId}`}
              className="flex-1 py-3 px-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-[#3d2402] font-black text-sm transition-transform active:scale-95 shadow flex items-center justify-center gap-1.5"
            >
              <span>내 글 바로 확인하기</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/complaints"
              className="flex-1 py-3 px-4 rounded-xl bg-[#143724] hover:bg-[#102d1d] text-green-100 font-bold text-sm border border-[#2d6845] transition-colors flex items-center justify-center gap-1.5"
            >
              <List className="w-4 h-4" />
              <span>게시판으로 돌아가기</span>
            </Link>
          </div>
        </div>
      </ChalkboardFrame>
    );
  }

  return (
    <ChalkboardFrame
      title="소리함에 이야기 남기기"
      subtitle="신원 노출 걱정 없이 솔직한 생각과 건의를 나눠주세요 🌿"
      showMascots={true}
    >
      {/* Notice Card */}
      <div className="bg-[#1b462e] border border-[#31734c] rounded-2xl p-4 flex gap-3 text-xs text-green-100 leading-relaxed">
        <ShieldCheck className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-yellow-300 block mb-0.5">안심 익명 보장</span>
          작성자의 IP 주소나 기기 정보는 전혀 수집되지 않습니다. 본문 내용에 본인을 특정할 수 있는 이름이나 연락처가 들어가지 않도록 주의해주세요.
        </div>
      </div>

      {/* Complaint Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#1c4930] border-2 border-[#2f754c] rounded-3xl p-5 sm:p-7 shadow-md space-y-5"
      >
        {errorMessage && (
          <div className="p-3.5 bg-rose-900/60 border border-rose-500 rounded-xl text-xs text-rose-200 flex items-center gap-2 font-bold">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Category & Nickname */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-yellow-300 mb-1.5">
              분류 (카테고리) <span className="text-rose-400">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-[#377e53] bg-[#143724] text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-yellow-300 mb-1.5">
              표시 닉네임 (선택)
            </label>
            <input
              type="text"
              value={authorNickname}
              onChange={(e) => setAuthorNickname(e.target.value)}
              placeholder="예: 익명, 사이다, 직장인"
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-[#377e53] bg-[#143724] text-white placeholder-green-300/40 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold"
            />
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-black text-yellow-300 mb-1.5">
            제목 <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="불만 또는 건의 내용을 요약하여 작성해주세요"
            className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-[#377e53] bg-[#143724] text-white placeholder-green-300/40 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-xs font-black text-yellow-300 mb-1.5">
            상세 내용 <span className="text-rose-400">*</span>
          </label>
          <textarea
            required
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="불편했던 상황이나 개선 희망 사항을 솔직하고 구체적으로 적어주세요."
            className="w-full text-sm p-3.5 rounded-xl border border-[#377e53] bg-[#143724] text-white placeholder-green-300/40 focus:outline-none focus:ring-2 focus:ring-yellow-400 leading-relaxed resize-y font-medium"
          />
        </div>

        {/* Mixed visibility option: Secret vs Public */}
        <div className="p-4 rounded-2xl border-2 border-[#31734c] bg-[#143724]/90 space-y-2">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isSecret}
              onChange={(e) => setIsSecret(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-yellow-500 focus:ring-yellow-400 border-[#3f885d] bg-[#0f2a1b]"
            />
            <div>
              <div className="flex items-center gap-1.5 text-sm font-black text-white">
                {isSecret ? (
                  <Lock className="w-4 h-4 text-yellow-400" />
                ) : (
                  <Eye className="w-4 h-4 text-emerald-300" />
                )}
                <span>비밀글로 등록하기</span>
              </div>
              <p className="text-xs text-green-200/80 mt-0.5">
                {isSecret
                  ? '🔒 비밀글: 관리자와 본인(비밀번호 입력)만 내용을 열람할 수 있습니다.'
                  : '🌐 공개글: 다른 이용자도 게시판에서 글을 보고 함께 공감할 수 있습니다.'}
              </p>
            </div>
          </label>
        </div>

        {/* Password Setup */}
        <div>
          <label className="block text-xs font-black text-yellow-300 mb-1.5">
            게시글 비밀번호 설정 <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="4자리 이상 입력 (비밀번호는 반드시 기억해주세요)"
              className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-[#377e53] bg-[#143724] text-white placeholder-green-300/40 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold"
            />
            <KeyRound className="w-4 h-4 text-green-300 absolute left-3.5 top-3" />
          </div>
          <p className="mt-1.5 text-[11px] text-green-200/70">
            비밀글 열람, 답변 후 추가 대화 작성, 글 삭제 시 사용됩니다.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <Link
            href="/complaints"
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-green-200 hover:bg-[#143724] transition-colors"
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black bg-yellow-400 hover:bg-yellow-300 text-[#3d2402] shadow-md transition-transform active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 fill-[#3d2402]" />
            <span>{isSubmitting ? '접수 등록 중...' : '소리함에 등록하기'}</span>
          </button>
        </div>
      </form>
    </ChalkboardFrame>
  );
}
