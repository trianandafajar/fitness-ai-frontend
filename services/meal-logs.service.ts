import { api } from "@/lib/axios";

export interface MealLogPayload {
  meal_type: string;
  logged_at: string;
  total_calories: number;
  total_protein_g: number;
  total_carbs_g: number;
  total_fat_g: number;
}

export const mealLogService = {
  getAll: () => api.get("/meal-logs"),

  getToday: () => api.get("/meal-logs/today"),

  create: (payload: MealLogPayload) =>
    api.post("/meal-logs", payload),

  update: (id: number, payload: Partial<MealLogPayload>) =>
    api.put(`/meal-logs/${id}`, payload),

  remove: (id: number) => api.delete(`/meal-logs/${id}`),
};
