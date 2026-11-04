export const CATEGORIES = [
  '시설/환경',
  '서비스/친절',
  '제도/규정',
  '건의사항',
  '기타',
] as const;

export type Category = (typeof CATEGORIES)[number];

export const STATUS_MAP: Record<
  string,
  { label: string; color: string; badgeClass: string; bgClass: string }
> = {
  PENDING: {
    label: '접수대기',
    color: '#d97706',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
    bgClass: 'bg-amber-500',
  },
  IN_REVIEW: {
    label: '검토중',
    color: '#2563eb',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
    bgClass: 'bg-blue-500',
  },
  ANSWERED: {
    label: '답변완료',
    color: '#059669',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
    bgClass: 'bg-emerald-500',
  },
  RESOLVED: {
    label: '해결완료',
    color: '#6b7280',
    badgeClass: 'bg-zinc-100 text-zinc-800 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
    bgClass: 'bg-zinc-500',
  },
};

export function generateTrackingCode(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const randomStr = Math.floor(1000 + Math.random() * 9000).toString();
  return `CMP-${yy}${mm}-${randomStr}`;
}

