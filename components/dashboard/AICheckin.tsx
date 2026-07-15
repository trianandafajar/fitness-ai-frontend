export default function AICheckin({ message }: { message: string }) {
  return (
    <div className="relative mb-5 flex items-start gap-3.5 overflow-hidden rounded-2xl bg-orange-tint px-5 py-[18px]">
      <div className="relative flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full bg-orange">
        <span className="absolute inset-0 animate-ping rounded-full bg-orange opacity-60" />
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="relative z-10">
          <path
            d="M3 12h4l2-7 4 14 2-7h6"
            stroke="white"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="relative z-10">
        <div className="mb-[5px] text-[11.5px] font-bold uppercase tracking-wide text-orange-deep">
          AI Check-in
        </div>
        <div className="text-sm leading-relaxed text-ink">{message}</div>
      </div>
    </div>
  );
}
