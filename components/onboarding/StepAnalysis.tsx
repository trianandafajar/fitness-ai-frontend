"use client";

import { useRouter } from "next/navigation";
import { PartyPopper, AlertCircle, Dumbbell, Utensils } from "lucide-react";
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
      {Array.isArray(aiResult.meal_suggestions) ? (
        <div className="mb-5 space-y-2">
          {aiResult.meal_suggestions.map((item, i) => {
            const fd = item.food;
            return (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-line bg-white p-3">
                {fd?.image ? (
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface">
                    <img src={fd.image} alt={fd.name} className="h-full w-full object-cover" loading="lazy" />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-orange-tint">
                    <Utensils className="h-5 w-5 text-orange-deep" />
                  </div>
                )}
                <div>
                  <div className="text-[13px] font-semibold text-ink">{fd?.name ?? item.text}</div>
                  {fd?.calories_per_100g && (
                    <div className="text-[12px] text-ink-soft">{fd.calories_per_100g} kcal/100g</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mb-5 text-sm leading-relaxed text-ink-soft">{aiResult.meal_suggestions}</p>
      )}

      <h3 className="mb-2 text-[13px] font-semibold text-ink">Exercise Suggestions</h3>
      {Array.isArray(aiResult.exercise_suggestions) ? (
        <div className="mb-5 space-y-2">
          {aiResult.exercise_suggestions.map((item, i) => {
            const ex = item.exercise;
            return (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-line bg-white p-3">
                {ex?.image ? (
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface">
                    <img src={ex.image} alt={ex.name} className="h-full w-full object-cover" loading="lazy" />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-orange-tint">
                    <Dumbbell className="h-5 w-5 text-orange-deep" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-semibold text-ink">{ex?.name ?? item.text}</div>
                  {ex?.target_muscles && (
                    <div className="mt-0.5 flex flex-wrap gap-1">
                      {ex.target_muscles.map((m) => (
                        <span key={m} className="rounded-md bg-orange-tint px-1.5 py-0.5 text-[10px] font-medium text-orange-deep">{m}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mb-5 text-sm leading-relaxed text-ink-soft">{aiResult.exercise_suggestions}</p>
      )}

      <div className="mt-auto pt-1">
        <ButtonPrimary type="button" onClick={() => router.push("/dashboard")}>
          View Dashboard
        </ButtonPrimary>
      </div>
    </div>
  );
}
