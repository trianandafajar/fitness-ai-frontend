import { Utensils } from "lucide-react";
import type { EnrichedFood } from "@/services/ai-analysis.service";

interface Props {
  item: EnrichedFood;
}

export default function AiMealCard({ item }: Props) {
  const fd = item.food;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3">
      {fd?.image ? (
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface">
          <img
            src={fd.image}
            alt={fd.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-orange-tint">
          <Utensils className="h-6 w-6 text-orange-deep" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="text-[13.5px] font-semibold text-ink">
          {fd?.name ?? item.text}
        </div>
        {fd && (
          <div className="mt-0.5 flex flex-wrap gap-1.5">
            {fd.calories_per_100g && (
              <span className="rounded-md bg-surface px-2 py-0.5 text-[11px] font-medium text-ink-soft">
                {fd.calories_per_100g} kcal/100g
              </span>
            )}
            {fd.category && (
              <span className="rounded-md bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-600">
                {fd.category}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
