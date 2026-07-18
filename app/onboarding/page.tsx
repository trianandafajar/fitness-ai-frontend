"use client";

import { useState } from "react";
import OnboardingHeader from "@/components/onboarding/OnboardingHeader";
import StepPersonalInfo from "@/components/onboarding/StepPersonalInfo";
import StepBodyGoal from "@/components/onboarding/StepBodyGoal";
import StepFoodPreference from "@/components/onboarding/StepFoodPreference";
import StepExerciseHabit from "@/components/onboarding/StepExerciseHabit";
import StepAnalysis from "@/components/onboarding/StepAnalysis";
import { useOnboarding } from "@/hooks/useOnboarding";
import { OnboardingData, initialOnboardingData } from "@/components/onboarding/types";

const TOTAL_STEPS = 5;

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(initialOnboardingData);
  const { submitStep1, submitStep2, submitStep3, submitStep4, submitStep5, aiResult, loading, error, clearError } = useOnboarding();
  const [analyzing, setAnalyzing] = useState(false);

  function update(patch: Partial<OnboardingData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function next() {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handleStep1() {
    clearError();
    try {
      await submitStep1(data);
      next();
    } catch { }
  }

  async function handleStep2() {
    clearError();
    try {
      await submitStep2(data);
      next();
    } catch { }
  }

  async function handleStep3() {
    clearError();
    try {
      await submitStep3(data);
      next();
    } catch { }
  }

  async function handleStep4() {
    clearError();
    try {
      await submitStep4(data);
      next();
    } catch { }
  }

  async function handleStep5() {
    clearError();
    setAnalyzing(true);
    try {
      await submitStep5();
      next();
    } catch { }
    finally {
      setAnalyzing(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-140 flex-col px-6 pt-8 sm:pt-10">
      <OnboardingHeader step={step} total={TOTAL_STEPS} />

      {step === 1 && (
        <StepPersonalInfo data={data} update={update} onNext={handleStep1} loading={loading} error={error} />
      )}
      {step === 2 && (
        <StepBodyGoal data={data} update={update} onNext={handleStep2} onBack={back} loading={loading} error={error} />
      )}
      {step === 3 && (
        <StepFoodPreference data={data} update={update} onNext={handleStep3} onBack={back} loading={loading} error={error} />
      )}
      {step === 4 && (
        <StepExerciseHabit data={data} update={update} onNext={handleStep4} onBack={back} loading={loading} error={error} />
      )}
      {step === 5 && (
        <StepAnalysis aiResult={aiResult} loading={analyzing} onRetry={handleStep5} />
      )}
    </div>
  );
}
