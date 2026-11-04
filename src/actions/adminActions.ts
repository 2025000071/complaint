'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { setAdminSession, clearAdminSession, getAdminSession } from '@/lib/adminAuth';
import { redirect } from 'next/navigation';

export async function adminLoginAction(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { success: false, error: '아이디와 비밀번호를 모두 입력해주세요.' };
  }

  const admin = await prisma.adminUser.findUnique({
    where: { username: username.trim() },
  });

  if (!admin) {
    return { success: false, error: '아이디 또는 비밀번호가 올바르지 않습니다.' };
  }

  const isMatch = await bcrypt.compare(password.trim(), admin.passwordHash);
  if (!isMatch) {
    return { success: false, error: '아이디 또는 비밀번호가 올바르지 않습니다.' };
  }

  await setAdminSession(admin.username);
  return { success: true };
}

export async function adminLogoutAction() {
  await clearAdminSession();
  redirect('/admin/login');
}

export async function checkAdminStatus() {
  const session = await getAdminSession();
  return { isAdmin: Boolean(session), username: session?.username };
}

