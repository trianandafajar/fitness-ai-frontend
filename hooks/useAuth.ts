"use client";

import { useSyncExternalStore, useCallback } from "react";
import { authStore } from "@/stores/auth.store";
import { authService } from "@/services/auth.service";
import { setToken, removeToken, setProfileCompleted } from "@/lib/cookies";

export function useAuth() {
  const state = useSyncExternalStore(
    authStore.subscribe,
    authStore.getState,
    authStore.getState,
  );

  const login = useCallback(async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    setToken(response.token);
    authStore.setState({
      user: response.user,
      isAuthenticated: true,
    });
    return response;
  }, []);

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
    authStore.reset();
  }, []);

  const fetchUser = useCallback(async () => {
    const response = await authService.me();
    authStore.setState({
      user: response.user,
      profile: response.profile,
      isAuthenticated: true,
    });
    if (response.profile?.profile_completed) {
      setProfileCompleted();
    }
    return response;
  }, []);

  return { ...state, login, register, forgotPassword, resetPassword, logout, fetchUser } as const;
}
