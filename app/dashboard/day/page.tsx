"use client";

import { Suspense } from "react";
import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Dumbbell, UtensilsCrossed, ClipboardCheck } from "lucide-react";
import ExerciseList from "@/components/dashboard/ExerciseList";
import CheckinModal from "@/components/dashboard/CheckinModal";
import { ButtonGlass } from "@/components/ui/Button";
import { workoutScheduleService } from "@/services/workout-schedules.service";
import { mealScheduleService } from "@/services/meal-schedules.service";
import { attendanceService } from "@/services/attendances.service";
import type { WorkoutSchedule, MealSchedule, AttendanceToday } from "@/types/dashboard";

const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const MEAL_LABELS: Record<string, string> = {
  breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", snack: "Snack",
};

function formatDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseDate(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

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

  const todaySchedule = workouts.find((s) => s.day_of_week === dayOfWeek) ?? null;
  const dayMeals = meals.filter((m) => m.day_of_week === dayOfWeek);
  const checkedIn = attendance?.has_attended === true;

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [wr, mr, ar] = await Promise.allSettled([
      workoutScheduleService.getAll(),
      mealScheduleService.getAll(),
      isToday ? attendanceService.getToday() : Promise.resolve(null),
    ]);
    if (wr.status === "fulfilled") setWorkouts(wr.value.data);
    if (mr.status === "fulfilled") setMeals(mr.value.data);
    if (ar.status === "fulfilled" && ar.value) setAttendance(ar.value.data);
    setLoading(false);
  }, [isToday]);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => {
      void fetchData();
    }, 0);

    return () => window.clearTimeout(initialLoad);
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
    <div className="space-y-5">
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
            <div className="mb-3 flex items-center gap-2">
              <Dumbbell size={16} className="text-orange-deep" />
              <div className="font-display text-base font-bold">Workout</div>
            </div>
            <ExerciseList exercises={todaySchedule?.exercises ?? []} scheduleId={todaySchedule?.id} />
            {todaySchedule?.scheduled_time && (
              <div className="mt-2 text-[12px] font-mono text-ink-soft">
                Scheduled at {todaySchedule.scheduled_time.slice(0, 5)}
              </div>
            )}
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2">
              <UtensilsCrossed size={16} className="text-orange-deep" />
              <div className="font-display text-base font-bold">Meals</div>
            </div>
            {dayMeals.length === 0 ? (
              <div className="rounded-2xl border border-line bg-white p-5">
                <div className="text-sm text-ink-soft">No meal schedules for {dayLabel}.</div>
              </div>
            ) : (
              <div className="space-y-2">
                {(["breakfast", "lunch", "dinner", "snack"] as const).map((mt) => {
                  const meal = dayMeals.find((m) => m.meal_time === mt);
                  if (!meal) return null;
                  return (
                    <div key={mt} className="rounded-2xl border border-line bg-white p-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[13px] font-bold text-ink">{MEAL_LABELS[mt]}</span>
                        {meal.time && (
                          <span className="font-mono text-[11px] text-ink-faint">{meal.time.slice(0, 5)}</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {meal.items.map((item, i) => (
                          <span key={i} className="rounded-lg bg-surface px-2 py-0.5 text-xs text-ink">
                            {item.food}{item.portion ? ` (${item.portion})` : ""}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {isToday && (
            <div className="sticky bottom-24">
              {checkedIn ? (
                <div className="flex items-center justify-center gap-2 rounded-2xl bg-green-50 py-3.5 text-sm font-semibold text-green-700">
                  <ClipboardCheck size={18} />
                  Checked in
                </div>
              ) : (
                <ButtonGlass
                  type="button"
                  onClick={handleCheckin}
                  disabled={!todaySchedule}
                  className="w-full py-3 text-sm"
                >
                  {todaySchedule ? "Check In" : "No workout scheduled"}
                </ButtonGlass>
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
