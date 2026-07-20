"use client";

import { useRouter } from "next/navigation";
import { PartyPopper, AlertCircle, Dumbbell, Utensils, Check, Target, Clock, CalendarDays } from "lucide-react";
import { ButtonPrimary } from "@/components/ui/Button";
import type { AiAnalysis } from "./types";

interface Props {
  aiResult: AiAnalysis | null;
  loading: boolean;
  onRetry: () => void;
}

function formatDayLabel(days: string | null): string {
  if (!days) return "";
  const parts = days.split(",").map((d) => d.trim());
  return parts
    .map((d) => d.charAt(0).toUpperCase() + d.slice(1, 3))
    .join(", ");
}

const MEAL_LABELS: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};

export default function StepAnalysis({ aiResult, loading, onRetry }: Props) {
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
        <div className="mb-6 h-14 w-14 animate-spin rounded-full border-4 border-orange-tint border-t-orange" />
        <div className="text-[14.5px] font-medium text-ink-soft">
          AI is analyzing your profile...
        </div>
      </div>
    );
  }

  if (!aiResult) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-orange-tint">
          <AlertCircle className="h-7 w-7 text-orange" />
        </div>
        <h1 className="mb-2 font-display text-[22px] font-bold tracking-tight">
          Analysis unavailable
        </h1>
        <p className="mb-8 text-sm leading-relaxed text-ink-soft">
          The AI analysis is currently unavailable. Your profile has been saved
          and you can retry later.
        </p>
        <div className="flex w-full gap-3">
          <ButtonPrimary type="button" onClick={onRetry} className="flex-1">
            Retry Analysis
          </ButtonPrimary>
          <ButtonPrimary type="button" onClick={() => router.push("/dashboard")} className="flex-1">
            Go to Dashboard
          </ButtonPrimary>
        </div>
      </div>
    );
  }

  const recommendations = Array.isArray(aiResult.recommendations)
    ? aiResult.recommendations
    : [aiResult.recommendations].filter(Boolean);

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-2 text-[12.5px] font-semibold tracking-wide text-orange-deep">DONE</div>
      <h1 className="mb-5 font-display text-[22px] font-bold tracking-tight sm:text-2xl">
        Your profile is ready <PartyPopper className="inline h-5 w-5 text-orange" />
      </h1>

      {/* Summary */}
      <div className="mb-4 flex items-start gap-3 rounded-xl border border-orange/20 bg-orange-tint p-3.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange/15">
          <Target className="h-4 w-4 text-orange-deep" />
        </div>
        <p className="text-[13.5px] leading-relaxed text-ink">{aiResult.summary}</p>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mb-5 space-y-1.5">
          {recommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
              <span className="text-[13px] leading-snug text-ink">{rec}</span>
            </div>
          ))}
        </div>
      )}

      {/* Workout Plan banner */}
      {aiResult.workout_plan && (
        <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-line bg-white p-3.5">
          <CalendarDays className="h-5 w-5 text-orange-deep" />
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wide text-ink-soft">Workout Plan</div>
            <div className="text-[13.5px] font-semibold text-ink">{aiResult.workout_plan}</div>
          </div>
        </div>
      )}

      {/* Exercise Suggestions */}
      {Array.isArray(aiResult.exercise_suggestions) && aiResult.exercise_suggestions.length > 0 && (
        <div className="mb-5">
          <h3 className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold text-ink">
            <Dumbbell className="h-4 w-4 text-orange-deep" /> Exercises
          </h3>
          <div className="space-y-2">
            {aiResult.exercise_suggestions.map((item, i) => {
              const ex = item.exercise;
              return (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-line bg-white p-3">
                  {ex?.image ? (
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface">
                      <img src={ex.image} alt={ex.name} className="h-full w-full object-cover" loading="lazy" />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-orange-tint">
                      <Dumbbell className="h-5 w-5 text-orange-deep" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-ink">{ex?.name ?? item.text}</span>
                      {(item.scheduled_day || item.scheduled_time) && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-orange-tint px-2 py-0.5 text-[10px] font-semibold text-orange-deep whitespace-nowrap">
                          <Clock className="h-3 w-3" />
                          {formatDayLabel(item.scheduled_day)}
                          {item.scheduled_day && item.scheduled_time && " · "}
                          {item.scheduled_time?.slice(0, 5)}
                        </span>
                      )}
                    </div>
                    {ex?.target_muscles && ex.target_muscles.length > 0 && (
                      <div className="mt-0.5 flex flex-wrap gap-1">
                        {ex.target_muscles.map((m) => (
                          <span key={m} className="rounded-md bg-surface px-1.5 py-0.5 text-[10px] font-medium text-ink-soft">{m}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Meal Suggestions */}
      {Array.isArray(aiResult.meal_suggestions) && aiResult.meal_suggestions.length > 0 && (
        <div className="mb-5">
          <h3 className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold text-ink">
            <Utensils className="h-4 w-4 text-orange-deep" /> Meals
          </h3>
          <div className="space-y-2">
            {aiResult.meal_suggestions.map((item, i) => {
              const fd = item.food;
              return (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-line bg-white p-3">
                  {fd?.image ? (
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface">
                      <img src={fd.image} alt={fd.name} className="h-full w-full object-cover" loading="lazy" />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-orange-tint">
                      <Utensils className="h-5 w-5 text-orange-deep" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-ink">{fd?.name ?? item.text}</span>
                      {(item.meal_time || item.time) && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-orange-tint px-2 py-0.5 text-[10px] font-semibold text-orange-deep whitespace-nowrap">
                          <Clock className="h-3 w-3" />
                          {item.meal_time ? MEAL_LABELS[item.meal_time] ?? item.meal_time : ""}
                          {item.meal_time && item.time && " · "}
                          {item.time?.slice(0, 5)}
                        </span>
                      )}
                    </div>
                    {fd?.calories_per_100g && (
                      <div className="mt-0.5 text-[11.5px] text-ink-soft">{fd.calories_per_100g} kcal/100g</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Fallback for string suggestions */}
      {typeof aiResult.exercise_suggestions === "string" && aiResult.exercise_suggestions && (
        <p className="mb-5 text-sm leading-relaxed text-ink-soft">{aiResult.exercise_suggestions}</p>
      )}
      {typeof aiResult.meal_suggestions === "string" && aiResult.meal_suggestions && (
        <p className="mb-5 text-sm leading-relaxed text-ink-soft">{aiResult.meal_suggestions}</p>
      )}

      <div className="mt-auto pt-1 mb-6">
        <ButtonPrimary type="button" onClick={() => router.push("/dashboard")}>
          View Dashboard
        </ButtonPrimary>
      </div>
    </div>
  );
}
