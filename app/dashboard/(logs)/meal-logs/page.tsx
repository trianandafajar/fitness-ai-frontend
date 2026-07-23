"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, X, Coffee, Sun, Moon, Cookie, Utensils } from "lucide-react";
import { ButtonPrimary, ButtonSecondary } from "@/components/ui/Button";
import { mealLogService } from "@/services/meal-logs.service";
import type { MealLog, MealLogTodayResponse } from "@/types/dashboard";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/Drawer";
import { useConfirm } from "@/components/ui/ConfirmDrawer";

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"];
const MEAL_LABELS: Record<string, string> = {
  breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", snack: "Snack",
};
const MEAL_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  breakfast: Coffee,
  lunch: Sun,
  dinner: Moon,
  snack: Cookie,
};

function MealIcon({ type, size = 20, className }: { type: string; size?: number; className?: string }) {
  const Icon = MEAL_ICONS[type] ?? Utensils;
  return <Icon size={size} className={className} />;
}

function nowISO() {
  const d = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export default function MealLogsPage() {
  const [data, setData] = useState<MealLogTodayResponse | null>(null);
  const [logs, setLogs] = useState<MealLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    meal_type: "breakfast",
    logged_at: nowISO(),
    total_calories: "",
    total_protein_g: "",
    total_carbs_g: "",
    total_fat_g: "",
  });
  const confirm = useConfirm();

  const fetchLogs = useCallback(async () => {
    try {
      const res = await mealLogService.getToday();
      setData(res.data);
      setLogs(res.data.logs ?? []);
    } catch { } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => {
      void fetchLogs();
    }, 0);

    return () => window.clearTimeout(initialLoad);
  }, [fetchLogs]);
  function openAdd() {
    setEditingId(null);
    setForm({
      meal_type: "breakfast",
      logged_at: nowISO(),
      total_calories: "",
      total_protein_g: "",
      total_carbs_g: "",
      total_fat_g: ""
    });
    setShowModal(true);
  }

  function openEdit(meal: MealLog) {
    setEditingId(meal.id);
    setForm({
      meal_type: meal.meal_type,
      logged_at: meal.logged_at.slice(0, 16),
      total_calories: String(meal.total_calories),
      total_protein_g: String(meal.total_protein_g),
      total_carbs_g: String(meal.total_carbs_g),
      total_fat_g: String(meal.total_fat_g),
    });
    setShowModal(true);
  }

  function updateField(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSave() {
    const payload = {
      meal_type: form.meal_type,
      logged_at: form.logged_at,
      total_calories: Number(form.total_calories) || 0,
      total_protein_g: Number(form.total_protein_g) || 0,
      total_carbs_g: Number(form.total_carbs_g) || 0,
      total_fat_g: Number(form.total_fat_g) || 0,
    };

    setSaving(true);
    try {
      if (editingId) {
        await mealLogService.update(editingId, payload);
      } else {
        await mealLogService.create(payload);
      }
      setShowModal(false);
      setLoading(true);
      await fetchLogs();
    } catch { } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = await confirm({
      title: "Delete Meal Log?",
      description:
        "This meal log will be permanently deleted. This action cannot be undone.",
      confirmText: "Delete",
    });

    if (!confirmed) return;

    try {
      await mealLogService.remove(id);
      setLoading(true);
      await fetchLogs();
    } catch { }
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight sm:text-2xl">Meal Logs</h1>
          <p className="text-[13.5px] text-ink-soft">Track your daily nutrition.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 rounded-xl bg-orange px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-deep"
        >
          <Plus size={16} /> Add Meal
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-24 rounded-2xl bg-surface" />
          {[1, 2].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-surface" />
          ))}
        </div>
      ) : (
        <>
          {/* Today's Totals */}
          <div className="mb-5 grid grid-cols-4 gap-2.5">
            {[
              { label: "Calories", value: data?.totals?.total_calories ?? 0, unit: "kcal" },
              { label: "Protein", value: data?.totals?.total_protein_g ?? 0, unit: "g" },
              { label: "Carbs", value: data?.totals?.total_carbs_g ?? 0, unit: "g" },
              { label: "Fat", value: data?.totals?.total_fat_g ?? 0, unit: "g" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-line bg-white p-3 text-center">
                <div className="text-[11px] font-medium text-ink-soft">{stat.label}</div>
                <div className="font-mono text-lg font-bold text-ink">{stat.value}</div>
                <div className="text-[10px] text-ink-faint">{stat.unit}</div>
              </div>
            ))}
          </div>

          {/* Logs List */}
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm text-ink-soft">No meals logged today.</p>
              <p className="text-xs text-ink-faint">Tap &quot;Add Meal&quot; to start tracking.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {logs.map((meal) => (
                <div
                  key={meal.id}
                  className="rounded-2xl border border-line bg-white p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-orange">
                        <MealIcon type={meal.meal_type} size={20} />
                      </span>
                      <div>
                        <div className="font-display text-sm font-bold text-ink">
                          {MEAL_LABELS[meal.meal_type] ?? meal.meal_type}
                        </div>
                        <div className="text-xs text-ink-soft">{formatTime(meal.logged_at)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(meal)} className="rounded-lg p-1.5 text-ink-soft hover:bg-surface hover:text-ink">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(meal.id)} className="rounded-lg p-1.5 text-ink-soft hover:bg-surface hover:text-danger">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-2.5 flex gap-3 text-xs">
                    <span className="rounded bg-orange-tint px-2 py-0.5 font-semibold text-orange-deep">
                      {meal.total_calories} kcal
                    </span>
                    <span className="text-ink-soft">P {meal.total_protein_g}g</span>
                    <span className="text-ink-soft">C {meal.total_carbs_g}g</span>
                    <span className="text-ink-soft">F {meal.total_fat_g}g</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <Drawer open={showModal} onOpenChange={setShowModal} side="bottom">
        <DrawerContent>
          <DrawerHeader className="flex-row items-center justify-between">
            <DrawerTitle className="font-display">
              {editingId ? "Edit Meal" : "Add Meal"}
            </DrawerTitle>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="rounded-lg p-1.5 hover:bg-surface"
            >
              <X size={18} />
            </button>
          </DrawerHeader>

          <DrawerBody>
            <div className="space-y-3.5">
              <div>
                <label className="mb-1 block text-[13px] font-semibold text-ink">Meal Type</label>
                <div className="flex gap-2">
                  {MEAL_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => updateField("meal_type", type)}
                      className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-sm font-semibold transition-colors ${form.meal_type === type
                        ? "bg-orange text-white"
                        : "border border-line bg-white text-ink-soft hover:border-orange/50"
                        }`}>
                      <MealIcon type={type} size={16} />
                      {MEAL_LABELS[type]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[13px] font-semibold text-ink">Time</label>
                <input
                  type="datetime-local"
                  value={form.logged_at}
                  onChange={(e) => updateField("logged_at", e.target.value)}
                  className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: "total_calories", label: "Calories", unit: "kcal" },
                  { key: "total_protein_g", label: "Protein", unit: "g" },
                  { key: "total_carbs_g", label: "Carbs", unit: "g" },
                  { key: "total_fat_g", label: "Fat", unit: "g" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="mb-1 block text-[13px] font-semibold text-ink">
                      {field.label} <span className="font-normal text-ink-soft">({field.unit})</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={form[field.key as keyof typeof form]}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange"
                    />
                  </div>
                ))}
              </div>
            </div>
          </DrawerBody>

          <DrawerFooter className="flex-row">
            <ButtonSecondary
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 py-2.75 text-[13.5px]"
            >
              Cancel
            </ButtonSecondary>
            <ButtonPrimary
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-2.75 text-[13.5px]"
            >
              {saving ? "Saving..." : editingId ? "Update" : "Add Meal"}
            </ButtonPrimary>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
