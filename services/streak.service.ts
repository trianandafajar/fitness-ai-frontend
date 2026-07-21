import { api } from "@/lib/axios";
import type {
  StreakCalendarRangeResponse,
  StreakCalendarResponse,
  StreakCountResponse,
} from "@/types/dashboard";

export const streakService = {
  getCalendar: (month: string) =>
    api.get<StreakCalendarResponse>("/streak/calendar", { params: { month } }),

  getRange: (startDate: string, days = 16) =>
    api.get<StreakCalendarRangeResponse>("/streak/calendar", {
      params: { start_date: startDate, days },
    }),

  getCount: () => api.get<StreakCountResponse>("/streak/count"),
};
