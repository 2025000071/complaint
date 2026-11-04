'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminLoginAction } from '@/actions/adminActions';
import ChalkboardFrame from '@/components/ChalkboardFrame';
import { Lock, User, ArrowLeft, AlertTriangle, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await adminLoginAction(formData);
      if (res.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setErrorMessage(res.error || '로그인에 실패했습니다.');
      }
    } catch {
      setErrorMessage('로그인 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChalkboardFrame
      title="운영 관리자 로그인"
      subtitle="소리함 관리 및 공식 답변 작성을 위한 관리자 포털입니다 ✨"
      showMascots={true}
    >
      <div className="max-w-md mx-auto bg-[#1c4930] border-2 border-[#2f754c] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-yellow-400 text-[#3d2402] flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black text-white">
            관리자 계정으로 접속해주세요
          </h2>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-900/60 border border-rose-500 rounded-xl text-xs text-rose-200 flex items-center gap-2 font-bold">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-yellow-300 mb-1.5">
              관리자 아이디
            </label>
            <div className="relative">
              <input
                type="text"
                name="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="아이디"
                className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-[#3b8558] bg-[#143724] text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold"
              />
              <User className="w-4 h-4 text-green-300 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-yellow-300 mb-1.5">
              비밀번호
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호"
                autoFocus
                className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-[#3b8558] bg-[#143724] text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold"
              />
              <Lock className="w-4 h-4 text-green-300 absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#143724] border border-[#2d6845] text-[11px] text-green-100 font-medium">
            <span className="font-bold text-yellow-300 block mb-0.5">테스트용 기본 관리자 계정:</span>
            아이디: <code className="font-mono font-bold text-white">admin</code> / 비밀번호:{' '}
            <code className="font-mono font-bold text-white">admin1234!</code>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-[#3d2402] font-black text-sm transition-transform active:scale-95 shadow disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 fill-[#3d2402]" />
            <span>{isLoading ? '인증 중...' : '관리자 로그인'}</span>
          </button>
        </form>

        <div className="text-center pt-2">
          <Link
            href="/"
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
