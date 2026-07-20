"use client";

import { useEffect, useState, useCallback } from "react";
import { BarChart3 } from "lucide-react";
import { kpiService } from "@/services/kpi.service";
import type { KpiRecord } from "@/types/dashboard";

const PERIODS = [
  { label: "4 weeks", weeks: 4 },
  { label: "8 weeks", weeks: 8 },
  { label: "12 weeks", weeks: 12 },
];

function statusColor(status: string) {
  const s = status?.toLowerCase() ?? "";
  if (s.includes("excellent")) return "bg-green-100 text-green-700";
  if (s.includes("good")) return "bg-orange-tint text-orange-deep";
  if (s.includes("needs_attention")) return "bg-amber-100 text-amber-700";
  return "bg-surface text-ink-soft";
}

function statusLabel(status: string) {
  const s = status?.toLowerCase() ?? "";
  if (s === "excellent") return "Excellent";
  if (s === "good") return "Good";
  if (s === "needs_attention") return "Needs Attention";
  return "Critical";
}

function formatWeek(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatWeekRange(start: string, end: string) {
  return `${formatWeek(start)} - ${formatWeek(end)}`;
}

export default function KpiHistoryPage() {
  const [records, setRecords] = useState<KpiRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [weeks, setWeeks] = useState(8);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await kpiService.getHistory("weekly", weeks);
      setRecords(res.data ?? []);
    } catch { } finally {
      setLoading(false);
    }
  }, [weeks]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const latest = records[0] ?? null;
  const bestRecord = records.length > 0
    ? records.reduce((best, r) => r.overall_score > best.overall_score ? r : best)
    : null;

  const avgScore = records.length > 0
    ? Math.round(records.reduce((sum, r) => sum + r.overall_score, 0) / records.length)
    : 0;

  const allScores = [...records].reverse();

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight sm:text-2xl">KPI History</h1>
          <p className="text-[13.5px] text-ink-soft">Track your weekly performance.</p>
        </div>
      </div>

      {/* Period Filter */}
      <div className="mb-5 flex gap-1.5">
        {PERIODS.map((p) => (
          <button
            key={p.weeks}
            onClick={() => setWeeks(p.weeks)}
            className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors ${weeks === p.weeks
              ? "bg-orange text-white"
              : "border border-line bg-white text-ink-soft hover:border-orange/50"
              }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-2xl bg-surface" />)}
          </div>
          <div className="h-60 rounded-2xl bg-surface" />
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-16 rounded-2xl bg-surface" />)}
        </div>
      ) : records.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BarChart3 size={40} className="mb-3 text-ink-faint" />
          <p className="text-sm text-ink-soft">No KPI history yet.</p>
          <p className="text-xs text-ink-faint">Start tracking workouts and meals to see your scores.</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="mb-5 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-line bg-white p-4 text-center">
              <div className="text-[11px] font-medium text-ink-soft">Latest Score</div>
              <div className="mt-1 font-display text-2xl font-bold text-ink">{latest?.overall_score ?? "—"}</div>
              <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${latest ? statusColor(latest.status) : ""}`}>
                {latest ? statusLabel(latest.status) : "—"}
              </span>
            </div>
            <div className="rounded-2xl border border-line bg-white p-4 text-center">
              <div className="text-[11px] font-medium text-ink-soft">Best Score</div>
              <div className="mt-1 font-display text-2xl font-bold text-ink">{bestRecord?.overall_score ?? "—"}</div>
              <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${bestRecord ? statusColor(bestRecord.status) : ""}`}>
                {bestRecord ? statusLabel(bestRecord.status) : "—"}
              </span>
            </div>
            <div className="rounded-2xl border border-line bg-white p-4 text-center">
              <div className="text-[11px] font-medium text-ink-soft">Average</div>
              <div className="mt-1 font-display text-2xl font-bold text-ink">{avgScore}</div>
              <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${statusColor(avgScore >= 85 ? "excellent" : avgScore >= 70 ? "good" : avgScore >= 50 ? "needs_attention" : "critical")}`}>
                {statusLabel(avgScore >= 85 ? "excellent" : avgScore >= 70 ? "good" : avgScore >= 50 ? "needs_attention" : "critical")}
              </span>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="mb-5 rounded-2xl border border-line bg-white p-5.5">
            <div className="mb-4 text-[13px] font-bold uppercase tracking-wide text-ink-soft">Overall Score Trend</div>
            <div className="flex items-end gap-2" style={{ height: 160 }}>
              {allScores.map((r) => (
                <div key={r.id} className="flex flex-1 flex-col items-center justify-end h-full">
                  <div
                    className="w-full rounded-t-md transition-all"
                    style={{
                      height: `${Math.max(r.overall_score, 5)}%`,
                      backgroundColor: r.overall_score >= 85 ? "#22c55e" : r.overall_score >= 70 ? "#f97316" : r.overall_score >= 50 ? "#f59e0b" : "#ef4444",
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              {allScores.map((r) => (
                <div key={r.id} className="flex-1 text-center">
                  <div className="text-[10px] font-semibold text-ink">{r.overall_score}</div>
                  <div className="text-[9px] text-ink-faint">{formatWeek(r.period_start)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Detail List */}
          <div className="space-y-2.5">
            {records.map((r) => (
              <div key={r.id} className="rounded-2xl border border-line bg-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold ${statusColor(r.status)}`}>
                      {r.overall_score}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-ink">{formatWeekRange(r.period_start, r.period_end)}</div>
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${statusColor(r.status)}`}>
                        {statusLabel(r.status)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-ink-soft">
                    {r.weight_change_kg != null && (
                      <span className={r.weight_change_kg > 0 ? "text-danger" : r.weight_change_kg < 0 ? "text-success" : ""}>
                        {r.weight_change_kg > 0 ? "+" : ""}{r.weight_change_kg}kg
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-center text-xs sm:grid-cols-3">
                  {[
                    { label: "Compliance", value: `${r.workout_compliance_pct}%` },
                    { label: "Nutrition", value: `${r.nutrition_score}` },
                    { label: "Weight Trend", value: `${r.weight_trend_score}` },
                    { label: "Consistency", value: `${r.consistency_score}%` },
                    { label: "Engagement", value: `${r.engagement_score}%` },
                  ].map((s) => (
                    <div key={s.label}>
                      <span className="text-ink-faint">{s.label}</span>
                      <div className="font-semibold text-ink">{s.value}</div>
                    </div>
                  ))}
                </div>

                {r.ai_summary && (
                  <div className="mt-2.5 rounded-xl bg-orange-tint/50 px-3 py-2 text-xs leading-relaxed text-ink">
                    {r.ai_summary}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
