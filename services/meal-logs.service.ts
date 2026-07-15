import { api } from "@/lib/axios";

export const mealLogService = {
  getToday: () => api.get("/meal-logs/today"),
};
