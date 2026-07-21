"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { streakService } from "@/services/streak.service";
import type { StreakCalendarResponse } from "@/types/dashboard";

function fmt(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function monthKey(date: Date): string {
  return fmt(date).slice(0, 7);
}

function CalendarSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-line bg-white p-3" aria-label="Loading calendar" role="status">
      <div className="mb-5 h-10 rounded-lg bg-surface" />
      <div className="mb-3 grid grid-cols-7 gap-2">
        {[1, 2, 3, 4, 5, 6, 7].map((item) => (
          <div key={item} className="h-3 rounded bg-surface" />
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }, (_, index) => (
          <div key={index} className="h-8 rounded-full bg-surface" />
        ))}
      </div>
    </div>
  );
}

interface CalendarViewProps {
  refreshKey?: number;
}

export default function CalendarView({ refreshKey = 0 }: CalendarViewProps) {
  const router = useRouter();
  const [activeMonth, setActiveMonth] = useState(() => new Date());
  const [calendarData, setCalendarData] = useState<StreakCalendarResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const selectedMonth = monthKey(activeMonth);

  useEffect(() => {
    let cancelled = false;

    streakService.getCalendar(selectedMonth)
      .then((response) => {
        if (!cancelled) setCalendarData(response.data);
      })
      .catch(() => {
        if (!cancelled) setCalendarData(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [refreshKey, selectedMonth]);

  const handleClick = useCallback(
    (date: Date) => {
      router.push(`/dashboard/day?date=${fmt(date)}`);
    },
    [router],
  );

  const handleMonthChange = useCallback(({ activeStartDate }: { activeStartDate: Date | null }) => {
    if (!activeStartDate) return;
    setLoading(true);
    setActiveMonth(new Date(activeStartDate.getFullYear(), activeStartDate.getMonth(), 1));
  }, []);

  const dayByDate = useMemo(
    () => new Map(calendarData?.days.map((day) => [day.date, day]) ?? []),
    [calendarData],
  );

  const todayKey = fmt(new Date());

  const tileClassName = useCallback(
    ({ date, view }: { date: Date; view: string }) => {
      if (view !== "month") return "";

      const classes = [];
      const day = dayByDate.get(fmt(date));
      if (day?.status && day.status !== "neutral" && day.status !== "not_started") {
        classes.push(`streak-${day.status}`);
      }
      if (day?.status === "neutral" && !day.has_schedule) {
        classes.push("streak-no-schedule");
      }
      if (fmt(date) === todayKey) classes.push("today-tile");
      return classes.join(" ");
    },
    [dayByDate, todayKey],
  );

  if (loading) {
    return <CalendarSkeleton />;
  }

  return (
    <div className="fitness-calendar">
      <Calendar
        onClickDay={handleClick}
        onActiveStartDateChange={handleMonthChange}
        tileClassName={tileClassName}
        showNeighboringMonth={false}
        locale="en-US"
        prevLabel="‹"
        nextLabel="›"
        prev2Label={null}
        next2Label={null}
      />

      <style>{`
        .fitness-calendar {
          --cal-radius: 12px;
        }
        .fitness-calendar .react-calendar {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: var(--cal-radius);
          background: #fff;
          font-family: inherit;
          line-height: 1.2;
          padding: 8px;
        }
        .fitness-calendar .react-calendar__navigation {
          height: 40px;
          margin-bottom: 4px;
        }
        .fitness-calendar .react-calendar__navigation button {
          min-width: 36px;
          background: none;
          font-size: 15px;
          font-weight: 600;
          color: #17181c;
          border-radius: 8px;
        }
        .fitness-calendar .react-calendar__navigation button:enabled:hover,
        .fitness-calendar .react-calendar__navigation button:enabled:focus {
          background: #f9fafb;
        }
        .fitness-calendar .react-calendar__navigation__label {
          font-family: var(--font-space-grotesk, 'sans-serif');
          font-size: 14px;
          font-weight: 700;
          pointer-events: none;
        }
        .fitness-calendar .react-calendar__month-view__weekdays {
          text-transform: uppercase;
          font-size: 10.5px;
          font-weight: 700;
          color: #9ca3af;
          letter-spacing: 0.05em;
        }
        .fitness-calendar .react-calendar__month-view__weekdays__weekday {
          padding: 8px 2px;
        }
        .fitness-calendar .react-calendar__month-view__weekdays__weekday abbr {
          text-decoration: none;
        }
        .fitness-calendar .react-calendar__tile {
          max-width: 100%;
          padding: 10px 0;
          background: none;
          text-align: center;
          font-size: 13px;
          font-weight: 500;
          color: #17181c;
          border-radius: 999px;
          transition: background 0.15s;
        }
        .fitness-calendar .react-calendar__tile:enabled:hover,
        .fitness-calendar .react-calendar__tile:enabled:focus {
          background: #fff0eb;
        }
        .fitness-calendar .react-calendar__tile--now {
          background: transparent;
        }
        .fitness-calendar .react-calendar__tile.today-tile {
          background: #ff5a1f;
          color: #fff;
          font-weight: 700;
        }
        .fitness-calendar .react-calendar__tile.today-tile:enabled:hover,
        .fitness-calendar .react-calendar__tile.today-tile:enabled:focus {
          background: #d9440a;
        }
        .fitness-calendar .react-calendar__tile.streak-streak {
          background: #dcfce7;
          color: #166534;
          font-weight: 700;
        }
        .fitness-calendar .react-calendar__tile.streak-failed {
          background: #fee2e2;
          color: #b91c1c;
          font-weight: 700;
        }
        .fitness-calendar .react-calendar__tile.streak-pending {
          background: #fef3c7;
          color: #92400e;
          font-weight: 700;
        }
        .fitness-calendar .react-calendar__tile.streak-no-schedule {
          background: #f3f4f6;
          box-shadow: inset 0 0 0 1px #e5e7eb;
          color: #6b7280;
        }
        .fitness-calendar .react-calendar__tile.streak-streak:enabled:hover,
        .fitness-calendar .react-calendar__tile.streak-streak:enabled:focus {
          background: #bbf7d0;
        }
        .fitness-calendar .react-calendar__tile.streak-failed:enabled:hover,
        .fitness-calendar .react-calendar__tile.streak-failed:enabled:focus {
          background: #fecaca;
        }
        .fitness-calendar .react-calendar__tile.streak-pending:enabled:hover,
        .fitness-calendar .react-calendar__tile.streak-pending:enabled:focus {
          background: #fde68a;
        }
        .fitness-calendar .react-calendar__tile.streak-no-schedule:enabled:hover,
        .fitness-calendar .react-calendar__tile.streak-no-schedule:enabled:focus {
          background: #e5e7eb;
        }
        .fitness-calendar .react-calendar__tile.today-tile.streak-streak {
          background: #22c55e;
          color: #fff;
        }
        .fitness-calendar .react-calendar__tile.today-tile.streak-failed {
          background: #ef4444;
          color: #fff;
        }
        .fitness-calendar .react-calendar__tile.today-tile.streak-pending {
          background: #eab308;
          color: #fff;
        }
        .fitness-calendar .react-calendar__month-view__days__day--neighboringMonth {
          color: #d1d5db;
        }
        .fitness-calendar .react-calendar__tile:disabled {
          color: #d1d5db;
        }
      `}</style>
    </div>
  );
}
