"use client";

import { useEffect, useState } from "react";
import { attendanceService } from "@/services/attendances.service";
import type { AttendanceRecord } from "@/types/dashboard";

const STATUS_LABEL: Record<string, string> = {
  verified: "Verified",
  pending: "Pending",
  missed: "Missed",
};

const STATUS_COLOR: Record<string, string> = {
  verified: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  missed: "bg-red-100 text-red-600",
};

export default function AttendancesPage() {
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await attendanceService.getAll();
        setAttendances(res.data.data ?? []);
      } catch { } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <>
      <div className="mb-6">
        <h1 className="font-display text-xl font-bold tracking-tight sm:text-2xl">Attendance History</h1>
        <p className="text-[13.5px] text-ink-soft">All your workout check-ins.</p>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-surface" />
          ))}
        </div>
      ) : attendances.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm text-ink-soft">No attendance records yet.</p>
          <p className="text-xs text-ink-faint">Check in from the dashboard after setting a schedule.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {attendances.map((att) => {
            const date = new Date(att.checked_in_at);
            const schedule = att.workout_schedule;

            return (
              <div
                key={att.id}
                className="rounded-2xl border border-line bg-white p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-sm font-bold text-ink">
                        {date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      <span className="font-mono text-xs text-ink-soft">
                        {date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    {schedule && (
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {schedule.exercises.map((ex) => (
                          <span
                            key={ex.name}
                            className="rounded-lg bg-surface px-2 py-0.5 text-xs font-medium text-ink"
                          >
                            {ex.name}{ex.sets ? ` ${ex.sets}×${ex.reps ?? ""}` : ""}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${STATUS_COLOR[att.status] ?? "bg-surface text-ink-soft"}`}>
                    {STATUS_LABEL[att.status] ?? att.status}
                  </span>
                </div>

                {(att.latitude || att.photo_url) && (
                  <div className="mt-2.5 flex items-center gap-3 text-xs text-ink-soft">
                    {att.photo_url && (
                      <a
                        href={att.photo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-orange-deep hover:underline"
                      >
                        View photo
                      </a>
                    )}
                    {att.latitude && att.longitude && (
                      <span>
                        📍 {att.latitude}, {att.longitude}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
