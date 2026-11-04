import { cookies } from 'next/headers';
import crypto from 'crypto';

const SECRET_KEY = process.env.ADMIN_SESSION_SECRET || 'complaint-board-super-secure-key-2026';
const COOKIE_NAME = 'admin_session';

export function signPayload(payload: string): string {
  const hmac = crypto.createHmac('sha256', SECRET_KEY);
  hmac.update(payload);
  const signature = hmac.digest('hex');
  return `${payload}.${signature}`;
}

export function verifySignedPayload(token: string): string | null {
  try {
    const lastDotIndex = token.lastIndexOf('.');
    if (lastDotIndex === -1) return null;
    const payload = token.substring(0, lastDotIndex);
    const signature = token.substring(lastDotIndex + 1);

    const expected = crypto.createHmac('sha256', SECRET_KEY).update(payload).digest('hex');
    if (signature.length !== expected.length) return null;

    const match = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
    return match ? payload : null;
  } catch {
    return null;
  }
}

export async function setAdminSession(username: string) {
  const cookieStore = await cookies();
  const payload = JSON.stringify({ username, loggedAt: Date.now() });
  const token = signPayload(payload);

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function getAdminSession(): Promise<{ username: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verifySignedPayload(token);
  if (!payload) return null;

  try {
    const data = JSON.parse(payload);
    return { username: data.username };
  } catch {
    return null;
  }
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export function createUnlockedToken(complaintId: string): string {
  const payload = `unlocked_${complaintId}_${Date.now()}`;
  return signPayload(payload);
}

export function verifyUnlockedToken(complaintId: string, token: string): boolean {
  const payload = verifySignedPayload(token);
  if (!payload) return false;
  return payload.startsWith(`unlocked_${complaintId}_`);
}

