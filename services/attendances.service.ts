import { api } from "@/lib/axios";

export const attendanceService = {
  getToday: () => api.get("/attendances/today"),
};
