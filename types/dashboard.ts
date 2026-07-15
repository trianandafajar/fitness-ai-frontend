export interface Exercise {
  name: string;
  sets: number | null;
  reps: number | null;
  notes?: string | null;
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
  today: KpiData | null;
  this_week: KpiData | null;
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
