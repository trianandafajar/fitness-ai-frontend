"use client";

import { useSyncExternalStore, useCallback } from "react";
import { authStore } from "@/stores/auth.store";
import { authService } from "@/services/auth.service";
import {
  setToken,
  removeToken,
  setProfileCompleted,
  removeProfileCompleted,
  setIsAdmin,
  removeIsAdmin,
} from "@/lib/cookies";

export function useAuth() {
  const state = useSyncExternalStore(
    authStore.subscribe,
    authStore.getState,
    authStore.getState,
  );

  const fetchUser = useCallback(async () => {
    const response = await authService.me();
    authStore.setState({
      user: response.user,
      profile: response.profile,
      isAuthenticated: true,
    });
    if (response.profile?.profile_completed) {
      setProfileCompleted();
    } else {
      removeProfileCompleted();
    }
    if (response.user?.is_admin) {
      setIsAdmin();
    } else {
      removeIsAdmin();
    }
    return response;
  }, []);

  const login = useCallback(async (email: string, password: string, remember: boolean = false) => {
    const response = await authService.login({ email, password, remember });
    setToken(response.token, remember);
    authStore.setState({
      user: response.user,
      isAuthenticated: true,
    });
    await fetchUser();
    return response;
  }, [fetchUser]);

  const register = useCallback(
    async (name: string, email: string, password: string, passwordConfirmation: string) => {
      const response = await authService.register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      return response;
    },
    [],
  );

  const verifyEmail = useCallback(async (email: string, code: string) => {
    const response = await authService.verifyEmail({ email, code });
    return response;
  }, []);

  const getVerificationStatus = useCallback(async (email: string) => {
    const response = await authService.verificationStatus(email);
    return response;
  }, []);

  const resendVerification = useCallback(async (email: string) => {
    const response = await authService.resendVerification(email);
    return response;
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    const response = await authService.forgotPassword({ email });
    return response;
  }, []);

  const resetPassword = useCallback(
    async (token: string, email: string, password: string, passwordConfirmation: string) => {
      const response = await authService.resetPassword({
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      return response;
    },
    [],
  );

  const logout = useCallback(async () => {
    await authService.logout();
    removeToken();
    removeIsAdmin();
    authStore.reset();
  }, []);

  return { ...state, login, register, verifyEmail, getVerificationStatus, resendVerification, forgotPassword, resetPassword, logout, fetchUser } as const;
}
