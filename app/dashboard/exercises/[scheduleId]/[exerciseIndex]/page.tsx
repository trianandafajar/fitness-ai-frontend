"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Flame, Dumbbell } from "lucide-react";
import { workoutScheduleService } from "@/services/workout-schedules.service";
import type { WorkoutSchedule, Exercise } from "@/types/dashboard";

export default function ExerciseDetailPage({
  params,
}: {
  params: Promise<{ scheduleId: string; exerciseIndex: string }>;
}) {
  const { scheduleId, exerciseIndex } = use(params);
  const router = useRouter();
  const [schedule, setSchedule] = useState<WorkoutSchedule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    workoutScheduleService
      .getAll()
      .then((res) => {
        const found = res.data.find(
          (s: WorkoutSchedule) => s.id === Number(scheduleId),
        );
        setSchedule(found ?? null);
      })
      .finally(() => setLoading(false));
  }, [scheduleId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange border-t-transparent" />
      </div>
    );
  }

  const exercise: Exercise | undefined =
    schedule?.exercises[Number(exerciseIndex)];

  if (!exercise) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <div className="text-sm text-ink-soft">Exercise not found.</div>
        <button
          onClick={() => router.back()}
          className="text-sm font-semibold text-orange-deep"
        >
          Go back
        </button>
      </div>
    );
  }

  const category = exercise.category || "General";
  const restDisplay = exercise.rest_seconds
    ? `${exercise.rest_seconds}s`
    : "90s";
  const kcalDisplay = exercise.estimated_calories
    ? `~${exercise.estimated_calories} kcal`
    : "~15 kcal";
  const repsDisplay =
    exercise.reps != null ? String(exercise.reps) : "—";

  return (
    <div className="pb-24 md:pb-10">
      {/* Visual Header */}
      <div className="relative mx-auto mt-2 h-55 max-w-100 overflow-hidden rounded-3xl bg-linear-to-br from-orange to-orange-deep md:mt-0">
        {/* Pulse line */}
        <svg
          className="absolute inset-0 h-full w-full opacity-30"
          viewBox="0 0 400 220"
          preserveAspectRatio="none"
        >
          <path
            d="M0,120 L50,120 L65,80 L80,160 L95,40 L110,180 L125,120 L170,120 L185,95 L200,120 L400,120"
            fill="none"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth="2"
          />
        </svg>

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="absolute left-3.5 top-3.5 z-10 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-white/90"
        >
          <ArrowLeft className="h-4 w-4 text-ink" strokeWidth={2.4} />
        </button>

        {/* Exercise icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Dumbbell className="h-19 w-19 text-white opacity-90" strokeWidth={1.8} />
        </div>

        {/* Kcal badge */}
        <div className="absolute bottom-3.5 right-3.5 z-10 flex items-center gap-1 rounded-full bg-white/92 px-3 py-1.5 font-mono text-xs font-semibold text-orange-deep">
          <Flame className="h-3.5 w-3.5 fill-orange-deep" /> {kcalDisplay}
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-100 px-4.5 pt-5">
        {/* Category tag */}
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-orange-tint px-3 py-1.25 text-[11.5px] font-bold text-orange-deep">
          <Dumbbell className="h-3.5 w-3.5" /> {category}
        </div>

        {/* Title */}
        <h1 className="mb-2.5 font-display text-[24px] font-bold tracking-tight">
          {exercise.name}
        </h1>

        {/* Description */}
        {exercise.description && (
          <p className="mb-5 text-[13.5px] leading-relaxed text-ink-soft">
            {exercise.description}
          </p>
        )}

        {/* Stats Grid */}
        <div className="mb-5 grid grid-cols-3 gap-2.5">
          <div className="rounded-[14px] border border-line bg-surface p-3.5 text-center">
            <div className="mb-0.5 font-mono text-lg font-semibold text-ink">
              {exercise.sets ?? "—"}
            </div>
            <div className="text-[11px] font-medium text-ink-soft">SETS</div>
          </div>
          <div className="rounded-[14px] border border-line bg-surface p-3.5 text-center">
            <div className="mb-0.5 font-mono text-lg font-semibold text-ink">
              {repsDisplay}
            </div>
            <div className="text-[11px] font-medium text-ink-soft">REPS</div>
          </div>
          <div className="rounded-[14px] border border-line bg-surface p-3.5 text-center">
            <div className="mb-0.5 font-mono text-lg font-semibold text-ink">
              {restDisplay}
            </div>
            <div className="text-[11px] font-medium text-ink-soft">REST</div>
          </div>
        </div>

        {exercise.notes && (
          <div>
            <div className="mb-2 text-[13px] font-bold">Form Notes</div>
            <div className="rounded-[14px] bg-surface p-3.5 text-[13px] leading-relaxed text-ink-soft">
              {exercise.notes}
            </div>
          </div>
        )}
      </div>

      {/* Back to Dashboard */}
      <div className="pointer-events-none fixed bottom-12 left-0 right-0 z-20 bg-linear-to-t from-white from-60% to-transparent pb-5 pt-8 md:static md:bg-none md:pt-5">
        <div className="mx-auto max-w-100 px-4.5">
          <Link
            href="/dashboard"
            className="pointer-events-auto block w-full rounded-[14px] border border-line bg-white py-3.75 text-center text-[15px] font-bold text-ink transition-colors hover:border-ink-faint"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
