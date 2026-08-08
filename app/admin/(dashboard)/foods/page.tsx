"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { adminService } from "@/services/admin.service";
import type { AdminFood, FoodCategory } from "@/types/admin";
import { toast } from "@/components/ui/Toast";
import { Plus, Pencil, Trash2, X, ImageIcon, Loader2 } from "lucide-react";

interface FoodForm {
  name: string;
  category_id: string;
  image: File | null;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  serving_unit: string;
}

const EMPTY_FORM: FoodForm = {
  name: "",
  category_id: "",
  image: null,
  calories_per_100g: 0,
  protein_per_100g: 0,
  carbs_per_100g: 0,
  fat_per_100g: 0,
  serving_unit: "",
};

export default function AdminFoodsPage() {
  const [foods, setFoods] = useState<AdminFood[]>([]);
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [form, setForm] = useState<FoodForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [foodRes, catRes] = await Promise.all([
        adminService.getFoods(),
        adminService.getFoodCategories(),
      ]);
      setFoods(foodRes.data.data);
      setCategories(catRes.data.data);
    } catch {
      toast.error("Failed to load foods");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openAdd() {
    setEditingId(null);
    setEditingImage(null);
    setForm(EMPTY_FORM);
    setPreview(null);
    setShowForm(true);
  }

  function openEdit(food: AdminFood) {
    setEditingId(food.id);
    setEditingImage(food.image_url);
    setForm({
      name: food.name,
      category_id: String(food.category_id ?? ""),
      image: null,
      calories_per_100g: food.calories_per_100g,
      protein_per_100g: food.protein_per_100g,
      carbs_per_100g: food.carbs_per_100g,
      fat_per_100g: food.fat_per_100g,
      serving_unit: food.serving_unit ?? "",
    });
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

  function updateField<K extends keyof FoodForm>(key: K, value: FoodForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        name: form.name,
        category_id: Number(form.category_id),
        calories_per_100g: form.calories_per_100g,
        protein_per_100g: form.protein_per_100g,
        carbs_per_100g: form.carbs_per_100g,
        fat_per_100g: form.fat_per_100g,
        serving_unit: form.serving_unit,
      };
      if (form.image) {
        payload.image = form.image;
      }

      if (editingId) {
        await adminService.updateFood(editingId, payload);
        toast.success("Food updated");
      } else {
        await adminService.createFood(payload);
        toast.success("Food created");
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
      await adminService.deleteFood(id);
      toast.success("Food deleted");
      load();
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
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-xl font-bold">Foods</h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 rounded-xl bg-orange px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-deep"
        >
          <Plus size={16} />
          Add Food
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-white" />
          ))}
        </div>
      ) : foods.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white p-8 text-center text-sm text-ink-soft">
          No foods yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {foods.map((food) => (
            <div
              key={food.id}
              className="flex items-center gap-3 rounded-xl border border-line bg-white p-3"
            >
              {food.image_url ? (
                <img
                  src={food.image_url}
                  alt={food.name}
                  className="h-14 w-14 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-surface">
                  <ImageIcon size={20} className="text-ink-faint" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-ink">{food.name}</div>
                <div className="text-[12px] text-ink-soft">
                  {food.category} · {food.calories_per_100g} cal
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => openEdit(food)}
                  className="rounded-lg p-2 text-ink-soft hover:bg-surface hover:text-ink"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(food.id, food.name)}
                  disabled={deletingId !== null}
                  className="rounded-lg p-2 text-ink-soft hover:bg-danger/5 hover:text-danger disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {deletingId === food.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl bg-white p-6 sm:rounded-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">
                {editingId ? "Edit Food" : "Add Food"}
              </h2>
              <button onClick={() => setShowForm(false)} className="rounded-lg p-1.5 hover:bg-surface">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-ink">Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-ink">Category</label>
                  <select
                    value={form.category_id}
                    onChange={(e) => updateField("category_id", e.target.value)}
                    className={inputClass}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-ink">Calories / 100g</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={form.calories_per_100g}
                    onChange={(e) => updateField("calories_per_100g", Number(e.target.value))}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-ink">Protein / 100g</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={form.protein_per_100g}
                    onChange={(e) => updateField("protein_per_100g", Number(e.target.value))}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-ink">Carbs / 100g</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={form.carbs_per_100g}
                    onChange={(e) => updateField("carbs_per_100g", Number(e.target.value))}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-ink">Fat / 100g</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={form.fat_per_100g}
                    onChange={(e) => updateField("fat_per_100g", Number(e.target.value))}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-ink">Serving Unit</label>
                <input
                  value={form.serving_unit}
                  onChange={(e) => updateField("serving_unit", e.target.value)}
                  placeholder="e.g. 1 cup, 100g"
                  className={inputClass}
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
