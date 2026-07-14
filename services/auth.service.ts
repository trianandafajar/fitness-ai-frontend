import { api } from "@/lib/axios";
import type {
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  RegisterResponse,
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
