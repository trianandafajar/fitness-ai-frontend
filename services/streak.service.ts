import { api } from "@/lib/axios";
import type { StreakCalendarResponse, StreakCountResponse } from "@/types/dashboard";

export const streakService = {
  getCalendar: (month: string) =>
    api.get<StreakCalendarResponse>("/streak/calendar", { params: { month } }),

  getCount: () => api.get<StreakCountResponse>("/streak/count"),
};
