"use client";

import { useCallback, useEffect, useState } from "react";
import MobileHeroCard from "@/components/dashboard/MobileHeroCard";
import QuickStatsPills from "@/components/dashboard/QuickStatsPills";
import CalendarView from "@/components/dashboard/Calendar";
import AIRecommendation from "@/components/dashboard/AIRecommendation";
// import AiExerciseCard from "@/components/dashboard/AiExerciseCard";
// import AiMealCard from "@/components/dashboard/AiMealCard";
import CheckinModal from "@/components/dashboard/CheckinModal";
import {
  DashboardHeroSkeleton,
  DashboardInsightSkeleton,
  // DashboardRecommendationsSkeleton,
  DashboardSummarySkeleton,
} from "@/components/dashboard/DashboardSectionSkeletons";
import { kpiService } from "@/services/kpi.service";
import { mealLogService } from "@/services/meal-logs.service";
import { workoutScheduleService } from "@/services/workout-schedules.service";
import { attendanceService } from "@/services/attendances.service";
// import { aiAnalysisService } from "@/services/ai-analysis.service";
import type { KpiCurrentResponse, MealLogTodayResponse, WorkoutSchedule, AttendanceToday } from "@/types/dashboard";
// import type { AiAnalysis } from "@/services/ai-analysis.service";

const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

function computeStatus(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Needs Attention";
  return "Critical";
}

export default function DashboardPage() {
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  // const [recommendationsLoading, setRecommendationsLoading] = useState(true);
  const [kpi, setKpi] = useState<KpiCurrentResponse | null>(null);
  const [meals, setMeals] = useState<MealLogTodayResponse | null>(null);
  const [schedules, setSchedules] = useState<WorkoutSchedule[]>([]);
  const [attendance, setAttendance] = useState<AttendanceToday | null>(null);
  // const [aiAnalysis, setAiAnalysis] = useState<AiAnalysis | null>(null);
  const [showCheckin, setShowCheckin] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<WorkoutSchedule | null>(null);
  const [calendarRefreshKey, setCalendarRefreshKey] = useState(0);

  const loadOverview = useCallback(async (showLoading = true) => {
    if (showLoading) setOverviewLoading(true);

    const [scheduleResult, attendanceResult] = await Promise.allSettled([
      workoutScheduleService.getAll(),
      attendanceService.getToday(),
    ]);

    if (scheduleResult.status === "fulfilled") setSchedules(scheduleResult.value.data);
    if (attendanceResult.status === "fulfilled") setAttendance(attendanceResult.value.data);

    setOverviewLoading(false);
  }, []);

  const loadSummary = useCallback(async (showLoading = true) => {
    if (showLoading) setSummaryLoading(true);

    const [kpiResult, mealsResult] = await Promise.allSettled([
      kpiService.getCurrent(),
      mealLogService.getToday(),
    ]);

    if (kpiResult.status === "fulfilled") setKpi(kpiResult.value.data);
    if (mealsResult.status === "fulfilled") setMeals(mealsResult.value.data);

    setSummaryLoading(false);
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => {
      void loadOverview(false);
      void loadSummary(false);
      // void loadRecommendations(false);
    }, 0);

    return () => window.clearTimeout(initialLoad);
  }, [
    loadOverview, 
    // loadRecommendations, 
    loadSummary
  ]);

  const handleCheckin = useCallback((schedule: WorkoutSchedule) => {
    setSelectedSchedule(schedule);
    setShowCheckin(true);
  }, []);

  const handleCheckinSuccess = useCallback(() => {
    setShowCheckin(false);
    setSelectedSchedule(null);
    setCalendarRefreshKey((current) => current + 1);
    void loadOverview();
    void loadSummary();
  }, [loadOverview, loadSummary]);

  const now = new Date();
  const todayDay = DAYS[now.getDay()];
  const todaySchedule = schedules.find((schedule) => schedule.day_of_week === todayDay) ?? null;

  const hasMealsToday = meals?.logs != null && meals.logs.length > 0;
  const checkedIn = attendance?.has_attended === true;
  const kpiScore = kpi?.today?.data?.overall_score ?? null;
  const kpiStatus = kpiScore != null ? computeStatus(kpiScore) : null;

  return (
    <div className="space-y-5">
      {overviewLoading ? (
        <DashboardHeroSkeleton />
      ) : (
        <MobileHeroCard schedule={todaySchedule} checkedIn={checkedIn} onCheckin={handleCheckin} />
      )}

      {summaryLoading ? (
        <DashboardSummarySkeleton />
      ) : (
        <QuickStatsPills
          items={[
            { label: "Overall Score", value: kpiScore != null ? `${kpiScore} · ${kpiStatus}` : "—", accent: true },
            { label: "Calories", value: hasMealsToday ? `${meals!.totals.total_calories}/2,000` : "—" },
            { label: "Workout", value: checkedIn ? "Done" : todaySchedule ? "Not yet" : "No plan" },
            { label: "Weight", value: kpi?.today?.data?.current_weight_kg ? `${kpi.today.data.current_weight_kg}kg` : "—" },
          ]}
        />
      )}

      <div>
        <CalendarView refreshKey={calendarRefreshKey} />
      </div>

      {summaryLoading ? (
        <DashboardInsightSkeleton />
      ) : kpi?.today?.data?.ai_summary ? (
        <AIRecommendation message={kpi.today.data.ai_summary} />
      ) : null}

      {/* {recommendationsLoading ? (
        <DashboardRecommendationsSkeleton />
      ) : (
        <>
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
        </>
      )} */}

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
