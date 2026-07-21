"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { streakService } from "@/services/streak.service";
import type { StreakCalendarDay, StreakCalendarRangeResponse } from "@/types/dashboard";
import { addDays, formatDateKey } from "@/lib/utils";

const DAYS_PER_VIEW = 16;
const RANGE_ANCHOR = new Date(2026, 1, 1);

function getFixedRangeStart(date: Date): Date {
  const dateInUtc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const anchorInUtc = Date.UTC(RANGE_ANCHOR.getFullYear(), RANGE_ANCHOR.getMonth(), RANGE_ANCHOR.getDate());
  const dayIndex = Math.floor((dateInUtc - anchorInUtc) / (24 * 60 * 60 * 1000));
  const rangeIndex = Math.floor(dayIndex / DAYS_PER_VIEW);

  return addDays(RANGE_ANCHOR, rangeIndex * DAYS_PER_VIEW);
}

function getInitialViewStart(): Date {
  return getFixedRangeStart(new Date());
}

function CalendarSkeleton() {
  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <div className="motion-reduce:animate-none animate-pulse h-5 w-20 rounded-full bg-surface"/>
      </div>
      <div className="rounded-2xl border border-line bg-white p-4" aria-label="Loading calendar" role="status">
        <div className="mb-5 flex items-center justify-between">
          <div className="space-y-2">
            <div className="motion-reduce:animate-none animate-pulse h-5 w-32 rounded bg-surface" />
          </div>
          <div className="motion-reduce:animate-none animate-pulse flex gap-2">
            <div className="h-10 w-13 rounded-xl bg-surface" />
            <div className="h-10 w-10 rounded-xl bg-surface" />
            <div className="h-10 w-10 rounded-xl bg-surface" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: DAYS_PER_VIEW }, (_, index) => index + 1).map((item) => (
            <div key={item} className="motion-reduce:animate-none animate-pulse h-24 rounded-2xl bg-surface" />
          ))}
        </div>
      </div>
    </>
  );
}

interface CalendarViewProps {
  refreshKey?: number;
}

export default function CalendarView({ refreshKey = 0 }: CalendarViewProps) {
  const router = useRouter();
  const [viewStart, setViewStart] = useState(getInitialViewStart);
  const [calendarData, setCalendarData] = useState<StreakCalendarRangeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const selectedRange = formatDateKey(viewStart);

  useEffect(() => {
    let cancelled = false;

    streakService.getRange(selectedRange, DAYS_PER_VIEW)
      .then((response) => {
        if (!cancelled) setCalendarData(response.data);
      })
      .catch(() => {
        if (!cancelled) setCalendarData(null);
      })
      .finally(() => {
        if (!cancelled) {
          setHasLoadedOnce(true);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [refreshKey, selectedRange]);

  const dayByDate = useMemo(
    () => new Map(calendarData?.days.map((day) => [day.date, day]) ?? []),
    [calendarData],
  );

  const visibleDays = useMemo(() => {
    return Array.from({ length: DAYS_PER_VIEW }, (_, index) => addDays(viewStart, index));
  }, [viewStart]);

  const todayKey = formatDateKey(new Date());
  const todayRangeKey = formatDateKey(getInitialViewStart());
  const isTodayRange = selectedRange === todayRangeKey;
  const monthLabel = viewStart.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const rangeLabel = `${visibleDays[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${visibleDays[visibleDays.length - 1].toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

  const handleClick = useCallback(
    (date: Date) => {
      router.push(`/dashboard/day?date=${formatDateKey(date)}`);
    },
    [router],
  );

  const movePrevious = useCallback(() => {
    setLoading(true);
    setViewStart(addDays(viewStart, -DAYS_PER_VIEW));
  }, [viewStart]);

  const moveNext = useCallback(() => {
    setLoading(true);
    setViewStart(addDays(viewStart, DAYS_PER_VIEW));
  }, [viewStart]);

  const goToToday = useCallback(() => {
    if (isTodayRange) return;

    setLoading(true);
    setViewStart(getInitialViewStart());
  }, [isTodayRange]);

  const getDayClasses = (day: StreakCalendarDay | undefined, date: Date): string => {
    const classes = [
      "relative flex min-h-24 flex-col items-center justify-center rounded-2xl border p-2 text-center transition active:scale-[0.98]",
    ];

    if (day?.status === "streak") {
      classes.push("border-green-200 bg-green-50 text-green-800 hover:bg-green-100");
    } else if (day?.status === "failed") {
      classes.push("border-red-200 bg-red-200 text-red-800 hover:bg-red-100");
    } else {
       classes.push(
        "border-orange/10 bg-white/5 text-black/50 hover:bg-orange/10"
      );
    }

    if (formatDateKey(date) === todayKey) {
      classes.push("ring-2 ring-orange/30 ring-offset-1");
    }

    return classes.join(" ");
  };

  const getStatusLabel = (day: StreakCalendarDay | undefined): string => {
    if (day?.status === "streak") return "Streak";
    if (day?.status === "failed") return "Failed";
    if (day?.status === "pending") return "Pending";
    if (day?.status === "not_started") return "Not started";
    if (day?.status === "neutral" && !day.has_schedule) return "Rest day";
    if (day?.has_schedule) return "Planned";
    return "";
  };

  if (loading && !hasLoadedOnce) {
    return <CalendarSkeleton />;
  }

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <div className="font-display text-base font-bold">Calendar</div>
      </div>
      <div className="fitness-calendar relative rounded-2xl border border-line bg-white p-4" aria-busy={loading}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="mt-1 font-display text-base font-bold text-ink">{monthLabel}</div>
            <div className="mt-0.5 text-[11px] text-ink-soft">Days {rangeLabel}</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToToday}
              disabled={isTodayRange}
              className="h-10 rounded-xl border border-orange/20 bg-orange-tint px-3 text-[11px] font-bold text-orange-deep transition hover:border-orange/40 hover:bg-orange/15 disabled:cursor-default disabled:opacity-45 focus:outline-none focus:ring-2 focus:ring-orange/30"
            >
              Today
            </button>
            <button
              type="button"
              onClick={movePrevious}
            aria-label="Show previous sixteen days"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white text-ink-soft shadow-sm transition hover:border-orange/30 hover:text-orange-deep focus:outline-none focus:ring-2 focus:ring-orange/30"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={moveNext}
            aria-label="Show next sixteen days"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white text-ink-soft shadow-sm transition hover:border-orange/30 hover:text-orange-deep focus:outline-none focus:ring-2 focus:ring-orange/30"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {visibleDays.map((date) => {
            const dateKey = formatDateKey(date);
            const day = dayByDate.get(dateKey);
            const displayDay = loading ? undefined : day;
            const statusLabel = loading ? "" : getStatusLabel(day);

            return (
              <button
                key={dateKey}
                type="button"
                onClick={() => handleClick(date)}
                aria-label={`${date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}${statusLabel ? `, ${statusLabel}` : ""}`}
                className={getDayClasses(displayDay, date)}
              >
                <span className="text-[10px] font-bold uppercase tracking-wide opacity-70">
                  {date.toLocaleDateString("en-US", { weekday: "short" })}
                </span>
                <span className="mt-1 font-display text-2xl font-bold leading-none">{date.getDate()}</span>
                {statusLabel && <span className="mt-2 text-[9px] font-bold uppercase tracking-wide opacity-75">{statusLabel}</span>}
              </button>
            );
          })}
        </div>
        {loading && (
          <div
            className="pointer-events-none absolute inset-x-0 top-17 z-10 h-0.75 overflow-hidden rounded-full bg-orange/15"
            aria-live="polite"
            aria-label="Updating streak"
            role="status"
          >
            <span className="calendar-loading-line block h-full w-1/3 rounded-full bg-orange" />
          </div>
        )}

        <style>{`
          .fitness-calendar .calendar-loading-line {
            animation: calendar-loading-line 1.2s ease-in-out infinite;
          }
          @keyframes calendar-loading-line {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(330%); }
          }
          @media (prefers-reduced-motion: reduce) {
            .fitness-calendar .calendar-loading-line {
              animation: none;
              opacity: 0.7;
              transform: translateX(0);
            }
          }
        `}</style>
      </div>
    </>
  );
}
