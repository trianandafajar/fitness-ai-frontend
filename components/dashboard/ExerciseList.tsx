import Link from "next/link";
import { Dumbbell } from "lucide-react";
import { IconChevronRight } from "./icons";
import type { Exercise } from "@/types/dashboard";

interface ExerciseListProps {
  exercises: Exercise[];
  scheduleId?: number;
}

function formatMeta(ex: Exercise): string {
  const parts: string[] = [];
  if (ex.sets) parts.push(`${ex.sets}×`);
  if (ex.reps) parts.push(`${ex.reps}`);
  return parts.join("") || "—";
}

export default function ExerciseList({ exercises, scheduleId }: ExerciseListProps) {
  if (exercises.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-white p-5">
        <div className="text-sm text-ink-soft">No exercises scheduled for today.</div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {exercises.map((ex, i) => (
        <Link
          key={i}
          href={scheduleId != null ? `/dashboard/exercises/${scheduleId}/${i}` : "/dashboard/workout-schedules"}
          className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3 transition-colors hover:border-orange"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-tint">
            <Dumbbell className="h-5 w-5 text-orange-deep" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[13.5px] font-semibold text-ink">{ex.name}</div>
            <div className="font-mono text-[12px] text-ink-soft">{formatMeta(ex)}</div>
          </div>
          <IconChevronRight className="h-4 w-4 shrink-0 text-ink-faint" />
        </Link>
      ))}
    </div>
  );
}
