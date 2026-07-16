"use client";

import { useEffect, useState, useCallback } from "react";
import { Flame, Footprints, Droplet, CheckCircle } from "lucide-react";
import MobileHeroCard from "@/components/dashboard/MobileHeroCard";
import QuickStatsPills from "@/components/dashboard/QuickStatsPills";
import ExerciseList from "@/components/dashboard/ExerciseList";
import AIRecommendation from "@/components/dashboard/AIRecommendation";
import ScoreGauge from "@/components/dashboard/ScoreGauge";
import StatMini from "@/components/dashboard/StatMini";
import AICheckin from "@/components/dashboard/AICheckin";
import TodayPlanCard from "@/components/dashboard/TodayPlanCard";
import KpiCard from "@/components/dashboard/KpiCard";
import { kpiService } from "@/services/kpi.service";
import { mealLogService } from "@/services/meal-logs.service";
import { workoutScheduleService } from "@/services/workout-schedules.service";
import { attendanceService } from "@/services/attendances.service";
import { useAuth } from "@/hooks/useAuth";
import type { KpiCurrentResponse, MealLogTodayResponse, WorkoutSchedule, AttendanceToday } from "@/types/dashboard";

const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

function computeStatus(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Needs Attention";
  return "Critical";
}

export default function DashboardPage() {
  const { user, fetchUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [kpi, setKpi] = useState<KpiCurrentResponse | null>(null);
  const [meals, setMeals] = useState<MealLogTodayResponse | null>(null);
  const [schedules, setSchedules] = useState<WorkoutSchedule[]>([]);
  const [attendance, setAttendance] = useState<AttendanceToday | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    await fetchUser();

    const [kpiRes, mealsRes, schedRes, attRes] = await Promise.allSettled([
      kpiService.getCurrent(),
      mealLogService.getToday(),
      workoutScheduleService.getAll(),
      attendanceService.getToday(),
    ]);

    if (kpiRes.status === "fulfilled") setKpi(kpiRes.value.data);
    if (mealsRes.status === "fulfilled") setMeals(mealsRes.value.data);
    if (schedRes.status === "fulfilled") setSchedules(schedRes.value.data);
    if (attRes.status === "fulfilled") setAttendance(attRes.value.data);

    setLoading(false);
  }, [fetchUser]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const now = new Date();
  const todayDay = DAYS[now.getDay()];
  const todaySchedule = schedules.find((s) => s.day_of_week === todayDay) ?? null;

  const hasMealsToday = meals && meals.logs && meals.logs.length > 0;
  const hasKpi = kpi?.today != null;
  const checkedIn = attendance?.has_attended === true;

  const kpiScore = kpi?.today?.data?.overall_score ?? null;
  const kpiStatus = kpiScore != null ? computeStatus(kpiScore) : null;
  const kpiNote = kpi?.today?.data?.ai_summary ?? "Start tracking your workouts and meals to see your KPI score.";

  const calorieValue = hasMealsToday ? String(meals!.totals.total_calories) : "—";
  const caloriePercent = hasMealsToday ? Math.min(Math.round((meals!.totals.total_calories / 2000) * 100), 100) : 0;

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <>
      <div className="space-y-5 md:hidden">
        <MobileHeroCard schedule={todaySchedule} checkedIn={checkedIn} />

        <QuickStatsPills
          items={[
            { label: "Overall Score", value: kpiScore != null ? `${kpiScore} · ${kpiStatus}` : "—", accent: true },
            { label: "Calories", value: hasMealsToday ? `${meals!.totals.total_calories}/2,000` : "—" },
            { label: "Workout", value: checkedIn ? "Done" : todaySchedule ? "Not yet" : "No plan" },
            { label: "Weight", value: kpi?.today?.data?.current_weight_kg ? `${kpi.today.data.current_weight_kg}kg` : "—" },
          ]}
        />

        <div>
          <div className="mb-3 flex items-center justify-between">
            <div className="font-display text-base font-bold">Workout Plan</div>
            <a href="/dashboard/workout-schedules" className="text-xs font-bold text-orange-deep">See All</a>
          </div>
          <ExerciseList exercises={todaySchedule?.exercises ?? []} />
        </div>

        {kpi?.today?.data?.ai_summary && (
          <AIRecommendation message={kpi.today.data.ai_summary} />
        )}
      </div>

      <div className="hidden md:block">
        <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr]">
          <ScoreGauge score={kpiScore} status={kpiStatus} note={kpiNote} />

          <div className="grid grid-cols-2 gap-3.5 xl:grid-cols-4">
            <StatMini
              label="Calories"
              icon={<Flame className="h-4 w-4" />}
              value={calorieValue}
              total={hasMealsToday ? "2,000" : undefined}
              percent={hasMealsToday ? caloriePercent : undefined}
            />
            <StatMini
              label="Workout"
              icon={<CheckCircle className="h-4 w-4" />}
              value={checkedIn ? "Checked in" : todaySchedule ? "Not yet" : "No schedule"}
              secondaryText={checkedIn ? "Done" : todaySchedule ? "Ready to go" : "Set a schedule"}
            />
            <StatMini
              label="Weight"
              icon={<Droplet className="h-4 w-4" />}
              value={kpi?.today?.data?.current_weight_kg ? `${kpi.today.data.current_weight_kg}kg` : "—"}
              secondaryText={
                kpi?.today?.data?.weight_change_kg != null
                  ? `${kpi.today.data.weight_change_kg > 0 ? "+" : ""}${kpi.today.data.weight_change_kg}kg this week`
                  : "Log weight to track"
              }
            />
            <StatMini
              label="Compliance"
              icon={<Footprints className="h-4 w-4" />}
              value={hasKpi ? `${kpi!.today!.data!.workout_compliance_pct}%` : "—"}
              secondaryText={hasKpi ? "This week" : "No data yet"}
            />
          </div>
        </div>

        {kpi?.today?.data?.ai_summary && <AICheckin message={kpi.today.data.ai_summary} />}

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_1fr]">
          <TodayPlanCard
            schedule={todaySchedule}
            attendanceToday={attendance}
            loading={false}
            onCheckinSuccess={loadAll}
          />

          <KpiCard
            rows={
              hasKpi
                ? [
                  { label: "Workout Compliance", value: `${kpi!.today!.data!.workout_compliance_pct}%`, percent: kpi!.today!.data!.workout_compliance_pct, color: "bg-green-500" },
                  { label: "Nutrition Score", value: `${kpi!.today!.data!.nutrition_score}`, percent: kpi!.today!.data!.nutrition_score, color: "bg-orange" },
                  { label: "Weight Trend", value: `${kpi!.today!.data!.weight_trend_score}`, percent: kpi!.today!.data!.weight_trend_score, color: "bg-orange" },
                  { label: "Consistency", value: `${kpi!.today!.data!.consistency_score}%`, percent: kpi!.today!.data!.consistency_score, color: "bg-green-500" },
                  { label: "Engagement", value: `${kpi!.today!.data!.engagement_score}%`, percent: kpi!.today!.data!.engagement_score, color: "bg-amber-500" },
                ]
                : []
            }
            streak={[
              { label: "Mon", done: checkedIn && todayDay === "monday" },
              { label: "Tue", done: false },
              { label: "Wed", done: false },
              { label: "Thu", done: false },
              { label: "Fri", done: false },
              { label: "Sat", done: false },
              { label: "Sun", done: false },
            ]}
          />
        </div>
      </div>
    </>
  );
}

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="md:hidden space-y-5">
        <div className="h-44 rounded-3xl bg-surface" />
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-21 rounded-2xl bg-surface"
            />
          ))}
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-2xl bg-surface" />
          ))}
        </div>
        <div className="h-20 rounded-2xl bg-surface" />
      </div>

      {/* Desktop skeleton */}
      <div className="hidden md:block">
        <div className="h-8 w-48 rounded bg-surface" />
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr]">
          <div className="h-50 rounded-2xl bg-surface" />
          <div className="grid grid-cols-2 gap-3.5 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-27.5 rounded-[14px] bg-surface" />
            ))}
          </div>
        </div>
        <div className="mt-5 h-15 rounded-2xl bg-surface" />
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_1fr]">
          <div className="h-75 rounded-2xl bg-surface" />
          <div className="h-75 rounded-2xl bg-surface" />
        </div>
      </div>
    </div>
  );
}
