import { api } from "@/lib/axios";
import type {
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  RegisterResponse,
  VerifyEmailCredentials,
  VerifyEmailResponse,
  VerificationStatusResponse,
  ForgotPasswordCredentials,
  ResetPasswordCredentials,
  MeResponse,
  LogoutResponse,
  MessageResponse,
} from "@/types/auth";

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/auth/login", credentials);
    return data;
  },

  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    const { data } = await api.post<RegisterResponse>("/auth/register", credentials);
    return data;
  },

  async verifyEmail(credentials: VerifyEmailCredentials): Promise<VerifyEmailResponse> {
    const { data } = await api.post<VerifyEmailResponse>("/auth/verify-email", credentials);
    return data;
  },

  async verificationStatus(email: string): Promise<VerificationStatusResponse> {
    const { data } = await api.get<VerificationStatusResponse>("/auth/verify-email/status", {
      params: { email },
    });
    return data;
  },

  async resendVerification(email: string): Promise<MessageResponse> {
    const { data } = await api.post<MessageResponse>("/auth/verify-email/resend", { email });
    return data;
  },

  async forgotPassword(credentials: ForgotPasswordCredentials): Promise<MessageResponse> {
    const { data } = await api.post<MessageResponse>("/auth/forgot-password", credentials);
    return data;
  },

  async resetPassword(credentials: ResetPasswordCredentials): Promise<MessageResponse> {
    const { data } = await api.post<MessageResponse>("/auth/reset-password", credentials);
    return data;
  },

  async me(): Promise<MeResponse> {
    const { data } = await api.get<MeResponse>("/auth/me");
    return data;
  },

  async logout(): Promise<LogoutResponse> {
    const { data } = await api.post<LogoutResponse>("/auth/logout");
    return data;
  },
};
