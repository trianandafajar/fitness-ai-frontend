import { api } from "@/lib/axios";

export const kpiService = {
  getCurrent: () => api.get("/kpi/current"),
};
