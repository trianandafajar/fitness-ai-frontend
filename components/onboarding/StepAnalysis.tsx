"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ButtonPrimary } from "@/components/ui/Button";
import { AnalysisResult, OnboardingData, computeAnalysis } from "./types";

interface Props {
  data: OnboardingData;
}

export default function StepAnalysis({ data }: Props) {
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    setResult(null);
    const timer = setTimeout(() => {
      setResult(computeAnalysis(data));
    }, 1800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!result) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
        <div className="mb-6 h-14 w-14 animate-spin rounded-full border-4 border-orange-tint border-t-orange" />
        <div className="text-[14.5px] font-medium text-ink-soft">
          AI is analyzing your profile...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-2 text-[12.5px] font-semibold tracking-wide text-orange-deep">DONE</div>
      <h1 className="mb-1.5 font-display text-[22px] font-bold tracking-tight sm:text-2xl">
        Your profile is ready 🎉
      </h1>
      <p className="mb-6 text-sm leading-relaxed text-ink-soft">
        Here are the initial AI analysis results. Your workout plans &amp; meal plans have been automatically created.
      </p>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-line bg-surface p-4">
          <div className="mb-1.5 text-xs font-medium text-ink-soft">BMI</div>
          <div className="font-mono text-[22px] font-semibold text-ink">{result.bmi}</div>
          <span className="mt-1.5 inline-block rounded-full bg-orange-tint px-2.25 py-0.5 text-[11px] font-bold text-orange-deep">
            kcal/day
          </span>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4">
          <div className="mb-1.5 text-xs font-medium text-ink-soft">Target Calories</div>
          <div className="font-mono text-[22px] font-semibold text-ink">
            {result.targetCalories.toLocaleString("en-US")}
          </div>
          <span className="mt-1.5 inline-block rounded-full bg-orange-tint px-2.25 py-0.5 text-[11px] font-bold text-orange-deep">
            kcal/day
          </span>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4">
          <div className="mb-1.5 text-xs font-medium text-ink-soft">Fitness Level</div>
          <div className="text-base font-semibold text-ink">{result.fitnessLevel}</div>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4">
          <div className="mb-1.5 text-xs font-medium text-ink-soft">Target Calories</div>
          <div className="font-mono text-[22px] font-semibold text-ink">
            {result.targetCalories.toLocaleString("en-US")}
          </div>
          <span className="mt-1.5 inline-block rounded-full bg-orange-tint px-2.25 py-0.5 text-[11px] font-bold text-orange-deep">
            kcal/day
          </span>
        </div>
      </div>

      <div className="mb-6 flex items-start gap-2.5 rounded-xl bg-orange-tint p-4 text-[13.5px] leading-relaxed text-ink">
        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-orange" />
        <span>{result.note}</span>
      </div>

      <div className="mt-auto pt-1">
        <ButtonPrimary type="button" onClick={() => router.push("/dashboard")}>
          View Dashboard
        </ButtonPrimary>
      </div>
    </div>
  );
}
