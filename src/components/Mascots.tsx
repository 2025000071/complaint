export default function Mascots({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-end justify-center gap-1 sm:gap-2 select-none pointer-events-none relative ${className}`}>
      {/* Little Sparkles */}
      <div className="absolute -top-4 left-1/4 text-yellow-300 text-xs sm:text-sm animate-pulse">✦</div>
      <div className="absolute -top-6 left-1/2 text-yellow-300 text-xs sm:text-base animate-pulse delay-100">✧</div>
      <div className="absolute -top-3 right-1/4 text-yellow-300 text-xs sm:text-sm animate-pulse delay-200">✦</div>
      <div className="absolute -top-5 right-1/3 text-yellow-200 text-xs">⋆</div>

      {/* 1. Orange-Red Buddy */}
      <svg
        viewBox="0 0 100 130"
        className="w-16 h-20 sm:w-20 sm:h-24 drop-shadow-md transition-transform hover:scale-110"
      >
        {/* Left Arm up */}
        <path d="M 28 65 Q 12 50 16 38" stroke="#1e293b" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        {/* Right Arm holding hands */}
        <path d="M 72 68 Q 88 64 96 68" stroke="#1e293b" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        {/* Legs & Shoes */}
        <path d="M 40 98 L 40 115" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M 60 98 L 60 115" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />
        <ellipse cx="36" cy="116" rx="9" ry="4.5" fill="#f97316" stroke="#1e293b" strokeWidth="3" />
        <ellipse cx="64" cy="116" rx="9" ry="4.5" fill="#f97316" stroke="#1e293b" strokeWidth="3" />
        {/* Body */}
        <ellipse cx="50" cy="70" rx="30" ry="28" fill="#f97316" stroke="#1e293b" strokeWidth="3.5" />
        {/* Eyes */}
        <circle cx="42" cy="65" r="2.8" fill="#1e293b" />
        <circle cx="58" cy="65" r="2.8" fill="#1e293b" />
        {/* Smile */}
        <path d="M 44 73 Q 50 80 56 73" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Cheeks */}
        <ellipse cx="38" cy="71" rx="3" ry="1.5" fill="#ea580c" opacity="0.6" />
        <ellipse cx="62" cy="71" rx="3" ry="1.5" fill="#ea580c" opacity="0.6" />
      </svg>

      {/* 2. Yellow Buddy */}
      <svg
        viewBox="0 0 100 130"
        className="w-18 h-22 sm:w-22 sm:h-26 drop-shadow-md transition-transform hover:scale-110"
      >
        {/* Arms holding hands */}
        <path d="M 22 68 Q 8 64 2 68" stroke="#1e293b" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M 78 68 Q 92 64 98 68" stroke="#1e293b" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        {/* Legs & Shoes */}
        <path d="M 40 98 L 40 115" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M 60 98 L 60 115" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />
        <ellipse cx="36" cy="116" rx="9" ry="4.5" fill="#eab308" stroke="#1e293b" strokeWidth="3" />
        <ellipse cx="64" cy="116" rx="9" ry="4.5" fill="#eab308" stroke="#1e293b" strokeWidth="3" />
        {/* Body */}
        <ellipse cx="50" cy="68" rx="32" ry="30" fill="#facc15" stroke="#1e293b" strokeWidth="3.5" />
        {/* Eyes */}
        <circle cx="41" cy="63" r="2.8" fill="#1e293b" />
        <circle cx="59" cy="63" r="2.8" fill="#1e293b" />
        {/* Smile */}
        <path d="M 43 71 Q 50 80 57 71" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Cheeks */}
        <ellipse cx="36" cy="69" rx="3.5" ry="2" fill="#ca8a04" opacity="0.4" />
        <ellipse cx="64" cy="69" rx="3.5" ry="2" fill="#ca8a04" opacity="0.4" />
      </svg>

      {/* 3. Green Buddy */}
      <svg
        viewBox="0 0 100 130"
        className="w-16 h-20 sm:w-20 sm:h-24 drop-shadow-md transition-transform hover:scale-110"
      >
        {/* Arms holding hands */}
        <path d="M 22 68 Q 8 64 2 68" stroke="#1e293b" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M 78 68 Q 92 64 98 68" stroke="#1e293b" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        {/* Legs & Shoes */}
        <path d="M 40 98 L 40 115" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M 60 98 L 60 115" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />
        <ellipse cx="36" cy="116" rx="9" ry="4.5" fill="#22c55e" stroke="#1e293b" strokeWidth="3" />
        <ellipse cx="64" cy="116" rx="9" ry="4.5" fill="#22c55e" stroke="#1e293b" strokeWidth="3" />
        {/* Body */}
        <ellipse cx="50" cy="70" rx="30" ry="28" fill="#4ade80" stroke="#1e293b" strokeWidth="3.5" />
        {/* Eyes */}
        <circle cx="42" cy="65" r="2.8" fill="#1e293b" />
        <circle cx="58" cy="65" r="2.8" fill="#1e293b" />
        {/* Cute Wide Smile */}
        <path d="M 43 72 Q 50 81 57 72" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Cheeks */}
        <ellipse cx="37" cy="71" rx="3" ry="1.5" fill="#16a34a" opacity="0.5" />
        <ellipse cx="63" cy="71" rx="3" ry="1.5" fill="#16a34a" opacity="0.5" />
      </svg>

      {/* 4. Blue Buddy */}
      <svg
        viewBox="0 0 100 130"
        className="w-18 h-22 sm:w-22 sm:h-26 drop-shadow-md transition-transform hover:scale-110"
      >
        {/* Left Arm holding hands */}
        <path d="M 22 68 Q 8 64 2 68" stroke="#1e293b" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        {/* Right Arm up celebrating */}
        <path d="M 72 65 Q 88 50 84 38" stroke="#1e293b" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        {/* Legs & Shoes */}
        <path d="M 40 98 L 40 115" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M 60 98 L 60 115" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />
        <ellipse cx="36" cy="116" rx="9" ry="4.5" fill="#38bdf8" stroke="#1e293b" strokeWidth="3" />
        <ellipse cx="64" cy="116" rx="9" ry="4.5" fill="#38bdf8" stroke="#1e293b" strokeWidth="3" />
        {/* Body */}
        <ellipse cx="50" cy="70" rx="32" ry="30" fill="#7dd3fc" stroke="#1e293b" strokeWidth="3.5" />
        {/* Eyes */}
        <circle cx="41" cy="65" r="2.8" fill="#1e293b" />
        <circle cx="59" cy="65" r="2.8" fill="#1e293b" />
        {/* Smile */}
        <path d="M 43 73 Q 50 81 57 73" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Cheeks */}
        <ellipse cx="36" cy="71" rx="3.5" ry="2" fill="#0284c7" opacity="0.4" />
        <ellipse cx="64" cy="71" rx="3.5" ry="2" fill="#0284c7" opacity="0.4" />
      </svg>
    </div>
  );
}

