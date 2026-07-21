"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Bell, Clock, Dumbbell } from "lucide-react";
import type { NotificationData } from "./useNotifications";
import { formatTimeAgo } from "@/lib/utils";

interface NotificationDropdownProps {
  notifications: NotificationData[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClose: () => void;
}

export default function NotificationDropdown({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onClose,
}: NotificationDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border border-line bg-white shadow-lg"
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-ink-soft" />
          <span className="text-sm font-bold text-ink">Notifications</span>
          {unreadCount > 0 && (
            <span className="rounded-full bg-orange px-1.5 py-0.5 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="text-[11px] font-semibold text-orange hover:text-orange-deep"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-72 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-ink-soft">No notifications yet.</div>
        ) : (
          notifications.slice(0, 5).map((n) => (
            <button
              key={n.id}
              onClick={() => onMarkAsRead(n.id)}
              className={`flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-surface ${
                !n.read_at ? "bg-orange-tint/20" : ""
              }`}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-tint text-orange-deep">
                <Dumbbell size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-ink">{n.data.message}</div>
                {n.data.scheduled_time && (
                  <div className="flex items-center gap-1 text-xs text-ink-soft">
                    <Clock size={11} /> {n.data.scheduled_time.slice(0, 5)}
                    {n.data.day_of_week && ` • ${n.data.day_of_week}`}
                  </div>
                )}
                <div className="mt-0.5 text-[10px] text-ink-faint">{formatTimeAgo(n.created_at)}</div>
              </div>
              {!n.read_at && (
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-orange" />
              )}
            </button>
          ))
        )}
      </div>

      <Link
        href="/dashboard/notifications"
        onClick={onClose}
        className="flex items-center justify-center border-t border-line px-4 py-2.5 text-[12px] font-semibold text-ink-soft hover:text-orange"
      >
        View all notifications
      </Link>
    </div>
  );
}
