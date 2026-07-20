import { type ReactNode } from "react";

interface GoalCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

export default function GoalCard({ icon, title, description, selected, onClick }: GoalCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`mb-2.5 flex w-full items-center gap-3 rounded-xl border-[1.5px] p-4 text-left transition-colors 
        ${selected ? "border-orange text-white bg-orange-tint" : "border-line bg-white hover:border-orange"}`}
    >
      <div
        className={`flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-[9px] text-lg ${selected ? "bg-orange" : "bg-orange-tint2"}`}>
        {icon}
      </div>
      <div>
        <div className="text-sm font-semibold text-ink">{title}</div>
        <div className="text-[12.5px] text-ink-soft">{description}</div>
      </div>
    </button>
  );
}
