import { api } from "@/lib/axios";
import type {
  AdminDashboardData,
  AdminExercise,
  AdminFood,
} from "@/types/admin";

export const adminService = {
  getDashboard: () =>
    api.get<{ data: AdminDashboardData }>("/admin/dashboard"),

  // Exercises
  getExercises: () =>
    api.get<{ data: AdminExercise[] }>("/exercises"),

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
  getFoods: () =>
    api.get<{ data: AdminFood[] }>("/foods"),

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
};
