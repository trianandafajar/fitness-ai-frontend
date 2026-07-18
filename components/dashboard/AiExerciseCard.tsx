import { Dumbbell } from "lucide-react";
import type { EnrichedExercise } from "@/services/ai-analysis.service";

interface Props {
  item: EnrichedExercise;
}

export default function AiExerciseCard({ item }: Props) {
  const ex = item.exercise;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3">
      {ex?.image ? (
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface">
          <img
            src={ex.image}
            alt={ex.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-orange-tint">
          <Dumbbell className="h-6 w-6 text-orange-deep" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="text-[13.5px] font-semibold text-ink">
          {ex?.name ?? item.text}
        </div>
        {ex && (
          <div className="mt-0.5 flex flex-wrap gap-1.5">
            {ex.equipment && (
              <span className="rounded-md bg-surface px-2 py-0.5 text-[11px] font-medium text-ink-soft">
                {ex.equipment}
              </span>
            )}
            {ex.target_muscles?.map((m) => (
              <span
                key={m}
                className="rounded-md bg-orange-tint px-2 py-0.5 text-[11px] font-medium text-orange-deep"
              >
                {m}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
