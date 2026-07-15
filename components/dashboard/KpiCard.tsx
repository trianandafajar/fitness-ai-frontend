interface KpiRow {
  label: string;
  value: string;
  percent: number;
  color: string;
}

interface KpiCardProps {
  rows: KpiRow[];
  streak: { label: string; done: boolean }[];
}

export default function KpiCard({ rows, streak }: KpiCardProps) {
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-white p-[22px]">
        <div className="mb-1 text-[13px] font-bold uppercase tracking-wide text-ink-soft">
          This Week&apos;s KPIs
        </div>
        <p className="text-sm leading-relaxed text-ink-soft">
          No KPI data yet. Start tracking your workouts and meals to see your score.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-[22px]">
      <div className="mb-4 text-[13px] font-bold uppercase tracking-wide text-ink-soft">
        This Week&apos;s KPIs
      </div>

      <div className="flex flex-col gap-3.5">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="mb-[7px] flex justify-between">
              <span className="text-[13px] font-semibold text-ink">{row.label}</span>
              <span className="font-mono text-[13px] font-semibold text-ink">{row.value}</span>
            </div>
            <div className="h-[7px] overflow-hidden rounded-full bg-surface">
              <div
                className={`h-full rounded-full ${row.color}`}
                style={{ width: `${Math.min(Math.max(row.percent, 0), 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        {streak.map((day, i) => (
          <div
            key={i}
            className={`flex aspect-square flex-1 items-center justify-center rounded-[9px] text-[11px] font-bold text-white ${
              day.done ? "bg-orange" : "bg-line"
            }`}
          >
            {day.label}
          </div>
        ))}
      </div>
    </div>
  );
}
