export interface Exercise {
  name: string;
  sets: number | null;
  reps: number | null;
  notes?: string | null;
  description?: string | null;
  category?: string | null;
  rest_seconds?: number | null;
  estimated_calories?: number | null;
}

export interface WorkoutSchedule {
  id: number;
  user_id: number;
  day_of_week: string;
  scheduled_time: string | null;
  exercises: Exercise[];
  created_at: string;
  updated_at: string;
}

export interface MealLog {
  id: number;
  meal_type: string;
  logged_at: string;
  total_calories: number;
  total_protein_g: number;
  total_carbs_g: number;
  total_fat_g: number;
}

export interface MealLogTodayResponse {
  logs: MealLog[];
  totals: {
    total_calories: number;
    total_protein_g: number;
    total_carbs_g: number;
    total_fat_g: number;
  };
}

export interface KpiCurrentResponse {
  today: { data: KpiRecord; status: string } | null;
  this_week: { data: KpiRecord; status: string } | null;
}

export interface KpiRecord {
  id: number;
  period_type: string;
  period_start: string;
  period_end: string;
  workouts_completed: number;
  workouts_target: number;
  workout_compliance_pct: number;
  current_weight_kg: number | null;
  weight_change_kg: number | null;
  weight_trend_score: number;
  nutrition_score: number;
  consistency_score: number;
  engagement_score: number;
  overall_score: number;
  ai_summary: string | null;
  status: string;
}

export interface KpiData {
  id: number;
  overall_score: number;
  workout_compliance_pct: number;
  nutrition_score: number;
  weight_trend_score: number;
  consistency_score: number;
  engagement_score: number;
  current_weight_kg: number | null;
  weight_change_kg: number | null;
  ai_summary: string | null;
  status: string;
}

export interface AttendanceToday {
  has_schedule: boolean;
  schedule: WorkoutSchedule | null;
  has_attended: boolean;
  attendance: {
    id: number;
    user_id: number;
    workout_schedule_id: number;
    checked_in_at: string;
    status: string;
    photo_url: string | null;
    latitude: string | null;
    longitude: string | null;
    address: string | null;
  } | null;
}

export type StreakStatus = "streak" | "failed" | "pending" | "neutral" | "not_started";

export interface StreakCalendarDay {
  date: string;
  status: StreakStatus;
  has_schedule: boolean;
  has_attendance: boolean;
}

export interface StreakCalendarResponse {
  month: string;
  summary: {
    streak_days: number;
    failed_days: number;
    pending_days: number;
  };
  days: StreakCalendarDay[];
}

export interface StreakCountResponse {
  count: number;
}

export interface MealItem {
  food: string;
  portion: string | null;
  notes: string | null;
}

export interface MealSchedule {
  id: number;
  user_id: number;
  day_of_week: string;
  meal_time: string;
  time: string | null;
  items: MealItem[];
  created_at: string;
  updated_at: string;
}

export interface WeightLog {
  id: number;
  user_id: number;
  week_start: string;
  weight_kg: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AttendanceRecord {
  id: number;
  user_id: number;
  workout_schedule_id: number;
  checked_in_at: string;
  status: string;
  photo_url: string | null;
  latitude: string | null;
  longitude: string | null;
  address: string | null;
  workout_schedule: WorkoutSchedule | null;
}
