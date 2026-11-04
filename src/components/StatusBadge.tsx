export default function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'PENDING':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black bg-amber-400 text-[#452703] shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#452703] mr-1.5 animate-pulse" />
          접수대기
        </span>
      );
    case 'IN_REVIEW':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black bg-sky-300 text-[#0c3652] shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0c3652] mr-1.5" />
          검토중
        </span>
      );
    case 'ANSWERED':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black bg-emerald-300 text-[#06381e] shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#06381e] mr-1.5" />
          답변완료
        </span>
      );
    case 'RESOLVED':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black bg-zinc-200 text-[#27272a] shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#27272a] mr-1.5" />
          해결완료
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-white/20 text-white">
          {status}
        </span>
      );
  }
}
