"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Plus, Pencil, Trash2, X, Clock } from "lucide-react";
import { ButtonPrimary, ButtonSecondary } from "@/components/ui/Button";
import { mealScheduleService } from "@/services/meal-schedules.service";
import type { MealSchedule } from "@/types/dashboard";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const DAY_LABELS: Record<string, string> = {
  monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday",
  thursday: "Thursday", friday: "Friday", saturday: "Saturday", sunday: "Sunday",
};
const MEAL_TIMES = ["breakfast", "lunch", "dinner", "snack"];
const MEAL_LABELS: Record<string, string> = {
  breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", snack: "Snack",
};

function todayDay() {
  return DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
}

export default function MealSchedulesPage() {
  const [schedules, setSchedules] = useState<MealSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState(todayDay());
  const [form, setForm] = useState({
    meal_time: "breakfast",
    time: "",
    items: [] as { food: string; portion: string; notes: string }[],
  });

  // --- Draggable tabs state/refs ---
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({ startX: 0, scrollLeft: 0, moved: false });

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    dragState.current = {
      startX: e.pageX - scrollRef.current.offsetLeft,
      scrollLeft: scrollRef.current.scrollLeft,
      moved: false,
    };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - dragState.current.startX;
    if (Math.abs(walk) > 5) dragState.current.moved = true;
    scrollRef.current.scrollLeft = dragState.current.scrollLeft - walk;
  };

  const stopDragging = () => setIsDragging(false);

  const handleDayClick = (day: string) => {
    if (dragState.current.moved) {
      dragState.current.moved = false;
      return;
    }
    setSelectedDay(day);
  };
  // --- end draggable tabs logic ---

  const fetchSchedules = useCallback(async () => {
    try {
      const res = await mealScheduleService.getAll();
      setSchedules(res.data ?? []);
    } catch { } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSchedules(); }, [fetchSchedules]);
  useEffect(() => {
    if (showModal) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [showModal]);

  function schedulesForDay(day: string) {
    return schedules.filter((s) => s.day_of_week === day);
  }

  function openAdd(day: string, mealTime: string) {
    setSelectedDay(day);
    setEditingId(null);
    setForm({ meal_time: mealTime, time: "", items: [{ food: "", portion: "", notes: "" }] });
    setShowModal(true);
  }

  function openEdit(schedule: MealSchedule) {
    setSelectedDay(schedule.day_of_week);
    setEditingId(schedule.id);
    setForm({
      meal_time: schedule.meal_time,
      time: schedule.time ?? "",
      items: schedule.items.length > 0
        ? schedule.items.map((i) => ({ food: i.food, portion: i.portion ?? "", notes: i.notes ?? "" }))
        : [{ food: "", portion: "", notes: "" }],
    });
    setShowModal(true);
  }

  function addItem() {
    setForm((f) => ({ ...f, items: [...f.items, { food: "", portion: "", notes: "" }] }));
  }

  function removeItem(idx: number) {
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  }

  function updateItem(idx: number, field: string, value: string) {
    setForm((f) => {
      const items = [...f.items];
      items[idx] = { ...items[idx], [field]: value };
      return { ...f, items };
    });
  }

  async function handleSave() {
    const items = form.items.filter((i) => i.food.trim());
    if (items.length === 0) return;

    const payload = {
      day_of_week: selectedDay,
      meal_time: form.meal_time,
      time: form.time || null,
      items: items.map((i) => ({
        food: i.food,
        portion: i.portion || null,
        notes: i.notes || null,
      })),
    };

    setSaving(true);
    try {
      if (editingId) {
        await mealScheduleService.update(editingId, payload);
      } else {
        await mealScheduleService.create(payload);
      }
      setShowModal(false);
      setLoading(true);
      await fetchSchedules();
    } catch { } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this meal schedule?")) return;
    try {
      await mealScheduleService.remove(id);
      setLoading(true);
      await fetchSchedules();
    } catch { }
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight sm:text-2xl">Meal Schedules</h1>
          <p className="text-[13.5px] text-ink-soft">Plan your weekly meals.</p>
        </div>
      </div>

      {/* Day Tabs — draggable with mouse */}
      <div
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        className={`no-scrollbar mb-5 flex gap-1.5 overflow-x-auto py-1 select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
      >
        {DAYS.map((day) => {
          const isToday = day === todayDay();
          const isActive = day === selectedDay;
          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              className={`shrink-0 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors ${isActive
                ? "bg-orange text-white"
                : "border border-line bg-white text-ink-soft hover:border-orange/50"
                } ${isToday && !isActive ? "ring-2 ring-orange/30" : ""}`}
            >
              {DAY_LABELS[day]}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-surface" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {MEAL_TIMES.map((mealTime) => {
            const schedule = schedulesForDay(selectedDay).find((s) => s.meal_time === mealTime);
            return (
              <div
                key={mealTime}
                onClick={() => schedule ? openEdit(schedule) : openAdd(selectedDay, mealTime)}
                className="cursor-pointer rounded-2xl border border-line bg-white p-4 transition-colors hover:border-orange/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-tint text-sm font-bold text-orange-deep">
                      {MEAL_LABELS[mealTime][0]}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-ink">{MEAL_LABELS[mealTime]}</div>
                      {schedule?.time && (
                        <div className="flex items-center gap-1 text-xs text-ink-soft">
                          <Clock size={12} /> {schedule.time.slice(0, 5)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {schedule ? (
                      <>
                        <span className="text-xs text-ink-faint">{schedule.items.length} item{schedule.items.length > 1 ? "s" : ""}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); openEdit(schedule); }}
                          className="rounded-lg p-1.5 text-ink-soft hover:bg-surface hover:text-ink"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(schedule.id); }}
                          className="rounded-lg p-1.5 text-ink-soft hover:bg-surface hover:text-danger"
                        >
                          <Trash2 size={15} />
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-1 text-xs text-ink-faint">
                        <Plus size={14} /> Add
                      </div>
                    )}
                  </div>
                </div>

                {schedule && schedule.items.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {schedule.items.map((item, i) => (
                      <span key={i} className="rounded-lg bg-surface px-2 py-0.5 text-xs text-ink">
                        {item.food}
                        {item.portion ? ` (${item.portion})` : ""}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Empty state for day with no schedules */}
          {schedulesForDay(selectedDay).length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm text-ink-soft">No meal schedules for {DAY_LABELS[selectedDay]}.</p>
              <p className="text-xs text-ink-faint">Tap a meal slot above to add one.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 sm:items-center">
          <div className="flex w-full flex-col rounded-t-2xl bg-white p-5 sm:w-115 sm:rounded-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">
                {editingId ? "Edit Meal Schedule" : "Add Meal Schedule"}
              </h2>
              <button onClick={() => setShowModal(false)} className="rounded-lg p-1.5 hover:bg-surface">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="mb-1 block text-[13px] font-semibold text-ink">Day</label>
                  <div className="rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink">
                    {DAY_LABELS[selectedDay]}
                  </div>
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-[13px] font-semibold text-ink">Meal Time</label>
                  <div className="rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink">
                    {MEAL_LABELS[form.meal_time]}
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[13px] font-semibold text-ink">
                  Time <span className="font-normal text-ink-soft">(optional)</span>
                </label>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                  className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange"
                />
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-[13px] font-semibold text-ink">Food Items</label>
                  <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center gap-1 text-xs font-semibold text-orange hover:text-orange-deep"
                  >
                    <Plus size={14} /> Add Item
                  </button>
                </div>
                <div className="space-y-2.5">
                  {form.items.map((item, idx) => (
                    <div key={idx} className="rounded-xl border border-line p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-semibold text-ink-soft">Item {idx + 1}</span>
                        {form.items.length > 1 && (
                          <button onClick={() => removeItem(idx)} className="text-xs text-danger hover:text-danger/80">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={item.food}
                          onChange={(e) => updateItem(idx, "food", e.target.value)}
                          placeholder="Food name"
                          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange"
                        />
                        <input
                          type="text"
                          value={item.portion}
                          onChange={(e) => updateItem(idx, "portion", e.target.value)}
                          placeholder="Portion (e.g. 1 cup)"
                          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange"
                        />
                        <textarea
                          value={item.notes}
                          onChange={(e) => updateItem(idx, "notes", e.target.value)}
                          placeholder="Notes"
                          className="w-full resize-none rounded-lg border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2.5">
              <ButtonSecondary type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.75 text-[13.5px]">
                Cancel
              </ButtonSecondary>
              <ButtonPrimary
                type="button"
                onClick={handleSave}
                disabled={saving || form.items.every((i) => !i.food.trim())}
                className="flex-1 py-2.75 text-[13.5px]"
              >
                {saving ? "Saving..." : editingId ? "Update" : "Add Schedule"}
              </ButtonPrimary>
            </div>
          </div>
        </div>
      )}
    </>
  );
}