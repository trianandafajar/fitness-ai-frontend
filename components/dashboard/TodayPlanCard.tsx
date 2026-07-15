import { ButtonPrimary, ButtonSecondary } from "@/components/ui/Button";

interface Exercise {
  name: string;
  meta: string;
}

interface TodayPlanCardProps {
  badge: string;
  exercises: Exercise[];
}

export default function TodayPlanCard({ badge, exercises }: TodayPlanCardProps) {
  return (
    <div className="rounded-2xl border border-line bg-white p-[22px]">
      <div className="mb-3.5 flex items-center justify-between">
        <div className="text-[13px] font-bold uppercase tracking-wide text-ink-soft">
          Today's Plan
        </div>
        <span className="rounded-full bg-surface px-2.5 py-1 text-[11.5px] font-semibold text-ink-soft">
          {badge}
        </span>
      </div>

      <div>
        {exercises.map((ex, i) => (
          <div
            key={ex.name}
            className={`flex items-center justify-between py-[11px] ${i !== exercises.length - 1 ? "border-b border-line" : ""
              }`}
          >
            <span className="text-[13.5px] font-semibold text-ink">{ex.name}</span>
            <span className="font-mono text-[12.5px] text-ink-soft">{ex.meta}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2.5">
        <ButtonPrimary type="button" className="flex-1 py-[11px] text-[13.5px]">
          Start Workout
        </ButtonPrimary>
        <ButtonSecondary type="button" className="flex-1 sm:flex-none sm:w-[130px] py-[11px] text-[13.5px]">
          Log Meal
        </ButtonSecondary>
      </div>
    </div>
  );
}
