"use client";

import { useEffect, useState, use, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, SkipBack, SkipForward, Check, Flame, Clock, Trophy, Play, Pause } from "lucide-react";
import { workoutScheduleService } from "@/services/workout-schedules.service";
import CheckinModal from "@/components/dashboard/CheckinModal";
import type { WorkoutSchedule, Exercise } from "@/types/dashboard";

const RING_RADIUS = 105;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function formatRestTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function ActiveSessionPage({
  params,
}: {
  params: Promise<{ scheduleId: string; exerciseIndex: string }>;
}) {
  const { scheduleId, exerciseIndex } = use(params);
  const router = useRouter();

  const [schedule, setSchedule] = useState<WorkoutSchedule | null>(null);
  const [loading, setLoading] = useState(true);

  // Timer state
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Set tracking
  const [currentSet, setCurrentSet] = useState(1);
  const [completedSets, setCompletedSets] = useState(0);

  // Rest countdown
  const [restCountdown, setRestCountdown] = useState(0);
  const restIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Workout complete state
  const [isComplete, setIsComplete] = useState(false);

  // Check-in modal state
  const [showCheckin, setShowCheckin] = useState(false);
  const [checkinSuccess, setCheckinSuccess] = useState(false);

  useEffect(() => {
    workoutScheduleService
      .getAll()
      .then((res) => {
        const found = res.data.find(
          (s: WorkoutSchedule) => s.id === Number(scheduleId),
        );
        setSchedule(found ?? null);
        if (found) {
          setRunning(true);
        }
      })
      .finally(() => setLoading(false));
  }, [scheduleId]);

  const exercise: Exercise | undefined =
    schedule?.exercises[Number(exerciseIndex)];
  const totalSets = exercise?.sets ?? 4;
  const restSeconds = exercise?.rest_seconds ?? 90;

  // Timer tick
  const tick = useCallback(() => {
    setElapsed((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (running && !isComplete) {
      intervalRef.current = setInterval(tick, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, isComplete, tick]);

  // Rest countdown
  useEffect(() => {
    if (restCountdown > 0 && !isComplete) {
      restIntervalRef.current = setInterval(() => {
        setRestCountdown((prev) => {
          if (prev <= 1) {
            if (restIntervalRef.current) clearInterval(restIntervalRef.current);
            setRunning(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (restIntervalRef.current) clearInterval(restIntervalRef.current);
    };
  }, [restCountdown, isComplete]);

  const togglePause = useCallback(() => {
    if (isComplete) return;
    setRunning((prev) => {
      if (prev) {
        setRestCountdown(restSeconds);
        return false;
      } else {
        setRestCountdown(0);
        return true;
      }
    });
  }, [restSeconds, isComplete]);

  const completeWorkout = useCallback(() => {
    setRunning(false);
    setRestCountdown(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (restIntervalRef.current) {
      clearInterval(restIntervalRef.current);
      restIntervalRef.current = null;
    }
    setIsComplete(true);
  }, []);

  const nextSet = useCallback(() => {
    if (isComplete) return;
    if (currentSet < totalSets) {
      setCompletedSets((prev) => prev + 1);
      setCurrentSet((prev) => prev + 1);
      setRunning(false);
      setRestCountdown(restSeconds);
    } else if (currentSet === totalSets) {
      setCompletedSets(totalSets);
      completeWorkout();
    }
  }, [currentSet, totalSets, restSeconds, isComplete, completeWorkout]);

  const prevSet = useCallback(() => {
    if (isComplete) return;
    if (currentSet > 1) {
      setCurrentSet((prev) => prev - 1);
      setRestCountdown(0);
      setRunning(true);
    }
  }, [currentSet, isComplete]);

  const ringOffset =
    RING_CIRCUMFERENCE - (RING_CIRCUMFERENCE * (elapsed % 60)) / 60;

  const estimatedCalories = exercise?.estimated_calories
    ? Math.round((exercise.estimated_calories * completedSets) / totalSets)
    : Math.round(completedSets * (exercise?.reps ?? 10) * 0.5);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange border-t-transparent" />
      </div>
    );
  }

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

  // ====== COMPLETION SCREEN ======
  if (isComplete && !showCheckin && !checkinSuccess) {
    return (
      <div className="mx-auto flex max-w-105 flex-col items-center px-5 pt-12 text-center md:pt-16">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-orange-tint">
          <Trophy className="h-8 w-8 text-orange" />
        </div>

        <h1 className="mb-2 font-display text-[22px] font-bold">
          Workout Complete!
        </h1>
        <p className="mb-8 text-[13.5px] text-ink-soft">
          Great job finishing {exercise.name}. Your progress has been recorded.
        </p>

        <div className="mb-8 grid w-full grid-cols-3 gap-3">
          <div className="rounded-[14px] border border-line bg-surface p-4 text-center">
            <Clock className="mx-auto mb-1.5 h-4.5 w-4.5 text-ink-soft" />
            <div className="font-mono text-lg font-semibold text-ink">
              {formatTime(elapsed)}
            </div>
            <div className="text-[11px] font-medium text-ink-soft">TIME</div>
          </div>
          <div className="rounded-[14px] border border-line bg-surface p-4 text-center">
            <Check className="mx-auto mb-1.5 h-4.5 w-4.5 text-ink-soft" />
            <div className="font-mono text-lg font-semibold text-ink">
              {totalSets}/{totalSets}
            </div>
            <div className="text-[11px] font-medium text-ink-soft">SETS</div>
          </div>
          <div className="rounded-[14px] border border-line bg-surface p-4 text-center">
            <Flame className="mx-auto mb-1.5 h-4.5 w-4.5 text-ink-soft" />
            <div className="font-mono text-lg font-semibold text-ink">
              ~{estimatedCalories}
            </div>
            <div className="text-[11px] font-medium text-ink-soft">KCAL</div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2.5">
          <button
            onClick={() => setShowCheckin(true)}
            className="w-full rounded-[14px] bg-orange py-3.75 text-3.75 font-bold text-white shadow-[0_6px_16px_rgba(255,90,31,0.3)] transition-colors hover:bg-orange-deep"
          >
            Check In Now
          </button>
          <button
            onClick={() =>
              router.push(`/dashboard/exercises/${scheduleId}/${exerciseIndex}`)
            }
            className="w-full rounded-[14px] border border-line bg-white py-3.75 text-3.75 font-bold text-ink transition-colors hover:border-ink-faint"
          >
            Back to Exercise
          </button>
        </div>
      </div>
    );
  }

  // ====== CHECK-IN SUCCESS ======
  if (checkinSuccess) {
    return (
      <div className="mx-auto flex max-w-105 flex-col items-center px-5 pt-12 text-center md:pt-16">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-orange-tint">
          <Check className="h-8 w-8 text-orange" strokeWidth={2.6} />
        </div>

        <h1 className="mb-2 font-display text-[22px] font-bold">
          Check-in Recorded
        </h1>
        <p className="mb-6 text-[13.5px] text-ink-soft">
          Great workout! Your attendance has been logged successfully.
        </p>

        <div className="mb-8 flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-[13px] font-bold">
          <Flame className="h-4 w-4 text-orange" /> Streak continues!
        </div>

        <button
          onClick={() => router.push("/dashboard")}
          className="w-full rounded-[14px] bg-orange py-3.75 text-3.75 font-bold text-white shadow-[0_6px_16px_rgba(255,90,31,0.3)] transition-colors hover:bg-orange-deep"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // ====== ACTIVE SESSION ======
  return (
    <>
      <div className="mx-auto flex max-w-105 flex-col px-5 pt-5 pb-6 text-center md:pt-8">
        {/* Top bar */}
        <div className="mb-2 flex items-center justify-between">
          <button
            onClick={() =>
              router.push(
                `/dashboard/exercises/${scheduleId}/${exerciseIndex}`,
              )
            }
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-ink-soft"
          >
            <X className="h-4 w-4" strokeWidth={2.2} />
          </button>
          <div className="text-[11.5px] font-bold tracking-wide text-ink-soft">
            WORKOUT · SET {currentSet}/{totalSets}
          </div>
          <div className="w-9" />
        </div>

        {/* Ring timer */}
        <div className="relative mx-auto my-5 h-57.5 w-57.5">
          <svg
            viewBox="0 0 230 230"
            className="h-full w-full"
            style={{ transform: "rotate(-90deg)" }}
          >
            <circle
              cx="115"
              cy="115"
              r={RING_RADIUS}
              fill="none"
              stroke="var(--color-orange-tint)"
              strokeWidth="10"
            />
            <circle
              cx="115"
              cy="115"
              r={RING_RADIUS}
              fill="none"
              stroke="var(--color-orange)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={ringOffset}
              className="transition-[stroke-dashoffset] duration-1000 linear"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="font-mono text-[38px] font-semibold text-ink">
              {formatTime(elapsed)}
            </div>
            <div className="mt-1 text-[11.5px] text-ink-soft">Workout time</div>
          </div>
        </div>

        {/* Exercise info */}
        <h2 className="mt-3.5 font-display text-[22px] font-bold">
          {exercise.name}
        </h2>
        <div className="mt-1.5 font-mono text-sm text-ink-soft">
          {exercise.sets ?? "—"} sets × {exercise.reps ?? "—"} reps
        </div>

        {/* Set progress dots */}
        <div className="my-4.5 flex justify-center gap-2">
          {Array.from({ length: totalSets }, (_, i) => (
            <div
              key={i}
              className={`h-1.5 w-7 rounded-full transition-colors ${i < currentSet - 1
                ? "bg-orange"
                : i === currentSet - 1
                  ? "bg-orange-deep"
                  : "bg-line"
                }`}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="mb-5 flex items-center justify-center gap-5">
          <button
            onClick={prevSet}
            disabled={currentSet <= 1 || isComplete}
            className="flex h-12.5 w-12.5 items-center justify-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-orange disabled:opacity-40"
          >
            <SkipBack className="h-4.5 w-4.5" strokeWidth={2.2} />
          </button>

          <button
            onClick={togglePause}
            disabled={isComplete}
            className="flex h-17.5 w-17.5 items-center justify-center rounded-full bg-orange shadow-[0_8px_20px_rgba(255,90,31,0.35)] transition-colors hover:bg-orange-deep disabled:opacity-40"
          >
            {running ? (
              <Pause className="h-6.5 w-6.5 text-white" fill="white" />
            ) : (
              <Play className="h-6.5 w-6.5 text-white" fill="white" />
            )}
          </button>

          <button
            onClick={nextSet}
            disabled={isComplete}
            className="flex h-12.5 w-12.5 items-center justify-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-orange disabled:opacity-40"
          >
            {currentSet === totalSets ? (
              <Check className="h-4.5 w-4.5" strokeWidth={2.4} />
            ) : (
              <SkipForward className="h-4.5 w-4.5" strokeWidth={2.2} />
            )}
          </button>
        </div>

        {/* Rest banner */}
        {restCountdown > 0 && (
          <div className="mt-auto flex items-center justify-between rounded-[14px] bg-orange-tint px-4 py-3 text-[12.5px] font-semibold text-orange-deep">
            <span>Rest before next set</span>
            <span className="font-mono">{formatRestTime(restCountdown)}</span>
          </div>
        )}
      </div>

      {/* Check-in Modal */}
      {showCheckin && schedule && (
        <CheckinModal
          schedule={schedule}
          onClose={() => setShowCheckin(false)}
          onSuccess={() => {
            setShowCheckin(false);
            setCheckinSuccess(true);
          }}
        />
      )}
    </>
  );
}
