import Link from "next/link";
import type { WorkoutSchedule } from "@/types/dashboard";
import { Timer, Check, ClipboardCheck } from "lucide-react";

interface MobileHeroCardProps {
  schedule: WorkoutSchedule | null;
  checkedIn: boolean;
  onCheckin?: (schedule: WorkoutSchedule) => void;
}

function formatDayName(day: string): string {
  return day.charAt(0).toUpperCase() + day.slice(1);
}

export default function MobileHeroCard({ schedule, checkedIn, onCheckin }: MobileHeroCardProps) {
  if (!schedule) {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-orange to-orange-deep p-6 text-white">
        <div className="relative z-5">
          <div className="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-white/70">No Workout Today</div>
          <div className="font-display text-2xl font-bold">Rest Day</div>
          <div className="mt-2 text-sm text-white/80">Set up your weekly schedule to start training.</div>
          <Link href="/dashboard/workout-schedules" className="mt-4 inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
            Set Schedule
          </Link>
        </div>
      </div>
    );
  }

  const exerciseCount = schedule.exercises.length;
  const dayLabel = formatDayName(schedule.day_of_week);
  const timeLabel = schedule.scheduled_time ?? "Anytime";

  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-orange to-orange-deep p-6 text-white">
      <svg className="absolute inset-0 h-full w-full opacity-20" viewBox="0 0 500 200" preserveAspectRatio="none">
        <path
          d="M0,140 L60,140 L80,90 L100,190 L120,40 L140,200 L160,140 L220,140 L240,110 L260,140 L500,140"
          fill="none"
          stroke="rgba(255,255,255,0.8)"
          strokeWidth="2"
        />
      </svg>

      <div className="relative z-5">
        <div className="mb-1 text-[11px] font-bold uppercase tracking-widest text-white/70">
          Today&apos;s Plan &middot; {dayLabel}
        </div>
        <div className="font-display text-2xl font-bold uppercase tracking-tight">
          {dayLabel} Workout
        </div>
        <div className="mt-1.5 font-mono text-[13px] text-white/80">
          {exerciseCount} exercise{exerciseCount !== 1 ? "s" : ""} &middot; {timeLabel}
        </div>
      </div>

      <div className="relative z-5 mt-5 flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {schedule.scheduled_time && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[11.5px] font-semibold backdrop-blur-sm">
              <Timer className="h-3.5 w-3.5" />
              <span>{timeLabel}</span>
            </span>
          )}

          {checkedIn && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[11.5px] font-semibold backdrop-blur-sm">
              <Check className="h-3.5 w-3.5" />
              <span>Checked in</span>
            </span>
          )}
        </div>
        {!checkedIn && (
          <button
            onClick={() => onCheckin?.(schedule)}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white text-orange px-3 py-1 text-[11.5px] font-semibold backdrop-blur-sm"
          >
            <ClipboardCheck className="h-3.5 w-3.5" />
            <span>Checked in</span>
          </button>
        )}
      </div>
    </div>
  );
}
