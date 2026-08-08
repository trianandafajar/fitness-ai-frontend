import { api } from "@/lib/axios";
import type {
  AdminDashboardData,
  AdminExercise,
  AdminFood,
  ExerciseCategory,
  FoodCategory,
  Paginated,
} from "@/types/admin";

export const adminService = {
  getDashboard: () =>
    api.get<{ data: AdminDashboardData }>("/admin/dashboard"),

  // Exercises
  getExercises: (page = 1, perPage = 15) =>
    api.get<{ data: Paginated<AdminExercise> }>("/exercises", {
      params: { page, per_page: perPage },
    }),

  createExercise: (data: Record<string, unknown>) => {
    const fd = new FormData();
    Object.entries(data).forEach(([key, val]) => {
      if (val === undefined || val === null) return;
      if (key === "target_muscles" && Array.isArray(val)) {
        val.forEach((v: string) => fd.append("target_muscles[]", v));
      } else if (val instanceof File) {
        fd.append("image", val);
      } else if (val !== "") {
        fd.append(key, String(val));
      }
    });
    return api.post<{ message: string; data: AdminExercise }>("/admin/exercises", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  updateExercise: (id: number, data: Record<string, unknown>) => {
    const fd = new FormData();
    fd.append("_method", "PUT");
    Object.entries(data).forEach(([key, val]) => {
      if (val === undefined || val === null) return;
      if (key === "target_muscles" && Array.isArray(val)) {
        val.forEach((v: string) => fd.append("target_muscles[]", v));
      } else if (val instanceof File) {
        fd.append("image", val);
      } else if (val !== "") {
        fd.append(key, String(val));
      }
    });
    return api.post<{ message: string; data: AdminExercise }>(`/admin/exercises/${id}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  deleteExercise: (id: number) =>
    api.delete<{ message: string }>(`/admin/exercises/${id}`),

  // Foods
  getFoods: (page = 1, perPage = 15) =>
    api.get<{ data: Paginated<AdminFood> }>("/foods", {
      params: { page, per_page: perPage },
    }),

  createFood: (data: Record<string, unknown>) => {
    const fd = new FormData();
    Object.entries(data).forEach(([key, val]) => {
      if (val === undefined || val === null) return;
      if (val instanceof File) {
        fd.append("image", val);
      } else if (val !== "") {
        fd.append(key, String(val));
      }
    });
    return api.post<{ message: string; data: AdminFood }>("/admin/foods", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  updateFood: (id: number, data: Record<string, unknown>) => {
    const fd = new FormData();
    fd.append("_method", "PUT");
    Object.entries(data).forEach(([key, val]) => {
      if (val === undefined || val === null) return;
      if (val instanceof File) {
        fd.append("image", val);
      } else if (val !== "") {
        fd.append(key, String(val));
      }
    });
    return api.post<{ message: string; data: AdminFood }>(`/admin/foods/${id}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  deleteFood: (id: number) =>
    api.delete<{ message: string }>(`/admin/foods/${id}`),

  // Exercise Categories
  getExerciseCategories: (page = 1, perPage = 15) =>
    api.get<{ data: Paginated<ExerciseCategory> }>("/exercise-categories", {
      params: { page, per_page: perPage },
    }),

  getAllExerciseCategories: () =>
    api.get<{ data: ExerciseCategory[] }>("/exercise-categories"),

  createExerciseCategory: (data: { name: string; slug: string }) =>
    api.post<{ message: string; data: ExerciseCategory }>("/admin/exercise-categories", data),

  updateExerciseCategory: (id: number, data: { name: string; slug: string }) =>
    api.put<{ message: string; data: ExerciseCategory }>(`/admin/exercise-categories/${id}`, data),

  deleteExerciseCategory: (id: number) =>
    api.delete<{ message: string }>(`/admin/exercise-categories/${id}`),

  // Food Categories
  getFoodCategories: (page = 1, perPage = 15) =>
    api.get<{ data: Paginated<FoodCategory> }>("/food-categories", {
      params: { page, per_page: perPage },
    }),

  getAllFoodCategories: () =>
    api.get<{ data: FoodCategory[] }>("/food-categories"),

  createFoodCategory: (data: { name: string; slug: string }) =>
    api.post<{ message: string; data: FoodCategory }>("/admin/food-categories", data),

  updateFoodCategory: (id: number, data: { name: string; slug: string }) =>
    api.put<{ message: string; data: FoodCategory }>(`/admin/food-categories/${id}`, data),

  deleteFoodCategory: (id: number) =>
    api.delete<{ message: string }>(`/admin/food-categories/${id}`),
};
