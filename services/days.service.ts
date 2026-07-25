import { api } from "@/lib/axios";
import type { AttendanceToday, MealSchedule, WorkoutSchedule } from "@/types/dashboard";

export interface DaysResponse {
  workouts: WorkoutSchedule[];
  meals: MealSchedule[];
  attendance: AttendanceToday;
}

export const daysService = {
  get: (date: string) => api.get<{ data: DaysResponse }>(`/days/${encodeURIComponent(date)}`),
};
