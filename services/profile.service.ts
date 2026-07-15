import { api } from "@/lib/axios";
import type { MeResponse } from "@/types/auth";

export const profileService = {
  async update(data: Record<string, unknown>): Promise<MeResponse> {
    const { data: res } = await api.put<MeResponse>("/profile", data);
    return res;
  },
};
