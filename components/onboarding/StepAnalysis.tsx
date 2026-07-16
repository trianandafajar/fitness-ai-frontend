"use client";

import { useRouter } from "next/navigation";
import { PartyPopper, AlertCircle } from "lucide-react";
import { ButtonPrimary } from "@/components/ui/Button";
import type { AiAnalysis } from "./types";

interface Props {
  aiResult: AiAnalysis | null;
  loading: boolean;
  onRetry: () => void;
}

export default function StepAnalysis({ aiResult, loading, onRetry }: Props) {
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
        <div className="mb-6 h-14 w-14 animate-spin rounded-full border-4 border-orange-tint border-t-orange" />
        <div className="text-[14.5px] font-medium text-ink-soft">
          AI is analyzing your profile...
        </div>
      </div>
    );
  }

  if (!aiResult) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-orange-tint">
          <AlertCircle className="h-7 w-7 text-orange" />
        </div>
        <h1 className="mb-2 font-display text-[22px] font-bold tracking-tight">
          Analysis unavailable
        </h1>
        <p className="mb-8 text-sm leading-relaxed text-ink-soft">
          The AI analysis is currently unavailable. Your profile has been saved
          and you can retry later.
        </p>
        <div className="flex w-full gap-3">
          <ButtonPrimary type="button" onClick={onRetry} className="flex-1">
            Retry Analysis
          </ButtonPrimary>
          <ButtonPrimary type="button" onClick={() => router.push("/dashboard")} className="flex-1">
            Go to Dashboard
          </ButtonPrimary>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-2 text-[12.5px] font-semibold tracking-wide text-orange-deep">DONE</div>
      <h1 className="mb-1.5 font-display text-[22px] font-bold tracking-tight sm:text-2xl">
        Your profile is ready <PartyPopper className="inline h-5 w-5 text-orange" />
      </h1>
      <p className="mb-6 text-sm leading-relaxed text-ink-soft">
        Your AI analysis is complete. Based on your profile, here are the
        personalized insights.
      </p>

      <div className="mb-4 rounded-xl bg-orange-tint p-4">
        <p className="text-[13.5px] leading-relaxed text-ink">
          {aiResult.summary}
        </p>
      </div>

      <h3 className="mb-2 text-[13px] font-semibold text-ink">Recommendations</h3>
      <p className="mb-5 text-sm leading-relaxed text-ink-soft">
        {aiResult.recommendations}
      </p>

      <h3 className="mb-2 text-[13px] font-semibold text-ink">Meal Suggestions</h3>
      <p className="mb-5 text-sm leading-relaxed text-ink-soft">
        {aiResult.meal_suggestions}
      </p>

      <h3 className="mb-2 text-[13px] font-semibold text-ink">Exercise Suggestions</h3>
      <p className="mb-5 text-sm leading-relaxed text-ink-soft">
        {aiResult.exercise_suggestions}
      </p>

      <div className="mt-auto pt-1">
        <ButtonPrimary type="button" onClick={() => router.push("/dashboard")}>
          View Dashboard
        </ButtonPrimary>
      </div>
    </div>
  );
}
