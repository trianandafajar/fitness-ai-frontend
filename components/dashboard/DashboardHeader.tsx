"use client";

import { useState, useEffect, useCallback } from "react";
import { Flame, Bell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
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

export default function DashboardHeader({
  name,
  dateLabel,
  streakDays,
}: {
  name: string;
  dateLabel: string;
  streakDays: number;
}) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchCount = useCallback(async () => {
    try {
      const res = await notificationService.getUnreadCount();
      setUnreadCount(res.data.count ?? 0);
    } catch {}
  }, []);

  const fetchAll = useCallback(async () => {
    try {
      const res = await notificationService.getAll();
      setNotifications(res.data.data ?? []);
    } catch {}
  }, []);

  useEffect(() => {
    fetchCount();
    fetchAll();
  }, [fetchCount, fetchAll]);

  useEffect(() => {
    if (!user?.id) return;

    const echo = getEcho();
    if (!echo) return;

    const channel = echo.private(`user.${user.id}`);
    channel.notification((notif: NotificationData) => {
      setNotifications((prev) => [notif, ...prev]);
      setUnreadCount((c) => c + 1);
    });

    return () => {
      echo.leave(`user.${user.id}`);
    };
  }, [user?.id]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)),
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {}
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read_at: new Date().toISOString() })));
      setUnreadCount(0);
    } catch {}
  }, []);

  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="font-display text-xl font-bold tracking-tight sm:text-2xl">
          {getGreeting()}, {name}
        </div>
        <div className="text-[13.5px] text-ink-soft">{dateLabel}</div>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            className="relative flex h-[38px] w-[38px] items-center justify-center rounded-xl border border-line bg-white text-ink-soft hover:bg-surface hover:text-ink"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-orange px-1 text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
          {showDropdown && (
            <NotificationDropdown
              notifications={notifications}
              unreadCount={unreadCount}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              onClose={() => setShowDropdown(false)}
            />
          )}
        </div>
        <div className="flex h-fit items-center gap-1.75 rounded-full bg-orange-tint px-4 py-2.5 text-[13.5px] font-bold text-orange-deep">
          <Flame className="h-[18px] w-[18px]" /> {streakDays}-day streak
        </div>
      </div>
    </div>
  );
}
