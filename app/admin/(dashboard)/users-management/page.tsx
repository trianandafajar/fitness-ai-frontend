"use client";

import { useEffect, useState, useCallback } from "react";
import { adminService } from "@/services/admin.service";
import type { AdminUser } from "@/types/admin";
import { toast } from "@/components/ui/Toast";
import Pagination from "@/components/ui/Pagination";
import { useConfirm } from "@/components/ui/ConfirmDrawer";
import { Plus, Trash2, X, Loader2, Search, Eye, EyeOff, Pencil } from "lucide-react";

interface UserForm {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
}

interface UserFormData {
  name: string;
  email: string;
  password?: string;
  password_confirm?: string;
}

const EMPTY_FORM: UserForm = {
  name: "",
  email: "",
  password: "",
  password_confirm: "",
};

const PER_PAGE = 15;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<UserForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ lastPage: 1, total: 0, from: 0, to: 0 });
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [filterVerified, setFilterVerified] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const confirm = useConfirm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | boolean | undefined> = {
        search: query || undefined,
      };
      if (filterVerified === "verified") {
        params.email_verified = true;
      } else if (filterVerified === "unverified") {
        params.email_verified = false;
      }

      const usersRes = await adminService.getUsers(page, PER_PAGE, params);
      setUsers(usersRes.data.data.data);
      setPagination({
        lastPage: usersRes.data.data.last_page,
        total: usersRes.data.data.total,
        from: usersRes.data.data.from ?? 0,
        to: usersRes.data.data.to ?? 0,
      });
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [page, query, filterVerified]);

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
    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowForm(true);
  }

  function openEdit(user: AdminUser) {
    setEditingId(user.id);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      password_confirm: "",
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password && form.password !== form.password_confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setSaving(true);
    try {
      const payload: Record<string, string | boolean> = {
        name: form.name,
        email: form.email,
      };

      if (form.password) {
        payload.password = form.password;
        payload.password_confirm = form.password_confirm;
      }

      if (editingId) {
        await adminService.updateUser(editingId, payload);
        toast.success("User updated successfully");
      } else {
        await adminService.createUser(payload);
        toast.success("User created successfully. User needs to verify their email.");
      }
      setShowForm(false);
      load();
    } catch (err) {
      const errorMsg = (err as any)?.response?.data?.message || (editingId ? "Failed to update user" : "Failed to create user");
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number, name: string) {
    if (deletingId !== null) return;

    const confirmed = await confirm({
      title: "Delete User?",
      description: `"${name}" will be permanently deleted. This action cannot be undone.`,
      confirmText: "Delete",
    });
    if (!confirmed) return;

    setDeletingId(id);
    try {
      await adminService.deleteUser(id);
      toast.success("User deleted");

      const newTotal = pagination.total - 1;
      const lastPageAfterDelete = Math.max(1, Math.ceil(newTotal / PER_PAGE));

      if (page > lastPageAfterDelete) {
        setPage(lastPageAfterDelete);
      } else {
        load();
      }
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  }

  async function openDetail(id: number) {
    try {
      const res = await adminService.getUserDetail(id);
      setSelectedUser(res.data.data);
      setShowDetail(true);
    } catch {
      toast.error("Failed to load user details");
    }
  }

  const inputClass =
    "w-full rounded-[10px] border-[1.5px] border-line bg-surface px-3.5 py-3.25 font-sans text-[14.5px] text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-orange focus:bg-white";

  return (
    <div>
      <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="font-display text-xl font-bold">Users Management</h1>
        <button
          onClick={openAdd}
          className="flex w-full shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-orange px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-deep sm:w-auto"
        >
          <Plus size={16} />
          Add User
        </button>
      </div>

      <div className="mb-4 flex flex-col gap-2.5 sm:flex-row">
        <div className="relative flex-1 sm:max-w-xs">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
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
        <select
          value={filterVerified}
          onChange={(e) => {
            setFilterVerified(e.target.value);
            setPage(1);
          }}
          className="w-full rounded-xl border-[1.5px] border-line bg-white py-2.5 px-3 text-sm outline-none transition focus:border-orange sm:w-auto"
        >
          <option value="">All Users</option>
          <option value="verified">Email Verified</option>
          <option value="unverified">Email Unverified</option>
        </select>
      </div>

      {loading ? (
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="animate-pulse space-y-3 p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 rounded-xl bg-surface" />
            ))}
          </div>
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white p-8 text-center text-sm text-ink-soft">
          No users yet.
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-2xl border border-line bg-white lg:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-surface text-[11px] uppercase tracking-wide text-ink-soft">
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3 font-semibold text-ink">{user.name}</td>
                    <td className="px-4 py-3 text-ink-soft">{user.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                          user.email_verified_at
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {user.email_verified_at ? "Verified" : "Unverified"}
                      </span>
                    </td>
                   <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openEdit(user)}
                          className="rounded-lg p-2 text-ink-soft hover:bg-surface hover:text-ink"
                          title="Edit user"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => openDetail(user.id)}
                          className="rounded-lg p-2 text-ink-soft hover:bg-surface hover:text-ink"
                          title="View details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id, user.name)}
                          disabled={deletingId !== null}
                          className="rounded-lg p-2 text-ink-soft hover:bg-danger/5 hover:text-danger disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {deletingId === user.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-2 lg:hidden">
            {users.map((user) => (
              <div key={user.id} className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-ink">{user.name}</div>
                  <div className="mt-0.5 text-xs text-ink-soft">{user.email}</div>
                  <div className="mt-1">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        user.email_verified_at
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {user.email_verified_at ? "Verified" : "Unverified"}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => openEdit(user)}
                    className="rounded-lg p-2 text-ink-soft hover:bg-surface hover:text-ink"
                    title="Edit user"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => openDetail(user.id)}
                    className="rounded-lg p-2 text-ink-soft hover:bg-surface hover:text-ink"
                    title="View details"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id, user.name)}
                    disabled={deletingId !== null}
                    className="rounded-lg p-2 text-ink-soft hover:bg-danger/5 hover:text-danger disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {deletingId === user.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
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
          <div className="w-full max-w-lg rounded-t-2xl bg-white p-6 sm:rounded-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">
                {editingId ? "Edit User" : "Add New User"}
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
                <label className="mb-1.5 block text-[13px] font-semibold text-ink">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-ink">
                  Password {editingId ? "(leave blank to keep current)" : ""}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder={editingId ? "Leave blank to keep current" : "Minimum 8 characters"}
                    className={`${inputClass} pr-10`}
                    minLength={8}
                    required={!editingId}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-ink">
                  Confirm Password {editingId ? "(leave blank to keep current)" : ""}
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.password_confirm}
                    onChange={(e) => setForm((f) => ({ ...f, password_confirm: e.target.value }))}
                    placeholder={editingId ? "Re-enter to confirm" : "Re-enter password"}
                    className={`${inputClass} pr-10`}
                    minLength={8}
                    required={!editingId}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink transition"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
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
                  {saving ? "Saving..." : editingId ? "Update" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetail && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
          <div className="w-full max-w-lg rounded-t-2xl bg-white p-6 sm:rounded-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">User Details</h2>
              <button onClick={() => setShowDetail(false)} className="rounded-lg p-1.5 hover:bg-surface">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[12px] font-semibold uppercase text-ink-soft">Name</p>
                <p className="mt-1 text-sm text-ink">{selectedUser.name}</p>
              </div>

              <div>
                <p className="text-[12px] font-semibold uppercase text-ink-soft">Email</p>
                <p className="mt-1 text-sm text-ink">{selectedUser.email}</p>
              </div>

              <div>
                <p className="text-[12px] font-semibold uppercase text-ink-soft">Status</p>
                <p className="mt-1">
                  <span
                    className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                      selectedUser.email_verified_at
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {selectedUser.email_verified_at ? "Email Verified" : "Email Unverified"}
                  </span>
                </p>
              </div>

              <div>
                <p className="text-[12px] font-semibold uppercase text-ink-soft">Joined</p>
                <p className="mt-1 text-sm text-ink">
                  {new Date(selectedUser.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>

              {selectedUser.profile && (
                <>
                  <hr className="border-line" />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[12px] font-semibold uppercase text-ink-soft">Height</p>
                      <p className="mt-1 text-sm text-ink">
                        {selectedUser.profile.height_cm ? `${selectedUser.profile.height_cm} cm` : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold uppercase text-ink-soft">Weight</p>
                      <p className="mt-1 text-sm text-ink">
                        {selectedUser.profile.weight_kg ? `${selectedUser.profile.weight_kg} kg` : "—"}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[12px] font-semibold uppercase text-ink-soft">Fitness Goal</p>
                      <p className="mt-1 text-sm text-ink">
                        {selectedUser.profile.fitness_goal || "—"}
                      </p>
                    </div>
                  </div>
                </>
              )}

              <button
                onClick={() => setShowDetail(false)}
                className="w-full rounded-xl border-[1.5px] border-line py-3 text-sm font-semibold text-ink hover:bg-surface"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
