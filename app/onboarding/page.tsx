"use client";

import { useState } from "react";
import OnboardingHeader from "@/components/onboarding/OnboardingHeader";
import StepPersonalInfo from "@/components/onboarding/StepPersonalInfo";
import StepBodyGoal from "@/components/onboarding/StepBodyGoal";
import StepFoodPreference from "@/components/onboarding/StepFoodPreference";
import StepExerciseHabit from "@/components/onboarding/StepExerciseHabit";
import StepAnalysis from "@/components/onboarding/StepAnalysis";
import { OnboardingData, initialOnboardingData } from "@/components/onboarding/types";

const TOTAL_STEPS = 5;

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(initialOnboardingData);

  function update(patch: Partial<OnboardingData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function next() {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 1));
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-140 flex-col px-6 py-8 sm:py-10">
      <OnboardingHeader step={step} total={TOTAL_STEPS} />

      {step === 1 && <StepPersonalInfo data={data} update={update} onNext={next} />}
      {step === 2 && <StepBodyGoal data={data} update={update} onNext={next} onBack={back} />}
      {step === 3 && (
        <StepFoodPreference data={data} update={update} onNext={next} onBack={back} />
      )}
      {step === 4 && (
        <StepExerciseHabit data={data} update={update} onNext={next} onBack={back} />
      )}
      {step === 5 && <StepAnalysis data={data} />}
    </div>
  );
}
