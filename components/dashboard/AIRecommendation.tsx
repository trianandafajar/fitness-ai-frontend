export default function AIRecommendation({ message }: { message: string }) {
  return (
    <div className="flex gap-3 items-start rounded-2xl bg-orange-tint p-4">
      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-orange">
        <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
          <path d="M3 12h4l2-7 4 14 2-7h6" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div>
        <div className="mb-0.5 text-[10.5px] font-bold uppercase tracking-wide text-orange-deep">Nutrition Tip</div>
        <div className="text-[12.5px] leading-relaxed text-ink">{message}</div>
      </div>
    </div>
  );
}
