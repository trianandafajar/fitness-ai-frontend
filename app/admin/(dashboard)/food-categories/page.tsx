"use client";

import { useEffect, useState, useCallback } from "react";
import { adminService } from "@/services/admin.service";
import type { FoodCategory } from "@/types/admin";
import { toast } from "@/components/ui/Toast";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";

interface CategoryForm {
  name: string;
  slug: string;
}

const EMPTY_FORM: CategoryForm = { name: "", slug: "" };

export default function AdminFoodCategoriesPage() {
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CategoryForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getFoodCategories();
      setCategories(res.data.data);
    } catch {
      toast.error("Failed to load food categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEdit(cat: FoodCategory) {
    setEditingId(cat.id);
    setForm({ name: cat.name, slug: cat.slug });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await adminService.updateFoodCategory(editingId, form);
        toast.success("Category updated");
      } else {
        await adminService.createFoodCategory(form);
        toast.success("Category created");
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
    if (!confirm(`Delete category "${name}"?`)) return;

    setDeletingId(id);
    try {
      await adminService.deleteFoodCategory(id);
      toast.success("Category deleted");
      load();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  }

  const inputClass =
    "w-full rounded-xl border-[1.5px] border-line bg-surface px-3.5 py-3 text-[14.5px] text-ink outline-none focus:border-orange focus:bg-white";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-xl font-bold">Food Categories</h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 rounded-xl bg-orange px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-deep"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-white" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white p-8 text-center text-sm text-ink-soft">
          No categories yet.
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between rounded-xl border border-line bg-white p-4"
            >
              <div>
                <div className="text-sm font-semibold text-ink">{cat.name}</div>
                <div className="text-[12px] text-ink-soft">{cat.slug}</div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEdit(cat)}
                  className="rounded-lg p-2 text-ink-soft hover:bg-surface hover:text-ink"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  disabled={deletingId !== null}
                  className="rounded-lg p-2 text-ink-soft hover:bg-danger/5 hover:text-danger disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {deletingId === cat.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
          <div className="w-full max-w-lg rounded-t-2xl bg-white p-6 sm:rounded-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">
                {editingId ? "Edit Category" : "Add Category"}
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
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-ink">Slug</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className={inputClass}
                  required
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
