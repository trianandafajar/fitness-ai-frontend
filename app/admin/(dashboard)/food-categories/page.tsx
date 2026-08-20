"use client";

import { useEffect, useState, useCallback } from "react";
import { adminService } from "@/services/admin.service";
import type { FoodCategory } from "@/types/admin";
import { toast } from "@/components/ui/Toast";
import Pagination from "@/components/ui/Pagination";
import { useConfirm } from "@/components/ui/ConfirmDrawer";
import { Plus, Pencil, Trash2, X, Loader2, Search } from "lucide-react";

interface CategoryForm {
  name: string;
  slug: string;
}

const EMPTY_FORM: CategoryForm = { name: "", slug: "" };

const PER_PAGE = 15;

export default function AdminFoodCategoriesPage() {
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CategoryForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ lastPage: 1, total: 0, from: 0, to: 0 });
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const confirm = useConfirm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getFoodCategories(page, PER_PAGE, query);
      setCategories(res.data.data.data);
      setPagination({
        lastPage: res.data.data.last_page,
        total: res.data.data.total,
        from: res.data.data.from ?? 0,
        to: res.data.data.to ?? 0,
      });
    } catch {
      toast.error("Failed to load food categories");
    } finally {
      setLoading(false);
    }
  }, [page, query]);

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

    const confirmed = await confirm({
      title: "Delete Category?",
      description: `"${name}" will be permanently deleted. This action cannot be undone.`,
      confirmText: "Delete",
    });
    if (!confirmed) return;

    setDeletingId(id);
    try {
      await adminService.deleteFoodCategory(id);
      toast.success("Category deleted");
      if (categories.length === 1 && page > 1) {
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

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-xl font-bold">Food Categories</h1>
        <button
          onClick={openAdd}
          className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl bg-orange px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-deep"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      <div className="relative mb-4 sm:max-w-xs">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories..."
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

      {loading ? (
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="animate-pulse space-y-3 p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 rounded-xl bg-surface" />
            ))}
          </div>
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white p-8 text-center text-sm text-ink-soft">
          No categories yet.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-line bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-surface text-[11px] uppercase tracking-wide text-ink-soft">
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Slug</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3 font-semibold text-ink">{cat.name}</td>
                    <td className="px-4 py-3 text-ink-soft">{cat.slug}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
