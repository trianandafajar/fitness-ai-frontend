"use client";

import { useState } from "react";
import Link from "next/link";
import { ButtonPrimary, ButtonSecondary } from "@/components/ui/Button";
import CheckinModal from "@/components/dashboard/CheckinModal";
import type { WorkoutSchedule, AttendanceToday } from "@/types/dashboard";

interface TodayPlanCardProps {
  schedule: WorkoutSchedule | null;
  attendanceToday: AttendanceToday | null;
  loading: boolean;
  onCheckinSuccess: () => void;
}

function formatExerciseMeta(ex: WorkoutSchedule["exercises"][0]): string {
  const parts: string[] = [];
  if (ex.sets) parts.push(`${ex.sets}×`);
  if (ex.reps) parts.push(`${ex.reps}`);
  return parts.join("") || "—";
}

export default function TodayPlanCard({ schedule, attendanceToday, loading, onCheckinSuccess }: TodayPlanCardProps) {
  const [showCheckin, setShowCheckin] = useState(false);

  if (loading) {
    return (
      <div className="animate-pulse rounded-2xl border border-line bg-white p-5.5">
        <div className="mb-3.5 h-4 w-24 rounded bg-surface" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 rounded bg-surface" />
          ))}
        </div>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="rounded-2xl border border-line bg-white p-5.5">
        <div className="mb-1 text-[13px] font-bold uppercase tracking-wide text-ink-soft">
          Today&apos;s Plan
        </div>
        <p className="mb-4 text-sm leading-relaxed text-ink-soft">
          No workout scheduled for today. Set up your weekly schedule to start tracking.
        </p>
        <Link href="/dashboard/workout-schedules">
          <ButtonPrimary type="button" className="w-full py-2.75 text-[13.5px]">
            Set Workout Schedule
          </ButtonPrimary>
        </Link>
      </div>
    );
  }

  const hasAttended = attendanceToday?.has_attended && attendanceToday?.attendance?.id != null;

  return (
    <>
      <div className="rounded-2xl border border-line bg-white p-5.5">
        <div className="mb-3.5 flex items-center justify-between">
          <div className="text-[13px] font-bold uppercase tracking-wide text-ink-soft">
            Today&apos;s Plan
          </div>
          {schedule.scheduled_time && (
            <span className="rounded-full bg-surface px-2.5 py-1 text-[11.5px] font-semibold text-ink-soft">
              {schedule.scheduled_time.slice(0, 5)}
            </span>
          )}
        </div>

        <div>
          {schedule.exercises.map((ex, i) => (
            <div
              key={ex.name}
              className={`flex items-center justify-between py-2.75 ${i !== schedule.exercises.length - 1 ? "border-b border-line" : ""
                }`}
            >
              <span className="text-[13.5px] font-semibold text-ink">{ex.name}</span>
              <span className="font-mono text-[12.5px] text-ink-soft">
                {formatExerciseMeta(ex)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2.5">
          {hasAttended ? (
            <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-50 py-2.75 text-[13.5px] font-semibold text-green-700">
              <CheckIcon />
              Checked in
            </div>
          ) : (
            <ButtonPrimary
              type="button"
              onClick={() => setShowCheckin(true)}
              className="flex-1 py-2.75 text-[13.5px]"
            >
              Check In
            </ButtonPrimary>
          )}
          <Link href="/dashboard/meal-logs" className="flex-1 sm:flex-none">
            <ButtonSecondary type="button" className="w-full py-2.75 text-[13.5px]">
              Log Meal
            </ButtonSecondary>
          </Link>
        </div>
      </div>

      {showCheckin && (
        <CheckinModal
          schedule={schedule}
          onClose={() => setShowCheckin(false)}
          onSuccess={() => {
            setShowCheckin(false);
            onCheckinSuccess();
          }}
        />
      )}
    </>
  );
}

function CheckIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
