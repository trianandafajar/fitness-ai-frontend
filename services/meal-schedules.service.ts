import { api } from "@/lib/axios";

export interface MealItemPayload {
  food: string;
  portion?: string | null;
  notes?: string | null;
}

export interface MealSchedulePayload {
  day_of_week: string;
  meal_time: string;
  time?: string | null;
  items: MealItemPayload[];
}

export const mealScheduleService = {
  getAll: () => api.get("/meal-schedules"),

  create: (payload: MealSchedulePayload) =>
    api.post("/meal-schedules", payload),

  update: (id: number, payload: MealSchedulePayload) =>
    api.put(`/meal-schedules/${id}`, payload),

  remove: (id: number) => api.delete(`/meal-schedules/${id}`),

  sync: (schedules: MealSchedulePayload[]) =>
    api.post("/meal-schedules/sync", { schedules }),
};
