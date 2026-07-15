"use client";

import { useEffect, useState } from "react";
import { Flame, Footprints, Droplet, CheckCircle } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import BottomNav from "@/components/dashboard/BottomNav";
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

function getWeekDates(): { label: string; date: string }[] {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(today.setDate(diff));
  return DAYS.slice(1).concat(DAYS[0]).map((label, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return { label, date: d.toISOString().split("T")[0] };
  });
}

export default function DashboardPage() {
  const { user, fetchUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [kpi, setKpi] = useState<KpiCurrentResponse | null>(null);
  const [meals, setMeals] = useState<MealLogTodayResponse | null>(null);
  const [schedules, setSchedules] = useState<WorkoutSchedule[]>([]);
  const [attendance, setAttendance] = useState<AttendanceToday | null>(null);

  useEffect(() => {
    async function load() {
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
    }
    load();
  }, [fetchUser]);

  const now = new Date();
  const todayDay = DAYS[now.getDay()];
  const todaySchedule = schedules.find((s) => s.day_of_week === todayDay) ?? null;

  const weekDates = getWeekDates();
  const streak = weekDates.map((wd) => ({
    label: wd.label.slice(0, 3),
    done: false,
  }));

  const hasMealsToday = meals && meals.logs && meals.logs.length > 0;
  const hasKpi = kpi?.today != null;
  const checkedIn = attendance?.status === "verified" || attendance?.status === "pending";

  const kpiScore = kpi?.today?.overall_score ?? null;
  const kpiStatus = kpiScore != null ? computeStatus(kpiScore) : null;
  const kpiNote = kpi?.today?.ai_summary ?? "Start tracking your workouts and meals to see your KPI score.";

  const calorieValue = hasMealsToday ? String(meals!.totals.total_calories) : "—";
  const caloriePercent = hasMealsToday ? Math.min(Math.round((meals!.totals.total_calories / 2000) * 100), 100) : 0;

  return (
    <div className="md:flex">
      <Sidebar />

      <main className="min-h-screen flex-1 px-5 pb-28 pt-6 sm:px-6 md:px-10 md:pb-10 md:pt-8">
        <DashboardHeader
          name={user?.name ?? "User"}
          dateLabel={now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          streakDays={hasKpi ? kpi!.today!.consistency_score : 0}
        />

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            {/* Row 1: score gauge + stat minis */}
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
                  value={kpi?.today?.current_weight_kg ? `${kpi.today.current_weight_kg}kg` : "—"}
                  secondaryText={
                    kpi?.today?.weight_change_kg != null
                      ? `${kpi.today.weight_change_kg > 0 ? "+" : ""}${kpi.today.weight_change_kg}kg this week`
                      : "Log weight to track"
                  }
                />
                <StatMini
                  label="Compliance"
                  icon={<Footprints className="h-4 w-4" />}
                  value={hasKpi ? `${kpi!.today!.workout_compliance_pct}%` : "—"}
                  secondaryText={hasKpi ? "This week" : "No data yet"}
                />
              </div>
            </div>

            {/* AI Check-in */}
            {kpi?.today?.ai_summary && <AICheckin message={kpi.today.ai_summary} />}

            {/* Row 2: plan + KPI */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_1fr]">
              <TodayPlanCard
                schedule={todaySchedule}
                attendanceToday={attendance}
                loading={false}
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
                streak={streak}
              />
            </div>
          </>
        )}
      </main>

      <BottomNav />
    </div>
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
