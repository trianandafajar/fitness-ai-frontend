"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PartyPopper, AlertCircle, Dumbbell, Utensils, Check, Target, Clock, CalendarDays } from "lucide-react";
import { ButtonPrimary } from "@/components/ui/Button";
import { mealScheduleService } from "@/services/meal-schedules.service";
import type { MealSchedule } from "@/types/dashboard";
import type { AiAnalysis, EnrichedExercise, EnrichedFood } from "./types";

interface Props {
  aiResult: AiAnalysis | null;
  loading: boolean;
  onRetry: () => void;
  onComplete: () => void;
}

const MEAL_LABELS: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};

const DAY_ORDER = [
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
];

const DAY_LABELS: Record<string, string> = Object.fromEntries(
  DAY_ORDER.map((day) => [day, day.charAt(0).toUpperCase() + day.slice(1)])
);

function groupExercisesByDay(items: EnrichedExercise[]) {
  const groups = new Map<string, EnrichedExercise[]>();

  items.forEach((item) => {
    const days = item.scheduled_day?.split(",").map((day) => day.trim().toLowerCase()).filter(Boolean) ?? [];
    days.forEach((day) => {
      groups.set(day, [...(groups.get(day) ?? []), item]);
    });
  });

  return DAY_ORDER
    .filter((day) => groups.has(day))
    .map((day) => ({ day, items: groups.get(day) ?? [] }));
}

function groupMealsByDay(schedules: MealSchedule[]) {
  const groups = new Map<string, MealSchedule[]>();

  schedules.forEach((schedule) => {
    groups.set(schedule.day_of_week, [...(groups.get(schedule.day_of_week) ?? []), schedule]);
  });

  return DAY_ORDER
    .filter((day) => groups.has(day))
    .map((day) => ({ day, schedules: groups.get(day) ?? [] }));
}

function findFoodSuggestion(items: EnrichedFood[], foodName: string) {
  const normalizedName = foodName.toLowerCase();
  return items.find((item) => item.food?.name.toLowerCase() === normalizedName);
}

export default function StepAnalysis({ aiResult, loading, onRetry, onComplete }: Props) {
  const router = useRouter();
  const [mealSchedules, setMealSchedules] = useState<MealSchedule[]>([]);

  useEffect(() => {
    if (!aiResult || typeof aiResult.meal_suggestions === "string") return;

    let cancelled = false;

    mealScheduleService.getAll()
      .then(({ data }) => {
        if (!cancelled) setMealSchedules(data);
      })
      .catch(() => {
        if (!cancelled) setMealSchedules([]);
      });

    return () => { cancelled = true; };
  }, [aiResult]);

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
  const exerciseSuggestions = Array.isArray(aiResult.exercise_suggestions)
    ? aiResult.exercise_suggestions
    : [];
  const mealSuggestions = Array.isArray(aiResult.meal_suggestions)
    ? aiResult.meal_suggestions
    : [];
  const exerciseGroups = groupExercisesByDay(exerciseSuggestions);
  const mealGroups = groupMealsByDay(mealSchedules);

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
      {exerciseGroups.length > 0 && (
        <div className="mb-5">
          <h3 className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold text-ink">
            <Dumbbell className="h-4 w-4 text-orange-deep" /> Exercises
          </h3>
          <div className="space-y-4">
            {exerciseGroups.map(({ day, items }) => (
              <div key={day}>
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-orange" />
                  <h4 className="text-[12px] font-bold uppercase tracking-wide text-ink-soft">{DAY_LABELS[day] ?? day}</h4>
                  <span className="text-[11px] text-ink-faint">{items.length} {items.length === 1 ? "exercise" : "exercises"}</span>
                </div>
                <div className="space-y-2 border-l border-orange/20 pl-3">
                  {items.map((item, i) => {
                    const ex = item.exercise;
                    return (
                      <div key={`${day}-${ex?.id ?? item.text}-${i}`} className="flex items-center gap-3 rounded-xl border border-line bg-white p-3">
                        {ex?.image ? (
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-orange-tint">
                            <img src={ex.image} alt={ex.name} className="relative z-10 h-full w-full object-cover" loading="lazy" onError={(event) => { event.currentTarget.style.display = "none"; }} />
                            <Dumbbell className="absolute inset-0 z-0 m-auto h-5 w-5 text-orange-deep" />
                          </div>
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-orange-tint">
                            <Dumbbell className="h-5 w-5 text-orange-deep" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[13px] font-semibold text-ink">{ex?.name ?? item.text}</span>
                            {item.scheduled_time && (
                              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-orange-tint px-2 py-0.5 text-[10px] font-semibold text-orange-deep">
                                <Clock className="h-3 w-3" />
                                {item.scheduled_time.slice(0, 5)}
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
            ))}
          </div>
        </div>
      )}

      {/* Meal Suggestions */}
      {mealGroups.length > 0 && (
        <div className="mb-5">
          <h3 className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold text-ink">
            <Utensils className="h-4 w-4 text-orange-deep" /> Meals
          </h3>
          <div className="space-y-4">
            {mealGroups.map(({ day, schedules }) => {
              // Group meal items by food name, collecting all meal_time badges
              const foodMap = new Map<string, { fd: EnrichedFood['food']; badges: { label: string; time: string }[] }>();

              schedules.forEach((schedule) => {
                schedule.items.forEach((mealItem) => {
                  const suggestion = findFoodSuggestion(mealSuggestions, mealItem.food);
                  const fd = suggestion?.food;
                  const foodKey = fd?.name ?? mealItem.food;
                  const badge = {
                    label: MEAL_LABELS[schedule.meal_time] ?? schedule.meal_time,
                    time: schedule.time?.slice(0, 5) ?? '',
                  };

                  if (foodMap.has(foodKey)) {
                    const entry = foodMap.get(foodKey)!;
                    if (!entry.badges.some((b) => b.label === badge.label && b.time === badge.time)) {
                      entry.badges.push(badge);
                    }
                  } else {
                    foodMap.set(foodKey, { fd: fd ?? null, badges: [badge] });
                  }
                });
              });

              return (
                <div key={day}>
                  <div className="mb-2 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-orange" />
                    <h4 className="text-[12px] font-bold uppercase tracking-wide text-ink-soft">{DAY_LABELS[day] ?? day}</h4>
                  </div>
                  <div className="space-y-2 border-l border-orange/20 pl-3">
                    {Array.from(foodMap.entries()).map(([foodName, { fd, badges }]) => (
                      <div key={`${day}-${foodName}`} className="flex items-center gap-3 rounded-xl border border-line bg-white p-3">
                        {fd?.image ? (
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-orange-tint">
                            <img src={fd.image} alt={fd.name} className="relative z-10 h-full w-full object-cover" loading="lazy" onError={(event) => { event.currentTarget.style.display = "none"; }} />
                            <Utensils className="absolute inset-0 z-0 m-auto h-5 w-5 text-orange-deep" />
                          </div>
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-orange-tint">
                            <Utensils className="h-5 w-5 text-orange-deep" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <span className="text-[13px] font-semibold text-ink">{foodName}</span>
                          {fd?.calories_per_100g && (
                            <div className="mt-0.5 text-[11.5px] text-ink-soft">{fd.calories_per_100g} kcal/100g</div>
                          )}
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1">
                          {badges.map((b) => (
                            <span key={`${b.label}-${b.time}`} className="inline-flex items-center gap-1 rounded-full bg-orange-tint px-2.5 py-1 text-[10px] font-semibold text-orange-deep whitespace-nowrap">
                              <Clock className="h-3 w-3" />
                              {b.label} · {b.time}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
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
        <ButtonPrimary type="button" onClick={onComplete}>
          Complete & View Dashboard
        </ButtonPrimary>
      </div>
    </div>
  );
}
