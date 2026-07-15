import { api } from "@/lib/axios";

export interface WeightLogPayload {
  recorded_at: string;
  weight_kg: number;
  notes?: string | null;
}

export const weightLogService = {
  getAll: (weeks?: number) =>
    api.get("/weight-logs", { params: { weeks } }),

  create: (payload: WeightLogPayload) =>
    api.post("/weight-logs", payload),

  update: (id: number, payload: { weight_kg: number; notes?: string | null }) =>
    api.put(`/weight-logs/${id}`, payload),

  remove: (id: number) => api.delete(`/weight-logs/${id}`),
};
