"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { User, LogOut, Flame, Bell } from "lucide-react";
import { kpiService } from "@/services/kpi.service";
import { notificationService } from "@/services/notification.service";
import { getEcho } from "@/lib/echo";
import NotificationDropdown from "./NotificationDropdown";
import type { NotificationData } from "./useNotifications";

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

export default function DashboardHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [streakDays, setStreakDays] = useState(0);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotif, setShowNotif] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const fetchStreak = useCallback(async () => {
    try {
      const res = await kpiService.getCurrent();
      const score = res.data?.today?.data?.consistency_score;
      if (score != null) setStreakDays(score);
    } catch { }
  }, []);

  const fetchNotifCount = useCallback(async () => {
    try {
      const res = await notificationService.getUnreadCount();
      setUnreadCount(res.data.count ?? 0);
    } catch { }
  }, []);

  const fetchAllNotif = useCallback(async () => {
    try {
      const res = await notificationService.getAll();
      setNotifications(res.data.data ?? []);
    } catch { }
  }, []);

  useEffect(() => {
    fetchStreak();
    fetchNotifCount();
    fetchAllNotif();
  }, [fetchStreak, fetchNotifCount, fetchAllNotif]);

  useEffect(() => {
    if (!user?.id) return;
    const echo = getEcho();
    if (!echo) return;
    const channel = echo.private(`user.${user.id}`);
    channel.notification((notif: NotificationData) => {
      setNotifications((prev) => [notif, ...prev]);
      setUnreadCount((c) => c + 1);
    });
    return () => { echo.leave(`user.${user.id}`); };
  }, [user?.id]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)),
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch { }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read_at: new Date().toISOString() })));
      setUnreadCount(0);
    } catch { }
  }, []);

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <div className="mt-6 flex items-center justify-between">
      <div>
        <div className="text-[13px] text-ink-soft">{getGreeting()}</div>
        <div className="font-display text-xl font-bold text-ink">{user?.name ?? "User"}</div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1">
          <Flame
            className={`h-5 w-5 ${streakDays > 0 ? "text-orange" : "text-ink-faint"}`}
            fill={streakDays > 0 ? "currentColor" : "none"}
          />
          <span className={`text-sm font-bold ${streakDays > 0 ? "text-ink" : "text-ink-faint"}`}>
            {streakDays}
          </span>
        </div>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotif((prev) => !prev)}
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-ink-soft hover:bg-surface hover:text-ink"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange px-1 text-[9px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

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
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-orange bg-orange-tint text-sm font-bold text-orange-deep"
          >
            {user?.name ? getInitials(user.name) : <User size={18} />}
          </button>

          {open && (
            <div className="absolute right-0 top-full z-50 mt-2 w-44 rounded-xl border border-line bg-white py-1 shadow-lg">
              <Link
                href="/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink hover:bg-surface"
              >
                <User size={16} className="text-ink-soft" />
                Profile
              </Link>
              <button
                onClick={handleLogout}
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
