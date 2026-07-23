"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { ButtonPrimary, ButtonSecondary } from "@/components/ui/Button";
import { workoutScheduleService } from "@/services/workout-schedules.service";
import type { WorkoutSchedule } from "@/types/dashboard";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/Drawer";
import { useConfirm } from "@/components/ui/ConfirmDrawer";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const DAY_LABELS: Record<string, string> = {
  monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday",
  thursday: "Thursday", friday: "Friday", saturday: "Saturday", sunday: "Sunday",
};

interface ExerciseRow {
  key: string;
  name: string;
  sets: string;
  reps: string;
  notes: string;
}

interface FormData {
  day_of_week: string;
  scheduled_time: string;
  exercises: ExerciseRow[];
}

const emptyForm = (day?: string): FormData => ({
  day_of_week: day ?? "monday",
  scheduled_time: "",
  exercises: [{ key: crypto.randomUUID(), name: "", sets: "", reps: "", notes: "" }],
});

export default function WorkoutSchedulesPage() {
  const [schedules, setSchedules] = useState<WorkoutSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm());
  const confirm = useConfirm();

  const fetchSchedules = useCallback(async () => {
    try {
      const res = await workoutScheduleService.getAll();
      setSchedules(res.data);
    } catch { } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => {
      void fetchSchedules();
    }, 0);

    return () => window.clearTimeout(initialLoad);
  }, [fetchSchedules]);

  const today = new Date();
  const dayIndex = today.getDay();
  const mondayOffset = dayIndex === 0 ? -6 : 1 - dayIndex;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  function getScheduleForDay(day: string) {
    return schedules.find((s) => s.day_of_week === day) ?? null;
  }

  function openAdd(day: string) {
    setEditingId(null);
    setForm(emptyForm(day));
    setShowModal(true);
  }

  function openEdit(schedule: WorkoutSchedule) {
    setEditingId(schedule.id);
    setForm({
      day_of_week: schedule.day_of_week,
      scheduled_time: schedule.scheduled_time?.slice(0, 5) ?? "",
      exercises: schedule.exercises.map((ex) => ({
        key: crypto.randomUUID(),
        name: ex.name,
        sets: ex.sets?.toString() ?? "",
        reps: ex.reps?.toString() ?? "",
        notes: ex.notes ?? "",
      })),
    });
    setShowModal(true);
  }

  function addExerciseRow() {
    setForm((f) => ({
      ...f,
      exercises: [...f.exercises, { key: crypto.randomUUID(), name: "", sets: "", reps: "", notes: "" }],
    }));
  }

  function removeExerciseRow(key: string) {
    setForm((f) => ({
      ...f,
      exercises: f.exercises.filter((e) => e.key !== key),
    }));
  }

  function updateExercise(key: string, field: keyof ExerciseRow, value: string) {
    setForm((f) => ({
      ...f,
      exercises: f.exercises.map((e) => (e.key === key ? { ...e, [field]: value } : e)),
    }));
  }

  async function handleSave() {
    const payload = {
      day_of_week: form.day_of_week,
      scheduled_time: form.scheduled_time || null,
      exercises: form.exercises
        .filter((e) => e.name.trim())
        .map((e) => ({
          name: e.name.trim(),
          sets: e.sets ? Number(e.sets) : null,
          reps: e.reps ? Number(e.reps) : null,
          notes: e.notes || null,
        })),
    };

    if (payload.exercises.length === 0) return;

    setSaving(true);
    try {
      if (editingId) {
        await workoutScheduleService.update(editingId, payload);
      } else {
        await workoutScheduleService.create(payload);
      }
      setShowModal(false);
      setLoading(true);
      await fetchSchedules();
    } catch { } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = await confirm({
      title: "Delete Workout Schedule?",
      description:
        "This workout schedule will be permanently deleted. This action cannot be undone.",
      confirmText: "Delete",
    });

    if (!confirmed) return;

    try {
      await workoutScheduleService.remove(id);
      setLoading(true);
      await fetchSchedules();
    } catch { }
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight sm:text-2xl">Workout Schedule</h1>
          <p className="text-[13.5px] text-ink-soft">Set your weekly workout plan with times.</p>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-surface" />
          ))}
        </div>
      ) : (
        <div className="space-y-2.5">
          {DAYS.map((day, i) => {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            const schedule = getScheduleForDay(day);
            const isToday = date.toDateString() === today.toDateString();

            return (
              <DayCard
                key={day}
                label={DAY_LABELS[day]}
                date={date}
                isToday={isToday}
                schedule={schedule}
                onAdd={() => openAdd(day)}
                onEdit={() => schedule && openEdit(schedule)}
                onDelete={() => schedule && handleDelete(schedule.id)}
              />
            );
          })}
        </div>
      )}

      <Drawer open={showModal} onOpenChange={setShowModal} side="bottom">
        <DrawerContent>
          <DrawerHeader className="flex-row items-center justify-between">
            <DrawerTitle className="font-display">
              {editingId ? "Edit Schedule" : "Add Schedule"}
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
            <div className="space-y-4 px-0.5">
              <div>
                <label className="mb-1 block text-[13px] font-semibold text-ink">Day</label>
                <div className="rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink">
                  {DAY_LABELS[form.day_of_week]}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[13px] font-semibold text-ink">
                  Time <span className="font-normal text-ink-soft">(optional)</span>
                </label>
                <input
                  type="time"
                  value={form.scheduled_time}
                  onChange={(e) => setForm((f) => ({ ...f, scheduled_time: e.target.value }))}
                  className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange"
                />
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-[13px] font-semibold text-ink">Exercises</label>
                  <button
                    onClick={addExerciseRow}
                    className="flex items-center gap-1 text-xs font-semibold text-orange-deep hover:underline"
                  >
                    <Plus size={14} /> Add exercise
                  </button>
                </div>

                <div className="space-y-3">
                  {form.exercises.map((ex, idx) => (
                    <div key={ex.key} className="rounded-xl border border-line p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-semibold text-ink-soft">Exercise {idx + 1}</span>
                        {form.exercises.length > 1 && (
                          <button onClick={() => removeExerciseRow(ex.key)} className="text-ink-faint hover:text-danger">
                            <X size={14} />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          placeholder="Exercise name"
                          value={ex.name}
                          onChange={(e) => updateExercise(ex.key, "name", e.target.value)}
                          className="col-span-2 rounded-xl border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange"
                        />
                        <input
                          placeholder="Sets"
                          type="number"
                          min="1"
                          value={ex.sets}
                          onChange={(e) => updateExercise(ex.key, "sets", e.target.value)}
                          className="rounded-xl border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange"
                        />
                        <input
                          placeholder="Reps"
                          type="number"
                          min="1"
                          value={ex.reps}
                          onChange={(e) => updateExercise(ex.key, "reps", e.target.value)}
                          className="rounded-xl border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange"
                        />
                      </div>
                    </div>
                  ))}
                </div>
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
                disabled={saving || !form.exercises.some((e) => e.name.trim())}
                className="flex-1 py-2.75 text-[13.5px]"
              >
                {saving ? "Saving..." : editingId ? "Update" : "Create"}
              </ButtonPrimary>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

function DayCard({
  label,
  date,
  isToday,
  schedule,
  onAdd,
  onEdit,
  onDelete,
}: {
  label: string;
  date: Date;
  isToday: boolean;
  schedule: WorkoutSchedule | null;
  onAdd: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={`rounded-2xl border bg-white p-4 transition-colors ${isToday ? "border-orange/40 bg-orange-tint/30" : "border-line"
        }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="font-display text-[15px] font-bold">{label}</span>
          <span className="text-xs text-ink-soft">
            {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
          {isToday && (
            <span className="rounded-full bg-orange/20 px-2 py-0.5 text-[10px] font-bold text-orange-deep">
              Today
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {schedule ? (
            <>
              <button onClick={onEdit} className="rounded-lg p-1.5 text-ink-soft hover:bg-surface hover:text-ink">
                <Pencil size={15} />
              </button>
              <button onClick={onDelete} className="rounded-lg p-1.5 text-ink-soft hover:bg-surface hover:text-danger">
                <Trash2 size={15} />
              </button>
            </>
          ) : (
            <button
              onClick={onAdd}
              className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-orange-deep hover:bg-orange-tint"
            >
              <Plus size={13} /> Add
            </button>
          )}
        </div>
      </div>

      {schedule ? (
        <div className="mt-2 space-y-1">
          <div className="flex items-center gap-2">
            {schedule.scheduled_time && (
              <span className="rounded bg-orange-tint px-2 py-0.5 font-mono text-[11px] font-semibold text-orange-deep">
                {schedule.scheduled_time.slice(0, 5)}
              </span>
            )}
            <span className="text-[12.5px] text-ink-soft">
              {schedule.exercises.length} exercise{schedule.exercises.length > 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {schedule.exercises.map((ex) => (
              <span
                key={ex.name}
                className="rounded-lg bg-surface px-2.5 py-1 text-[12px] font-medium text-ink"
              >
                {ex.name}
                {ex.sets && ` ${ex.sets}×${ex.reps ?? ""}`}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-1.5 text-[12.5px] text-ink-faint">No workout scheduled</p>
      )}
    </div>
  );
}
