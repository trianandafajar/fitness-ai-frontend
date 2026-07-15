import { api } from "@/lib/axios";

export const kpiService = {
  getCurrent: () => api.get("/kpi/current"),

  getHistory: (period = "weekly", weeks = 8) =>
    api.get("/kpi", { params: { period, weeks } }),
};
