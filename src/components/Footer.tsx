import { ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t-2 border-[#d8caba] bg-[#efe7db] py-6 text-[#786453] text-xs">
      <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-1.5 justify-center">
          <ShieldCheck className="w-4 h-4 text-[#276241]" />
          <span>개인 식별 정보(IP, 연락처, 기기정보)는 일체 수집되지 않는 100% 안심 익명 공간입니다.</span>
        </div>
        <div className="flex items-center gap-1 text-[#a08977] justify-center">
          <span>마음 따뜻한 소통</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>익명 소리함</span>
        </div>
      </div>
    </footer>
  );
}
