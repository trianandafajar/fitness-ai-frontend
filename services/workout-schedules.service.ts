import { api } from "@/lib/axios";

export const workoutScheduleService = {
  getAll: () => api.get("/workout-schedules"),
};
