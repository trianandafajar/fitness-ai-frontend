import { ReactNode } from "react";

interface StatMiniProps {
  label: string;
  icon: ReactNode;
  value: string;
  total?: string;
  percent?: number;
  secondaryText?: string;
}

export default function StatMini({ label, icon, value, total, percent, secondaryText }: StatMiniProps) {
  return (
    <div className="rounded-[14px] border border-line bg-white p-4">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-[12.5px] font-medium text-ink-soft">{label}</span>
        <span className="flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-orange-tint text-[15px] text-orange-deep">
          {icon}
        </span>
      </div>
      <div className="mb-2 font-mono text-[19px] font-semibold text-ink">
        {value}
        {total && <span className="text-xs font-normal text-ink-faint">/{total}</span>}
      </div>
      {typeof percent === "number" ? (
        <div className="h-1.5 overflow-hidden rounded-full bg-surface">
          <div
            className="h-full rounded-full bg-orange"
            style={{ width: `${Math.min(Math.max(percent, 0), 100)}%` }}
          />
        </div>
      ) : (
        secondaryText && <div className="text-xs text-ink-soft">{secondaryText}</div>
      )}
    </div>
  );
}
