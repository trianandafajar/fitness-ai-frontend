"use client";

import { useState, useEffect, useRef, useSyncExternalStore, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import PageContainer from "@/components/ui/PageContainer";
import OnboardingHeader from "@/components/onboarding/OnboardingHeader";
import StepPersonalInfo from "@/components/onboarding/StepPersonalInfo";
import StepBodyGoal from "@/components/onboarding/StepBodyGoal";
import StepFoodPreference from "@/components/onboarding/StepFoodPreference";
import StepExerciseHabit from "@/components/onboarding/StepExerciseHabit";
import StepAnalysis from "@/components/onboarding/StepAnalysis";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useAuth } from "@/hooks/useAuth";
import { OnboardingData, initialOnboardingData } from "@/components/onboarding/types";

const TOTAL_STEPS = 5;
const STORAGE_KEY = "onboarding_data";

function restoreData(): OnboardingData {
  if (typeof window === "undefined") return initialOnboardingData;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...initialOnboardingData, ...JSON.parse(saved) };
    }
  } catch { }
  return initialOnboardingData;
}

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function OnboardingContent() {
  const hydrated = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  if (!hydrated) return null;

  return <OnboardingForm />;
}

function OnboardingForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, fetchUser } = useAuth();

  useEffect(() => {
    if (!user) {
      fetchUser().catch(() => {});
    }
  }, [fetchUser, user]);

  const savedStep = profile?.profile_completed
    ? TOTAL_STEPS
    : Math.min((profile?.onboarding_step ?? 0) + 1, TOTAL_STEPS);
  const raw = parseInt(searchParams.get("step") || String(savedStep), 10);
  const step = Math.min(Math.max(raw || 1, 1), TOTAL_STEPS);

  const [data, setData] = useState<OnboardingData>(restoreData);
  const { submitStep1, submitStep2, submitStep3, submitStep4, submitStep5, aiResult, loading, error, clearError } = useOnboarding();
  const [analyzing, setAnalyzing] = useState(false);
  const analysisTriggered = useRef(false);

  useEffect(() => {
    if (user?.name && data.name !== user.name) {
      update({ name: user.name });
    }
  }, [data.name, user?.name]);

  useEffect(() => {
    if (step === 5 && !aiResult && !analysisTriggered.current) {
      analysisTriggered.current = true;
      handleStep5();
    }
  }, [step]);

  useEffect(() => {
    if (aiResult) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [aiResult]);

  function update(patch: Partial<OnboardingData>) {
    setData((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  function next() {
    const s = Math.min(step + 1, TOTAL_STEPS);
    router.replace(`${pathname}?step=${s}`, { scroll: false });
  }

  function back() {
    const s = Math.max(step - 1, 1);
    router.replace(`${pathname}?step=${s}`, { scroll: false });
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
    } catch { }
    finally {
      setAnalyzing(false);
    }
  }

  return (
    <PageContainer className="pt-8 sm:pt-10 px-6">
      <OnboardingHeader step={step} total={TOTAL_STEPS} />

      {step === 1 && (
        <StepPersonalInfo data={data} update={update} onNext={handleStep1} loading={loading} error={error} />
      )}
      {step === 2 && (
        <StepFoodPreference data={data} update={update} onNext={handleStep2} onBack={back} loading={loading} error={error} />
      )}
      {step === 3 && (
        <StepExerciseHabit data={data} update={update} onNext={handleStep3} onBack={back} loading={loading} error={error} />
      )}
      {step === 4 && (
        <StepBodyGoal data={data} update={update} onNext={handleStep4} onBack={back} loading={loading} error={error} />
      )}
      {step === 5 && (
        <StepAnalysis aiResult={aiResult} loading={analyzing} onRetry={handleStep5} />
      )}
    </PageContainer>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={null}>
      <OnboardingContent />
    </Suspense>
  );
}
