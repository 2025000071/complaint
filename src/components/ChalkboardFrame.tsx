import Mascots from './Mascots';

export default function ChalkboardFrame({
  title,
  subtitle,
  children,
  showMascots = true,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  showMascots?: boolean;
}) {
  return (
    <div className="w-full max-w-4xl mx-auto py-2 sm:py-6">
      {/* Wooden Hanging Straps */}
      <div className="flex justify-between px-16 sm:px-28 -mb-2 z-0 relative">
        <div className="w-5 sm:w-6 h-8 sm:h-10 bg-[#4d2f1d] rounded-t-md shadow-md border-t-2 border-x-2 border-[#6d462c]" />
        <div className="w-5 sm:w-6 h-8 sm:h-10 bg-[#4d2f1d] rounded-t-md shadow-md border-t-2 border-x-2 border-[#6d462c]" />
      </div>

      {/* Main Wooden Board Frame */}
      <div className="relative z-10 bg-[#5a3825] p-3.5 sm:p-5 rounded-[28px] sm:rounded-[36px] shadow-2xl wood-frame border-2 border-[#432718]">
        {/* Inner Chalkboard Green Area */}
        <div className="chalkboard-bg rounded-[22px] sm:rounded-[28px] p-4 sm:p-8 border-2 border-[#1c472f] shadow-inner text-white min-h-[580px] flex flex-col justify-between">
          <div>
            {/* Chalkboard Title */}
            <div className="text-center pt-2 pb-6">
              <h1 className="text-2xl sm:text-3xl font-black text-white chalk-text-shadow tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1.5 text-xs sm:text-sm text-green-100/90 font-medium tracking-wide">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Content Slot */}
            <div className="space-y-6">{children}</div>
          </div>

          {/* Cute Mascots at bottom if enabled */}
          {showMascots && (
            <div className="pt-8 sm:pt-12">
              <Mascots />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

