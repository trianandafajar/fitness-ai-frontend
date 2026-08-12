import { api } from "@/lib/axios";
import type { MeResponse } from "@/types/auth";

export interface EmailChangeStatus {
  pending: boolean;
  new_email?: string | null;
  expires_in?: number;
  resend_after?: number;
}

export const profileService = {
  async update(data: Record<string, unknown>): Promise<MeResponse> {
    const { data: res } = await api.put<MeResponse>("/profile", data);
    return res;
  },

  async getEmailChangeStatus(): Promise<EmailChangeStatus> {
    const { data } = await api.get<EmailChangeStatus>("/profile/email/status");
    return data;
  },

  async initiateEmailChange(newEmail: string): Promise<{ message: string; resend_after?: number }> {
    const { data } = await api.post<{ message: string; resend_after?: number }>("/profile/email/initiate", {
      new_email: newEmail,
    });
    return data;
  },

  async verifyEmailChange(code: string): Promise<{ message: string }> {
    const { data } = await api.post<{ message: string }>("/profile/email/verify", { code });
    return data;
  },

  async cancelEmailChange(): Promise<{ message: string }> {
    const { data } = await api.post<{ message: string }>("/profile/email/cancel");
    return data;
  },
};