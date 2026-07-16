import { Sparkles } from "lucide-react";

export default function AIRecommendation({ message }: { message: string }) {
  return (
    <div className="flex gap-3 items-start rounded-2xl bg-orange-tint p-4">
      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-orange">
        <Sparkles className="h-3.5 w-3.5 text-white" />
      </div>
      <div>
        <div className="mb-0.5 text-[10.5px] font-bold uppercase tracking-wide text-orange-deep">Nutrition Tip</div>
        <div className="text-[12.5px] leading-relaxed text-ink">{message}</div>
      </div>
    </div>
  );
}
