"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { User, LogOut, Flame, Bell } from "lucide-react";
import { streakService } from "@/services/streak.service";
import NotificationDropdown from "./NotificationDropdown";
import { useDashboardNotifications } from "@/hooks/useDashboardNotifications";
import { dashboardNotificationsStore } from "@/stores/dashboard-notifications.store";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 11) return "Good morning";
  if (hour < 15) return "Good afternoon";
  if (hour < 18) return "Good evening";
  return "Good evening";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Small reusable tooltip wrapper — pure Tailwind, no extra deps.
function Tooltip({
  label,
  children,
  position = "bottom",
}: {
  label: string;
  children: React.ReactNode;
  position?: "bottom" | "left";
}) {
  const posClasses =
    position === "bottom"
      ? "top-full left-1/2 mt-2 -translate-x-1/2"
      : "right-full top-1/2 mr-2 -translate-y-1/2";

  return (
    <div className="group relative flex items-center">
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute ${posClasses} z-50 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100`}
      >
        {label}
      </span>
    </div>
  );
}

export default function DashboardHeader() {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useDashboardNotifications();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [showNotif, setShowNotif] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setShowNotif(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const fetchStreak = useCallback(async () => {
    try {
      const res = await streakService.getCount();
      setStreakCount(res.data.count);
    } catch { }
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => {
      void fetchStreak();
    }, 0);

    return () => window.clearTimeout(initialLoad);
  }, [fetchStreak]);

  useEffect(() => {
    const handleStreakUpdated = () => {
      void fetchStreak();
    };

    window.addEventListener("fitness:streak-updated", handleStreakUpdated);
    return () => window.removeEventListener("fitness:streak-updated", handleStreakUpdated);
  }, [fetchStreak]);

  async function handleLogout() {
    dashboardNotificationsStore.reset();
    await logout();
    router.push("/login");
  }

  return (
    <div className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-white py-4">
      <div>
        <div className="text-[13px] text-ink-soft">{getGreeting()}</div>
        <div className="font-display text-xl font-bold text-ink">
          {user?.name ?? "User"}
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <Tooltip label={`${streakCount}-day activity streak`}>
          <div className="flex items-center gap-1">
            <Flame
              className={`h-5 w-5 ${streakCount > 0 ? "text-orange" : "text-ink-faint"}`}
              fill={streakCount > 0 ? "currentColor" : "none"}
            />
            <span
              className={`text-sm font-bold ${streakCount > 0 ? "text-ink" : "text-ink-faint"}`}
            >
              {streakCount}
            </span>
          </div>
        </Tooltip>

        <div className="relative" ref={notifRef}>
          <Tooltip label="Notifications">
            <button
              onClick={() => setShowNotif((prev) => !prev)}
              aria-label="Notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-ink-soft hover:bg-surface hover:text-ink"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange px-1 text-[9px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          </Tooltip>

          {showNotif && (
            <NotificationDropdown
              notifications={notifications}
              unreadCount={unreadCount}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              onClose={() => setShowNotif(false)}
            />
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <Tooltip label={user?.name ? `Account: ${user.name}` : "My account"}>
            <button
              onClick={() => setOpen((prev) => !prev)}
              aria-label="Account menu"
              className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-orange bg-orange-tint text-sm font-bold text-orange-deep"
            >
              {user?.name ? getInitials(user.name) : <User size={18} />}
            </button>
          </Tooltip>

          {open && (
            <div className="absolute right-0 top-full z-50 mt-2 w-44 rounded-xl border border-line bg-white py-1 shadow-lg">
              <Link
                href="/settings"
                onClick={() => setOpen(false)}
                title="View and edit your profile"
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink hover:bg-surface"
              >
                <User size={16} className="text-ink-soft" />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                title="Sign out of your account"
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-ink hover:bg-surface"
              >
                <LogOut size={16} className="text-ink-soft" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
