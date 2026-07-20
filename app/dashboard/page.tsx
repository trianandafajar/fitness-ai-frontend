"use client";

import { useEffect, useState, useCallback } from "react";
import MobileHeroCard from "@/components/dashboard/MobileHeroCard";
import QuickStatsPills from "@/components/dashboard/QuickStatsPills";
import CalendarView from "@/components/dashboard/Calendar";
import AIRecommendation from "@/components/dashboard/AIRecommendation";
import AiExerciseCard from "@/components/dashboard/AiExerciseCard";
import AiMealCard from "@/components/dashboard/AiMealCard";
import CheckinModal from "@/components/dashboard/CheckinModal";
import { kpiService } from "@/services/kpi.service";
import { mealLogService } from "@/services/meal-logs.service";
import { workoutScheduleService } from "@/services/workout-schedules.service";
import { attendanceService } from "@/services/attendances.service";
import { aiAnalysisService } from "@/services/ai-analysis.service";
import { useAuth } from "@/hooks/useAuth";
import type { KpiCurrentResponse, MealLogTodayResponse, WorkoutSchedule, AttendanceToday } from "@/types/dashboard";
import type { AiAnalysis } from "@/services/ai-analysis.service";

const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

function computeStatus(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Needs Attention";
  return "Critical";
}

export default function DashboardPage() {
  const { fetchUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [kpi, setKpi] = useState<KpiCurrentResponse | null>(null);
  const [meals, setMeals] = useState<MealLogTodayResponse | null>(null);
  const [schedules, setSchedules] = useState<WorkoutSchedule[]>([]);
  const [attendance, setAttendance] = useState<AttendanceToday | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AiAnalysis | null>(null);
  const [showCheckin, setShowCheckin] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<WorkoutSchedule | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    await fetchUser();

    const [kpiRes, mealsRes, schedRes, attRes, aiRes] = await Promise.allSettled([
      kpiService.getCurrent(),
      mealLogService.getToday(),
      workoutScheduleService.getAll(),
      attendanceService.getToday(),
      aiAnalysisService.getMyAnalysis(),
    ]);

    if (kpiRes.status === "fulfilled") setKpi(kpiRes.value.data);
    if (mealsRes.status === "fulfilled") setMeals(mealsRes.value.data);
    if (schedRes.status === "fulfilled") setSchedules(schedRes.value.data);
    if (attRes.status === "fulfilled") setAttendance(attRes.value.data);
    if (aiRes.status === "fulfilled") setAiAnalysis(aiRes.value.data?.data ?? null);

    setLoading(false);
  }, [fetchUser]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const handleCheckin = useCallback((schedule: WorkoutSchedule) => {
    setSelectedSchedule(schedule);
    setShowCheckin(true);
  }, []);

  const handleCheckinSuccess = useCallback(() => {
    setShowCheckin(false);
    setSelectedSchedule(null);
    loadAll();
  }, [loadAll]);

  const now = new Date();
  const todayDay = DAYS[now.getDay()];
  const todaySchedule = schedules.find((s) => s.day_of_week === todayDay) ?? null;

  const hasMealsToday = meals && meals.logs && meals.logs.length > 0;
  const hasKpi = kpi?.today != null;
  const checkedIn = attendance?.has_attended === true;

  const kpiScore = kpi?.today?.data?.overall_score ?? null;
  const kpiStatus = kpiScore != null ? computeStatus(kpiScore) : null;

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-5">
      <MobileHeroCard schedule={todaySchedule} checkedIn={checkedIn} onCheckin={handleCheckin} />

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
          <div className="font-display text-base font-bold">Calendar</div>
        </div>
        <CalendarView />
      </div>

      {kpi?.today?.data?.ai_summary && (
        <AIRecommendation message={kpi.today.data.ai_summary} />
      )}

      {aiAnalysis?.exercise_suggestions && aiAnalysis.exercise_suggestions.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div className="font-display text-base font-bold">AI Exercise Recommendations</div>
          </div>
          <div className="space-y-2">
            {aiAnalysis.exercise_suggestions.map((item, i) => (
              <AiExerciseCard key={i} item={item} />
            ))}
          </div>
        </div>
      )}

      {aiAnalysis?.meal_suggestions && aiAnalysis.meal_suggestions.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div className="font-display text-base font-bold">AI Meal Recommendations</div>
          </div>
          <div className="space-y-2">
            {aiAnalysis.meal_suggestions.map((item, i) => (
              <AiMealCard key={i} item={item} />
            ))}
          </div>
        </div>
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

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="h-44 rounded-3xl bg-surface" />
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-21 rounded-2xl bg-surface" />
        ))}
      </div>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded-2xl bg-surface" />
        ))}
      </div>
      <div className="h-20 rounded-2xl bg-surface" />
    </div>
  );
}
