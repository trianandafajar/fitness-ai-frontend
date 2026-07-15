"use client";

import { useEffect, useState, useCallback } from "react";
import { Bell, Clock, Check, Dumbbell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { notificationService } from "@/services/notification.service";
import { getEcho } from "@/lib/echo";
import type { NotificationData } from "@/components/dashboard/useNotifications";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await notificationService.getAll();
      setNotifications(res.data.data ?? []);
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  useEffect(() => {
    if (!user?.id) return;

    const echo = getEcho();
    if (!echo) return;

    const channel = echo.private(`user.${user.id}`);
    channel.notification((notif: NotificationData) => {
      setNotifications((prev) => [notif, ...prev]);
    });

    return () => {
      echo.leave(`user.${user.id}`);
    };
  }, [user?.id]);

  async function handleMarkAsRead(id: string) {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)),
      );
    } catch {}
  }

  async function handleMarkAllAsRead() {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read_at: new Date().toISOString() })));
    } catch {}
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight sm:text-2xl">Notifications</h1>
          <p className="text-[13.5px] text-ink-soft">Stay updated with your workout reminders.</p>
        </div>
        {notifications.some((n) => !n.read_at) && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-1.5 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink-soft hover:bg-surface hover:text-ink"
          >
            <Check size={16} /> Mark All Read
          </button>
        )}
      </div>

      {loading ? (
        <div className="animate-pulse space-y-2.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-surface" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Bell size={40} className="mb-3 text-ink-faint" />
          <p className="text-sm text-ink-soft">No notifications yet.</p>
          <p className="text-xs text-ink-faint">Workout reminders will appear here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.read_at && handleMarkAsRead(n.id)}
              className={`rounded-2xl border border-line bg-white p-4 transition-colors ${
                !n.read_at ? "cursor-pointer border-orange/30 bg-orange-tint/10 hover:bg-orange-tint/20" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-tint text-orange-deep">
                  <Dumbbell size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold text-ink">{n.data.message}</div>
                      {n.data.scheduled_time && (
                        <div className="mt-0.5 flex items-center gap-1 text-xs text-ink-soft">
                          <Clock size={12} /> {n.data.scheduled_time.slice(0, 5)}
                          {n.data.day_of_week && ` • ${n.data.day_of_week.charAt(0).toUpperCase() + n.data.day_of_week.slice(1)}`}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] text-ink-faint">{timeAgo(n.created_at)}</span>
                      {!n.read_at && <div className="h-2 w-2 rounded-full bg-orange" />}
                      {n.read_at && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleMarkAsRead(n.id); }}
                          className="rounded p-0.5 text-ink-faint hover:text-ink"
                        >
                          <Check size={12} />
                        </button>
                      )}
                    </div>
                  </div>

                  {n.data.exercises && n.data.exercises.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {n.data.exercises.map((ex: any) => (
                        <span key={ex.name} className="rounded-lg bg-surface px-2 py-0.5 text-[11px] text-ink">
                          {ex.name}{ex.sets ? ` ${ex.sets}×${ex.reps ?? ""}` : ""}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
