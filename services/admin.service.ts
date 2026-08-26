import { api } from "@/lib/axios";
import type {
  AdminDashboardData,
  AdminExercise,
  AdminFood,
  AdminUser,
  ExerciseCategory,
  FoodCategory,
  Paginated,
} from "@/types/admin";

export const adminService = {
  getDashboard: () =>
    api.get<{ data: AdminDashboardData }>("/admin/dashboard"),

  // Exercises
  getExercises: (
    page = 1,
    perPage = 15,
    params: { search?: string; category_id?: string } = {},
  ) =>
    api.get<{ data: Paginated<AdminExercise> }>("/exercises", {
      params: { page, per_page: perPage, ...params },
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
  getFoods: (
    page = 1,
    perPage = 15,
    params: { search?: string; category_id?: string } = {},
  ) =>
    api.get<{ data: Paginated<AdminFood> }>("/foods", {
      params: { page, per_page: perPage, ...params },
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
  getExerciseCategories: (page = 1, perPage = 15, search = "") =>
    api.get<{ data: Paginated<ExerciseCategory> }>("/exercise-categories", {
      params: { page, per_page: perPage, search: search || undefined },
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
  getFoodCategories: (page = 1, perPage = 15, search = "") =>
    api.get<{ data: Paginated<FoodCategory> }>("/food-categories", {
      params: { page, per_page: perPage, search: search || undefined },
    }),

  getAllFoodCategories: () =>
    api.get<{ data: FoodCategory[] }>("/food-categories"),

  createFoodCategory: (data: { name: string; slug: string }) =>
    api.post<{ message: string; data: FoodCategory }>("/admin/food-categories", data),

  updateFoodCategory: (id: number, data: { name: string; slug: string }) =>
    api.put<{ message: string; data: FoodCategory }>(`/admin/food-categories/${id}`, data),

  deleteFoodCategory: (id: number) =>
    api.delete<{ message: string }>(`/admin/food-categories/${id}`),

  // Users Management
  getUsers: (
    page = 1,
    perPage = 15,
    params: { search?: string; is_admin?: boolean; email_verified?: boolean } = {},
  ) =>
    api.get<{ data: Paginated<AdminUser> }>("/admin/users", {
      params: { page, per_page: perPage, ...params },
    }),

  getUserDetail: (id: number) =>
    api.get<{ data: AdminUser }>(`/admin/users/${id}`),

  createUser: (data: Record<string, unknown>) =>
    api.post<{ message: string; data: AdminUser }>("/admin/users", data),

  updateUser: (id: number, data: Record<string, unknown>) =>
    api.put<{ message: string; data: AdminUser }>(`/admin/users/${id}`, data),

  deleteUser: (id: number) =>
    api.delete<{ message: string }>(`/admin/users/${id}`),
};
