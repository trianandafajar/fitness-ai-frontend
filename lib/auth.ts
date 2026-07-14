import type { UserProfile } from "@/types/auth";

export function isTokenValid(token: string | undefined): boolean {
  if (!token) return false;
  return /^\d+\|.+$/.test(token);
}

export function isOnboardingComplete(profile: UserProfile | null): boolean {
  return profile?.profile_completed ?? false;
}

export function getCurrentOnboardingStep(profile: UserProfile | null): number {
  return profile?.onboarding_step ?? 1;
}
