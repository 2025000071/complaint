import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getAdminSession } from '@/lib/adminAuth';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '우리들의 익명 소리함 - 안심 소통 게시판',
  description: '서로를 배려하며 솔직한 의견을 나누고 담당자와 대화하는 익명 소리함',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminSession();

  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#f4eee5] text-[#2d261e] font-sans selection:bg-yellow-300 selection:text-[#3d2402]">
        <Navbar isAdmin={Boolean(admin)} />
        <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
