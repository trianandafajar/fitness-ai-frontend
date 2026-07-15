import { api } from "@/lib/axios";

export const attendanceService = {
  getAll: () => api.get("/attendances"),

  getToday: () => api.get("/attendances/today"),

  checkin: (formData: FormData) =>
    api.post("/attendances", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};
