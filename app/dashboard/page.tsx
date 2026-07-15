"use client";

import { useEffect, useState, useCallback } from "react";
import { Flame, Footprints, Droplet, CheckCircle } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
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
  const hasTodaySchedule = attendance?.has_schedule;

  const kpiScore = kpi?.today?.overall_score ?? null;
  const kpiStatus = kpiScore != null ? computeStatus(kpiScore) : null;
  const kpiNote = kpi?.today?.ai_summary ?? "Start tracking your workouts and meals to see your KPI score.";

  const calorieValue = hasMealsToday ? String(meals!.totals.total_calories) : "—";
  const caloriePercent = hasMealsToday ? Math.min(Math.round((meals!.totals.total_calories / 2000) * 100), 100) : 0;

  return (
    <>
      <DashboardHeader
        name={user?.name ?? "User"}
        dateLabel={now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        streakDays={hasKpi ? kpi!.today!.consistency_score : 0}
      />

      {loading ? (
        <DashboardSkeleton />
      ) : (
        <>
          <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr]">
            <ScoreGauge score={kpiScore} status={kpiStatus} note={kpiNote} />

            <div className="grid grid-cols-2 gap-3.5 xl:grid-cols-4">
              <StatMini
                label="Calories"
                icon={<Flame className="h-[16px] w-[16px]" />}
                value={calorieValue}
                total={hasMealsToday ? "2,000" : undefined}
                percent={hasMealsToday ? caloriePercent : undefined}
              />
              <StatMini
                label="Workout"
                icon={<CheckCircle className="h-[16px] w-[16px]" />}
                value={checkedIn ? "Checked in" : todaySchedule ? "Not yet" : "No schedule"}
                secondaryText={checkedIn ? "Done" : todaySchedule ? "Ready to go" : "Set a schedule"}
              />
              <StatMini
                label="Weight"
                icon={<Droplet className="h-[16px] w-[16px]" />}
                value={kpi?.today?.current_weight_kg ? `${kpi.today.current_weight_kg}kg` : "—"}
                secondaryText={
                  kpi?.today?.weight_change_kg != null
                    ? `${kpi.today.weight_change_kg > 0 ? "+" : ""}${kpi.today.weight_change_kg}kg this week`
                    : "Log weight to track"
                }
              />
              <StatMini
                label="Compliance"
                icon={<Footprints className="h-[16px] w-[16px]" />}
                value={hasKpi ? `${kpi!.today!.workout_compliance_pct}%` : "—"}
                secondaryText={hasKpi ? "This week" : "No data yet"}
              />
            </div>
          </div>

          {kpi?.today?.ai_summary && <AICheckin message={kpi.today.ai_summary} />}

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
                      { label: "Workout Compliance", value: `${kpi!.today!.workout_compliance_pct}%`, percent: kpi!.today!.workout_compliance_pct, color: "bg-green-500" },
                      { label: "Nutrition Score", value: `${kpi!.today!.nutrition_score}`, percent: kpi!.today!.nutrition_score, color: "bg-orange" },
                      { label: "Weight Trend", value: `${kpi!.today!.weight_trend_score}`, percent: kpi!.today!.weight_trend_score, color: "bg-orange" },
                      { label: "Consistency", value: `${kpi!.today!.consistency_score}%`, percent: kpi!.today!.consistency_score, color: "bg-green-500" },
                      { label: "Engagement", value: `${kpi!.today!.engagement_score}%`, percent: kpi!.today!.engagement_score, color: "bg-amber-500" },
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
        </>
      )}
    </>
  );
}

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="h-8 w-48 rounded bg-surface" />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr]">
        <div className="h-50 rounded-2xl bg-surface" />
        <div className="grid grid-cols-2 gap-3.5 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-27.5 rounded-[14px] bg-surface" />
          ))}
        </div>
      </div>
      <div className="h-15 rounded-2xl bg-surface" />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_1fr]">
        <div className="h-75 rounded-2xl bg-surface" />
        <div className="h-75 rounded-2xl bg-surface" />
      </div>
    </div>
  );
}
