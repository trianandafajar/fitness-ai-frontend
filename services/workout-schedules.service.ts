import { api } from "@/lib/axios";

export interface ExerciseInput {
  name: string;
  sets?: number | null;
  reps?: number | null;
  notes?: string | null;
}

export interface EnrichExercisePayload {
  name: string;
  sets?: number | null;
  reps?: number | null;
}

export interface CreateSchedulePayload {
  day_of_week: string;
  scheduled_time?: string | null;
  exercises: ExerciseInput[];
}

export const workoutScheduleService = {
  getAll: () => api.get("/workout-schedules"),

  create: (payload: CreateSchedulePayload) =>
    api.post("/workout-schedules", payload),

  update: (id: number, payload: CreateSchedulePayload) =>
    api.put(`/workout-schedules/${id}`, payload),

  remove: (id: number) => api.delete(`/workout-schedules/${id}`),

  enrichExercise: (payload: EnrichExercisePayload) =>
    api.post("/workout-schedules/enrich-exercise", payload),
};
