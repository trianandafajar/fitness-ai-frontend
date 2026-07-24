"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import type { AdminDashboardData } from "@/types/admin";
import { Users, Dumbbell, Apple } from "lucide-react";

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getDashboard()
      .then((res) => setData(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = data
    ? [
        { label: "Users", value: data.users_count, icon: Users, color: "bg-blue-50 text-blue-600" },
        { label: "Exercises", value: data.exercises_count, icon: Dumbbell, color: "bg-orange-tint text-orange-deep" },
        { label: "Foods", value: data.foods_count, icon: Apple, color: "bg-green-50 text-green-600" },
      ]
    : [];

  return (
    <div>
      <h1 className="mb-6 font-display text-xl font-bold">Dashboard</h1>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-line bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-ink-soft">{stat.label}</div>
                  <div className="mt-1 font-display text-3xl font-bold">{stat.value}</div>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
