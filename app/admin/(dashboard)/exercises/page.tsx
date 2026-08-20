"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { adminService } from "@/services/admin.service";
import type { AdminExercise, ExerciseCategory } from "@/types/admin";
import { toast } from "@/components/ui/Toast";
import Pagination from "@/components/ui/Pagination";
import { Plus, Pencil, Trash2, X, ImageIcon, Loader2, Search, ChevronDown } from "lucide-react";

interface ExerciseForm {
  name: string;
  equipment: string;
  target_muscles: string[];
  category_id: string;
  image: File | null;
  description: string;
}

const EMPTY_FORM: ExerciseForm = {
  name: "",
  equipment: "",
  target_muscles: [],
  category_id: "",
  image: null,
  description: "",
};

const PER_PAGE = 15;

export default function AdminExercisesPage() {
  const [exercises, setExercises] = useState<AdminExercise[]>([]);
  const [categories, setCategories] = useState<ExerciseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [form, setForm] = useState<ExerciseForm>(EMPTY_FORM);
  const [muscleInput, setMuscleInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ lastPage: 1, total: 0, from: 0, to: 0 });
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const loadCategories = useCallback(async () => {
    try {
      const catRes = await adminService.getAllExerciseCategories();
      setCategories(catRes.data.data);
    } catch { }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const exRes = await adminService.getExercises(page, PER_PAGE, {
        search: query,
        category_id: categoryId,
      });
      setExercises(exRes.data.data.data);
      setPagination({
        lastPage: exRes.data.data.last_page,
        total: exRes.data.data.total,
        from: exRes.data.data.from ?? 0,
        to: exRes.data.data.to ?? 0,
      });
    } catch {
      toast.error("Failed to load exercises");
    } finally {
      setLoading(false);
    }
  }, [page, query, categoryId]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    load();
  }, [load]);

  function openAdd() {
    setEditingId(null);
    setEditingImage(null);
    setForm(EMPTY_FORM);
    setMuscleInput("");
    setPreview(null);
    setShowForm(true);
  }

  function openEdit(ex: AdminExercise) {
    setEditingId(ex.id);
    setEditingImage(ex.image_url);
    setForm({
      name: ex.name,
      equipment: ex.equipment ?? "",
      target_muscles: ex.target_muscles ?? [],
      category_id: String(ex.category_id ?? ""),
      image: null,
      description: ex.description ?? "",
    });
    setMuscleInput("");
    setPreview(null);
    setShowForm(true);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((f) => ({ ...f, image: file }));
    setPreview(URL.createObjectURL(file));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setForm((f) => ({ ...f, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  }

  function addMuscle() {
    const val = muscleInput.trim();
    if (val && !form.target_muscles.includes(val)) {
      setForm((f) => ({ ...f, target_muscles: [...f.target_muscles, val] }));
    }
    setMuscleInput("");
  }

  function removeMuscle(m: string) {
    setForm((f) => ({ ...f, target_muscles: f.target_muscles.filter((x) => x !== m) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        name: form.name,
        equipment: form.equipment,
        target_muscles: form.target_muscles,
        category_id: Number(form.category_id),
        description: form.description,
      };
      if (form.image) {
        payload.image = form.image;
      }

      if (editingId) {
        await adminService.updateExercise(editingId, payload);
        toast.success("Exercise updated");
      } else {
        await adminService.createExercise(payload);
        toast.success("Exercise created");
      }
      setShowForm(false);
      load();
    } catch {
      toast.error(editingId ? "Failed to update" : "Failed to create");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number, name: string) {
    if (deletingId !== null) return;
    if (!confirm(`Delete "${name}"?`)) return;

    setDeletingId(id);
    try {
      await adminService.deleteExercise(id);
      toast.success("Exercise deleted");
      if (exercises.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        load();
      }
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  }

  const inputClass =
    "w-full rounded-xl border-[1.5px] border-line bg-surface px-3.5 py-3 text-[14.5px] text-ink outline-none focus:border-orange focus:bg-white";

  const showImagePreview = preview ?? editingImage;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-xl font-bold">Exercises</h1>
        <button
          onClick={openAdd}
          className="flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-orange px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-deep sm:w-auto"
        >
          <Plus size={16} />
          Add Exercise
        </button>
      </div>

      <div className="mb-4 flex flex-col gap-2.5 sm:flex-row">
        <div className="relative flex-1 sm:max-w-xs">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exercises..."
            className="w-full rounded-xl border-[1.5px] border-line bg-white py-2.5 pl-9 pr-9 text-sm outline-none transition focus:border-orange [&::-webkit-search-cancel-button]:hidden"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint transition hover:text-ink"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <div className="relative w-full sm:w-auto">
          <select
            value={categoryId}
            onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}
            className="w-full appearance-none rounded-xl border-[1.5px] border-line bg-white py-2.5 pl-3 pr-9 text-sm outline-none transition focus:border-orange"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint" />
        </div>
      </div>

      {loading ? (
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="animate-pulse space-y-3 p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 rounded-xl bg-surface" />
            ))}
          </div>
        </div>
      ) : exercises.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white p-8 text-center text-sm text-ink-soft">
          No exercises yet.
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-2xl border border-line bg-white lg:block">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-surface text-[11px] uppercase tracking-wide text-ink-soft">
                  <th className="px-4 py-3 font-semibold">Exercise</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Equipment</th>
                  <th className="px-4 py-3 font-semibold">Target Muscles</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {exercises.map((ex) => (
                  <tr key={ex.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {ex.image_url ? (
                          <img
                            src={ex.image_url}
                            alt={ex.name}
                            className="h-10 w-10 shrink-0 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface">
                            <ImageIcon size={16} className="text-ink-faint" />
                          </div>
                        )}
                        <span className="font-semibold text-ink">{ex.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink-soft">{ex.category}</td>
                    <td className="px-4 py-3 text-ink-soft">{ex.equipment ?? "—"}</td>
                    <td className="px-4 py-3 text-ink-soft">
                      {ex.target_muscles?.join(", ") ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openEdit(ex)}
                          className="rounded-lg p-2 text-ink-soft hover:bg-surface hover:text-ink"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(ex.id, ex.name)}
                          disabled={deletingId !== null}
                          className="rounded-lg p-2 text-ink-soft hover:bg-danger/5 hover:text-danger disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {deletingId === ex.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-2 lg:hidden">
            {exercises.map((ex) => (
              <div key={ex.id} className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3">
                {ex.image_url ? (
                  <img src={ex.image_url} alt={ex.name} className="h-12 w-12 shrink-0 rounded-xl object-cover" />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface">
                    <ImageIcon size={18} className="text-ink-faint" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14px] font-semibold text-ink">{ex.name}</div>
                  <div className="mt-0.5 text-[12px] text-ink-soft">
                    {ex.category}
                    {ex.equipment ? ` · ${ex.equipment}` : ""}
                  </div>
                  {ex.target_muscles && ex.target_muscles.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {ex.target_muscles.map((m) => (
                        <span key={m} className="rounded-md bg-orange-tint px-1.5 py-0.5 text-[10px] font-medium text-orange-deep">
                          {m}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex shrink-0 flex-col gap-1">
                  <button
                    onClick={() => openEdit(ex)}
                    aria-label={`Edit ${ex.name}`}
                    className="rounded-lg p-2 text-ink-soft hover:bg-surface hover:text-ink"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(ex.id, ex.name)}
                    disabled={deletingId !== null}
                    aria-label={`Delete ${ex.name}`}
                    className="rounded-lg p-2 text-ink-soft hover:bg-danger/5 hover:text-danger disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {deletingId === ex.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Pagination
            page={page}
            lastPage={pagination.lastPage}
            total={pagination.total}
            from={pagination.from}
            to={pagination.to}
            onPageChange={setPage}
          />
        </>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl bg-white p-4 sm:rounded-2xl sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">
                {editingId ? "Edit Exercise" : "Add Exercise"}
              </h2>
              <button onClick={() => setShowForm(false)} className="rounded-lg p-1.5 hover:bg-surface">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-ink">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className={inputClass}
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-ink">Category</label>
                  <select
                    value={form.category_id}
                    onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
                    className={inputClass}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-ink">Equipment</label>
                  <input
                    value={form.equipment}
                    onChange={(e) => setForm((f) => ({ ...f, equipment: e.target.value }))}
                    placeholder="e.g. Dumbbell"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-ink">Image</label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {showImagePreview ? (
                  <div className="relative">
                    <img
                      src={showImagePreview}
                      alt="Preview"
                      className="h-40 w-full rounded-xl object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setForm((f) => ({ ...f, image: null }));
                        setPreview(null);
                        setEditingImage(null);
                        if (fileRef.current) fileRef.current.value = "";
                      }}
                      className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    onDragEnter={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 text-sm transition ${dragging
                        ? "border-orange bg-orange/5 text-orange-deep"
                        : "border-line text-ink-soft hover:border-orange/50 hover:text-orange-deep"
                      }`}
                  >
                    <ImageIcon size={20} />
                    {dragging ? "Drop image here" : "Drag & drop or click to choose image"}
                  </button>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-ink">Target Muscles</label>
                <div className="flex gap-2">
                  <input
                    value={muscleInput}
                    onChange={(e) => setMuscleInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addMuscle(); } }}
                    placeholder="Type and press Enter"
                    className="flex-1 rounded-xl border-[1.5px] border-line bg-surface px-3.5 py-3 text-[14.5px] text-ink outline-none focus:border-orange focus:bg-white"
                  />
                  <button type="button" onClick={addMuscle} className="rounded-xl border border-line px-3 text-sm font-medium hover:bg-surface">
                    Add
                  </button>
                </div>
                {form.target_muscles.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {form.target_muscles.map((m) => (
                      <span key={m} className="flex items-center gap-1 rounded-lg bg-orange-tint px-2 py-1 text-xs font-medium text-orange-deep">
                        {m}
                        <button type="button" onClick={() => removeMuscle(m)} className="ml-0.5">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-ink">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full rounded-xl border-[1.5px] border-line bg-surface px-3.5 py-3 text-[14.5px] text-ink outline-none focus:border-orange focus:bg-white resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 rounded-xl border-[1.5px] border-line py-3 text-[14px] font-semibold text-ink hover:bg-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-orange py-3 text-[14px] font-semibold text-white transition hover:bg-orange-deep disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
