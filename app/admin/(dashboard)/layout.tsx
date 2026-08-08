"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, Dumbbell, Apple, FolderOpen, LogOut, Loader2 } from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/exercise-categories", label: "Ex. Categories", icon: FolderOpen },
  { href: "/admin/food-categories", label: "Food Categories", icon: FolderOpen },
  { href: "/admin/exercises", label: "Exercises", icon: Dumbbell },
  { href: "/admin/foods", label: "Foods", icon: Apple },

];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
      router.push("/admin/login");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-30 border-b border-line bg-white">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/admin" className="font-display text-base font-bold text-ink">
            FitnessAI <span className="text-orange">Admin</span>
          </Link>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-ink-soft transition hover:bg-surface hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loggingOut ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <LogOut size={16} />
            )}
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-5xl gap-6 p-4">
        <aside className="sticky top-14 hidden h-fit w-48 shrink-0 md:block">
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active
                      ? "bg-orange/10 text-orange-deep"
                      : "text-ink-soft hover:bg-surface hover:text-ink"
                    }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 py-2">{children}</main>
      </div>
    </div>
  );
}
