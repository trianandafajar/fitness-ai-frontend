"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function fmt(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function CalendarView() {
  const router = useRouter();

  const handleClick = useCallback(
    (date: Date) => {
      router.push(`/dashboard/day?date=${fmt(date)}`);
    },
    [router],
  );

  const todayKey = fmt(new Date());

  const tileClassName = useCallback(
    ({ date, view }: { date: Date; view: string }) => {
      if (view !== "month") return "";
      return fmt(date) === todayKey ? "today-tile" : "";
    },
    [todayKey],
  );

  return (
    <div className="fitness-calendar">
      <Calendar
        onClickDay={handleClick}
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
