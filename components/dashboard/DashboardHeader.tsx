import { Flame } from "lucide-react";

interface DashboardHeaderProps {
  name: string;
  dateLabel: string;
  streakDays: number;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 11) return "Good morning";
  if (hour < 15) return "Good afternoon";
  if (hour < 18) return "Good evening";
  return "Good evening";
}

export default function DashboardHeader({ name, dateLabel, streakDays }: DashboardHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="font-display text-xl font-bold tracking-tight sm:text-2xl">
          {getGreeting()}, {name}
        </div>
        <div className="text-[13.5px] text-ink-soft">{dateLabel}</div>
      </div>
      <div className="flex h-fit items-center gap-1.75 rounded-full bg-orange-tint px-4 py-2.5 text-[13.5px] font-bold text-orange-deep">
        <Flame className="h-3.75] w-3.75" /> {streakDays}-day streak
      </div>
    </div>
  );
}
