"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, X, TrendingUp, TrendingDown, Minus, Weight, Check } from "lucide-react";
import { ButtonPrimary, ButtonSecondary } from "@/components/ui/Button";
import { weightLogService } from "@/services/weight-logs.service";
import type { WeightLog } from "@/types/dashboard";

const WEIGHT_GOAL = 65;

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function weekRange(weekStart: string) {
  const start = new Date(weekStart + "T00:00:00");
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(start)} - ${fmt(end)}`;
}

export default function WeightLogsPage() {
  const [logs, setLogs] = useState<WeightLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    recorded_at: new Date().toISOString().slice(0, 10),
    weight_kg: "",
    notes: "",
  });

  const fetchLogs = useCallback(async () => {
    try {
      const res = await weightLogService.getAll(12);
      setLogs(res.data ?? []);
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);
  useEffect(() => {
    if (showModal) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [showModal]);

  function openAdd() {
    setEditingId(null);
    setForm({ recorded_at: new Date().toISOString().slice(0, 10), weight_kg: "", notes: "" });
    setShowModal(true);
  }

  function openEdit(log: WeightLog) {
    setEditingId(log.id);
    setForm({
      recorded_at: log.week_start,
      weight_kg: String(log.weight_kg),
      notes: log.notes ?? "",
    });
    setShowModal(true);
  }

  async function handleSave() {
    const payload = {
      recorded_at: form.recorded_at,
      weight_kg: Number(form.weight_kg),
      notes: form.notes || null,
    };

    if (!payload.weight_kg || payload.weight_kg < 20 || payload.weight_kg > 500) return;

    setSaving(true);
    try {
      if (editingId) {
        await weightLogService.update(editingId, {
          weight_kg: payload.weight_kg,
          notes: payload.notes,
        });
      } else {
        await weightLogService.create(payload);
      }
      setShowModal(false);
      setLoading(true);
      await fetchLogs();
    } catch {} finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this weight log?")) return;
    try {
      await weightLogService.remove(id);
      setLoading(true);
      await fetchLogs();
    } catch {}
  }

  const latest = logs[0];
  const prevWeight = logs[1]?.weight_kg ?? null;
  const change = latest && prevWeight !== null ? latest.weight_kg - prevWeight : null;

  function changeIcon(val: number | null) {
    if (val === null) return <Minus size={16} />;
    if (val > 0) return <TrendingUp size={16} className="text-danger" />;
    if (val < 0) return <TrendingDown size={16} className="text-success" />;
    return <Minus size={16} className="text-ink-faint" />;
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight sm:text-2xl">Weight Logs</h1>
          <p className="text-[13.5px] text-ink-soft">Track your weight progress weekly.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 rounded-xl bg-orange px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-deep"
        >
          <Plus size={16} /> Log Weight
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-32 rounded-2xl bg-surface" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-2xl bg-surface" />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Weight size={40} className="mb-3 text-ink-faint" />
          <p className="text-sm text-ink-soft">No weight logs yet.</p>
          <p className="text-xs text-ink-faint">Tap "Log Weight" to start tracking.</p>
        </div>
      ) : (
        <>
          {/* Latest Weight Card */}
          <div className="mb-5 rounded-2xl border border-line bg-white p-5">
            <div className="mb-1 text-xs font-medium text-ink-soft">Current Weight</div>
            <div className="flex items-end gap-3">
              <div className="font-display text-4xl font-bold text-ink">
                {latest.weight_kg}
                <span className="ml-0.5 text-lg font-normal text-ink-soft">kg</span>
              </div>
              <div className="mb-1 flex items-center gap-1 text-sm font-semibold">
                {changeIcon(change)}
                {change !== null && (
                  <span className={change > 0 ? "text-danger" : change < 0 ? "text-success" : "text-ink-faint"}>
                    {change > 0 ? "+" : ""}{change.toFixed(2)} kg
                  </span>
                )}
              </div>
            </div>
            <div className="mt-2 flex gap-4 text-xs text-ink-soft">
              <span>Week of {formatDate(latest.week_start)}</span>
              {WEIGHT_GOAL && (
                <span>
                  Goal: <span className="font-semibold text-ink">{WEIGHT_GOAL} kg</span>
                  {latest && (
                    <span className={latest.weight_kg <= WEIGHT_GOAL ? "ml-1 text-success" : "ml-1 text-ink-faint"}>
                      {latest.weight_kg <= WEIGHT_GOAL ? <Check className="inline h-4 w-4" /> : `${(latest.weight_kg - WEIGHT_GOAL).toFixed(1)} kg left`}
                    </span>
                  )}
                </span>
              )}
            </div>
          </div>

          {/* History List */}
          <div className="space-y-2">
            {logs.map((log, idx) => {
              const prev = logs[idx + 1]?.weight_kg ?? null;
              const diff = prev !== null ? log.weight_kg - prev : null;
              return (
                <div
                  key={log.id}
                  className="flex items-center gap-3 rounded-xl border border-line bg-white px-4 py-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-tint text-sm font-bold text-orange-deep">
                    {log.weight_kg}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-ink">{weekRange(log.week_start)}</div>
                    <div className="text-xs text-ink-soft">
                      {log.weight_kg} kg
                      {diff !== null && (
                        <span className={diff > 0 ? "ml-1.5 text-danger" : diff < 0 ? "ml-1.5 text-success" : "ml-1.5 text-ink-faint"}>
                          {diff > 0 ? "↑" : diff < 0 ? "↓" : "–"} {Math.abs(diff).toFixed(2)} kg
                        </span>
                      )}
                    </div>
                    {log.notes && <div className="mt-0.5 text-xs text-ink-faint">{log.notes}</div>}
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(log)} className="rounded-lg p-1.5 text-ink-soft hover:bg-surface hover:text-ink">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(log.id)} className="rounded-lg p-1.5 text-ink-soft hover:bg-surface hover:text-danger">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 sm:items-center">
          <div className="flex w-full flex-col rounded-t-2xl bg-white p-5 sm:w-115 sm:rounded-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">
                {editingId ? "Edit Weight" : "Log Weight"}
              </h2>
              <button onClick={() => setShowModal(false)} className="rounded-lg p-1.5 hover:bg-surface">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="mb-1 block text-[13px] font-semibold text-ink">Date</label>
                <input
                  type="date"
                  value={form.recorded_at}
                  disabled={!!editingId}
                  onChange={(e) => setForm((f) => ({ ...f, recorded_at: e.target.value }))}
                  className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange disabled:cursor-not-allowed disabled:opacity-60"
                />
                {editingId && (
                  <p className="mt-1 text-xs text-ink-faint">Date cannot be changed (weekly entry).</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-[13px] font-semibold text-ink">
                  Weight <span className="font-normal text-ink-soft">(kg)</span>
                </label>
                <input
                  type="number"
                  min="20"
                  max="500"
                  step="0.1"
                  value={form.weight_kg}
                  onChange={(e) => setForm((f) => ({ ...f, weight_kg: e.target.value }))}
                  placeholder="e.g. 68.5"
                  className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange"
                />
              </div>

              <div>
                <label className="mb-1 block text-[13px] font-semibold text-ink">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="Optional notes..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange"
                />
              </div>
            </div>

            <div className="mt-4 flex gap-2.5">
              <ButtonSecondary type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.75 text-[13.5px]">
                Cancel
              </ButtonSecondary>
              <ButtonPrimary
                type="button"
                onClick={handleSave}
                disabled={saving || !form.weight_kg}
                className="flex-1 py-2.75 text-[13.5px]"
              >
                {saving ? "Saving..." : editingId ? "Update" : "Log Weight"}
              </ButtonPrimary>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
