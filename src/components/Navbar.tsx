'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, PlusCircle, LayoutList, Lock, UserCheck } from 'lucide-react';

export default function Navbar({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-[#f4eee5]/90 backdrop-blur-md border-b-2 border-[#d6c7b2] transition-colors">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Logo with Chalkboard badge */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-[#276241] border-2 border-[#5a3825] flex items-center justify-center text-yellow-300 shadow-md group-hover:rotate-6 transition-transform">
            <Sparkles className="w-5 h-5 fill-yellow-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl text-[#3b271a] tracking-tight">
                우리들의 소리함
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#e3d5be] text-[#5c3e29] border border-[#cfbe9f]">
                익명 안심 게시판
              </span>
            </div>
            <p className="text-xs text-[#7d6756] hidden sm:block">
              서로를 배려하며 솔직한 이야기를 나눠요 ✨
            </p>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/boards"
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              pathname.startsWith('/boards')
                ? 'bg-[#276241] text-white shadow-sm'
                : 'text-[#5c3e29] hover:bg-[#eadecc]'
            }`}
          >
            <LayoutList className="w-4 h-4" />
            <span>쇼핑몰 게시판</span>
          </Link>

          <Link
            href="/complaints"
            className={`hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              pathname.startsWith('/complaints')
                ? 'bg-[#276241] text-white shadow-sm'
                : 'text-[#5c3e29] hover:bg-[#eadecc]'
            }`}
          >
            <span>익명 소리함</span>
          </Link>

          <Link
            href="/boards/inquiry/new"
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#f59e0b] hover:bg-[#d97706] text-[#3e2102] shadow-md shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
            aria-label="문의 작성"
          >
            <PlusCircle className="w-4 h-4" />
            <span>글쓰기</span>
          </Link>

          <div className="h-4 w-0.5 bg-[#d6c7b2] mx-1" />

          {isAdmin ? (
            <Link
              href="/admin"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
                pathname.startsWith('/admin')
                  ? 'bg-[#5a3825] text-yellow-300 shadow'
                  : 'text-[#5a3825] hover:bg-[#eadecc]'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>관리자 모드</span>
            </Link>
          ) : (
            <Link
              href="/admin/login"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#8b7362] hover:text-[#5a3825] hover:bg-[#eadecc] transition-colors"
              title="관리자 로그인"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>관리자</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
