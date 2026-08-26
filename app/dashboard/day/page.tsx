"use client";

import { Suspense } from "react";
import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ClipboardCheck, Clock, Dumbbell, Utensils, UtensilsCrossed } from "lucide-react";
import ExerciseList from "@/components/dashboard/ExerciseList";
import CheckinModal from "@/components/dashboard/CheckinModal";
import { ButtonGlass, ButtonPrimary } from "@/components/ui/Button";
import { daysService } from "@/services/days.service";
import type { MealItem, WorkoutSchedule, MealSchedule, AttendanceToday } from "@/types/dashboard";
import { DAYS, MEAL_LABELS, MONTHS } from "@/lib/CONSTANTA";
import { formatDateKey, parseDate } from "@/lib/utils";

export default function DayPage() {
  return (
    <Suspense fallback={<DaySkeleton />}>
      <DayContent />
    </Suspense>
  );
}

function DaySkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="h-10 w-48 rounded bg-surface" />
      <div className="h-32 rounded-2xl bg-surface" />
      <div className="h-48 rounded-2xl bg-surface" />
    </div>
  );
}

interface MealCardData {
  item: MealItem;
  portions: string[];
  badges: { label: string; time: string }[];
}

function DayContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawDate = searchParams.get("date") ?? formatDateKey(new Date());
  const date = parseDate(rawDate);
  const dayOfWeek = DAYS[date.getDay()];

  const [workouts, setWorkouts] = useState<WorkoutSchedule[]>([]);
  const [meals, setMeals] = useState<MealSchedule[]>([]);
  const [attendance, setAttendance] = useState<AttendanceToday | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCheckin, setShowCheckin] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<WorkoutSchedule | null>(null);

  const todayKey = formatDateKey(new Date());
  const isToday = rawDate === todayKey;

  const todaySchedule = workouts[0] ?? null;
  const dayMeals = meals;
  const checkedIn = attendance?.has_attended === true;

  const mealCards = new Map<string, MealCardData>();
  dayMeals.forEach((meal) => {
    meal.items.forEach((item) => {
      const key = item.food.trim().toLowerCase();
      const existing = mealCards.get(key);
      const badge = {
        label: MEAL_LABELS[meal.meal_time] ?? meal.meal_time,
        time: meal.time?.slice(0, 5) ?? "",
      };

      if (existing) {
        if (item.portion && !existing.portions.includes(item.portion)) {
          existing.portions.push(item.portion);
        }
        if (!existing.badges.some((entry) => entry.label === badge.label && entry.time === badge.time)) {
          existing.badges.push(badge);
        }
      } else {
        mealCards.set(key, {
          item,
          portions: item.portion ? [item.portion] : [],
          badges: [badge],
        });
      }
    });
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await daysService.get(rawDate);
      const { workouts: nextWorkouts = [], meals: nextMeals = [], attendance: nextAttendance = null } = response.data.data ?? {};

      setWorkouts(nextWorkouts);
      setMeals(nextMeals);
      setAttendance(nextAttendance);
    } finally {
      setLoading(false);
    }
  }, [rawDate]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  function handleCheckin() {
    if (todaySchedule) {
      setSelectedSchedule(todaySchedule);
      setShowCheckin(true);
    }
  }

  function handleCheckinSuccess() {
    setShowCheckin(false);
    setSelectedSchedule(null);
    void fetchData();
  }

  const formattedDate = `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  const dayLabel = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);

  return (
    <div className="space-y-5 pb-32">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft hover:bg-surface hover:text-ink"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <div className="text-[12px] font-bold uppercase tracking-wide text-ink-soft">{dayLabel}</div>
          <h1 className="font-display text-xl font-bold tracking-tight">{formattedDate}</h1>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-32 rounded-2xl bg-surface" />
          <div className="h-48 rounded-2xl bg-surface" />
        </div>
      ) : (
        <>
          <div>
            <div className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold text-ink">
              <Dumbbell size={16} className="text-orange-deep" />
              <span>Workout</span>
            </div>
            <div className="space-y-2">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-[11px] text-ink-faint">
                  {todaySchedule?.exercises.length ?? 0} {todaySchedule?.exercises.length === 1 ? "exercise" : "exercises"}
                </span>
                {todaySchedule?.scheduled_time && (
                  <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-orange-tint px-2 py-0.5 text-[10px] font-semibold text-orange-deep">
                    <Clock className="h-3 w-3" />
                    {todaySchedule.scheduled_time.slice(0, 5)}
                  </span>
                )}
              </div>
              <ExerciseList exercises={todaySchedule?.exercises ?? []} scheduleId={todaySchedule?.id} />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold text-ink">
              <UtensilsCrossed size={16} className="text-orange-deep" />
              <span>Meals</span>
            </div>
            {dayMeals.length === 0 ? (
              <div className="rounded-2xl border border-line bg-white p-5">
                <div className="text-sm text-ink-soft">No meal schedules for {dayLabel}.</div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-[11px] text-ink-faint">
                    {mealCards.size} {mealCards.size === 1 ? "food" : "foods"}
                  </span>
                </div>
                <div className="space-y-2">
                  {Array.from(mealCards.entries()).map(([key, { item, portions, badges }]) => {
                    const image = item.image_url ?? item.image;

                    return (
                      <div key={key} className="flex items-center gap-3 rounded-xl border border-line bg-white p-3">
                        {image ? (
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-orange-tint">
                            <img
                              src={image}
                              alt={item.food}
                              className="relative z-10 h-full w-full bg-white object-cover"
                              loading="lazy"
                              onError={(event) => { event.currentTarget.style.display = "none"; }}
                            />
                            <Utensils className="absolute inset-0 z-0 m-auto h-5 w-5 text-orange-deep" />
                          </div>
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-orange-tint">
                            <Utensils className="h-5 w-5 text-orange-deep" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="text-[13px] font-semibold text-ink">{item.food}</div>
                          {portions.length > 0 && (
                            <div className="mt-0.5 text-[11.5px] text-ink-soft">{portions.join(" · ")}</div>
                          )}
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1">
                          {badges.map((badge) => (
                            <span key={`${badge.label}-${badge.time}`} className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-orange-tint px-2.5 py-1 text-[10px] font-semibold text-orange-deep">
                              <Clock className="h-3 w-3" />
                              {badge.label}{badge.time ? ` · ${badge.time}` : ""}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {isToday && (
            <div className="pb-32">
              {checkedIn ? (
                <div className="flex items-center justify-center gap-2 rounded-2xl bg-success/10 py-3.5 text-sm font-semibold text-success">
                  <ClipboardCheck size={18} />
                  Checked in
                </div>
              ) : (
                <ButtonPrimary
                  type="button"
                  onClick={handleCheckin}
                  disabled={!todaySchedule}
                  className="w-full py-3 text-sm"
                >
                  {todaySchedule ? "Check In" : "No workout scheduled"}
                </ButtonPrimary>
              )}
            </div>
          )}
        </>
      )}

      {showCheckin && selectedSchedule && (
        <CheckinModal
          schedule={selectedSchedule}
          onClose={() => { setShowCheckin(false); setSelectedSchedule(null); }}
          onSuccess={handleCheckinSuccess}
        />
      )}
    </div>
  );
}
