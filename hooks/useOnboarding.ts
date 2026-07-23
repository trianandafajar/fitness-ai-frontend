"use client";

import { useState } from "react";
import { isAxiosError } from "axios";
import { onboardingService } from "@/services/onboarding.service";
import { useAuth } from "@/hooks/useAuth";
import { setProfileCompleted } from "@/lib/cookies";
import type { OnboardingData, Step5Response, AiAnalysis } from "@/components/onboarding/types";
import { GOAL_MAP } from "@/components/onboarding/types";

export function useOnboarding() {
  const { fetchUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiResult, setAiResult] = useState<AiAnalysis | null>(null);

  function clearError() {
    setError("");
  }

  async function submitStep1(data: OnboardingData) {
    setLoading(true);
    setError("");
    try {
      await onboardingService.step1({
        name: data.name,
        date_of_birth: data.dob,
        gender: data.gender.toLowerCase(),
        height_cm: Number(data.height),
        weight_kg: Number(data.weight),
      });
    } catch (err) {
      if (isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (isAxiosError(err) && err.response?.data?.errors) {
        const first = Object.values(err.response.data.errors).flat();
        setError(first[0] as string);
      } else {
        setError("Failed to save. Please try again.");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function submitStep2(data: OnboardingData) {
    setLoading(true);
    setError("");
    try {
      await onboardingService.step2({
        dietary_preferences: data.favoriteFoods,
        dietary_restrictions: data.restrictions,
        allergies: data.allergies,
        medical_conditions: data.medicalConditions || undefined,
      });
    } catch (err) {
      if (isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (isAxiosError(err) && err.response?.data?.errors) {
        const first = Object.values(err.response.data.errors).flat();
        setError(first[0] as string);
      } else {
        setError("Failed to save. Please try again.");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function submitStep3(data: OnboardingData) {
    setLoading(true);
    setError("");
    try {
      await onboardingService.step3({
        exercise_frequency: data.daysPerWeek,
        exercise_types: data.sportTypes,
        injuries: data.injuries || undefined,
      });
    } catch (err) {
      if (isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (isAxiosError(err) && err.response?.data?.errors) {
        const first = Object.values(err.response.data.errors).flat();
        setError(first[0] as string);
      } else {
        setError("Failed to save. Please try again.");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function submitStep4(data: OnboardingData) {
    setLoading(true);
    setError("");
    try {
      await onboardingService.step4({
        fitness_goal: GOAL_MAP[data.goal],
        activity_level: data.activityLevel,
        goal_weight_kg: data.goalWeight ? Number(data.goalWeight) : undefined,
      });
    } catch (err) {
      if (isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (isAxiosError(err) && err.response?.data?.errors) {
        const first = Object.values(err.response.data.errors).flat();
        setError(first[0] as string);
      } else {
        setError("Failed to save. Please try again.");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function submitStep5() {
    setLoading(true);
    setError("");
    try {
      const { data } = await onboardingService.step5();
      const result = data as Step5Response;
      if (result.ai_analysis) {
        setAiResult(result.ai_analysis);
      }
      return result;
    } catch (err) {
      if (isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("AI analysis failed. Please try again.");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function completeOnboarding() {
    setLoading(true);
    setError("");
    try {
      await onboardingService.complete();
      await fetchUser();
      setProfileCompleted();
    } catch (err) {
      if (isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to complete onboarding. Please try again.");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    submitStep1,
    submitStep2,
    submitStep3,
    submitStep4,
    submitStep5,
    completeOnboarding,
    aiResult,
    loading,
    error,
    clearError,
  };
}
