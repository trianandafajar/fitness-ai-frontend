"use client";

import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import { dashboardNotificationsStore } from "@/stores/dashboard-notifications.store";
import { notificationService } from "@/services/notification.service";
import { toast } from "@/components/ui/Toast";

export function useDashboardNotifications() {
  const state = useSyncExternalStore(
    dashboardNotificationsStore.subscribe,
    dashboardNotificationsStore.getState,
    dashboardNotificationsStore.getState,
  );

  const busyRef = useRef<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);

  const markAsRead = useCallback(async (id: string) => {
    if (busyRef.current) return;
    busyRef.current = id;
    setBusyId(id);
    try {
      await notificationService.markAsRead(id);
      dashboardNotificationsStore.markAsRead(id);
    } catch {} finally {
      busyRef.current = null;
      setBusyId(null);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (markingAll) return;
    setMarkingAll(true);
    try {
      await notificationService.markAllAsRead();
      dashboardNotificationsStore.markAllAsRead();
    } catch {} finally {
      setMarkingAll(false);
    }
  }, [markingAll]);

  const removeNotification = useCallback(async (id: string) => {
    if (busyRef.current) return;
    busyRef.current = id;
    setBusyId(id);
    try {
      await notificationService.remove(id);
      dashboardNotificationsStore.removeNotification(id);
      toast.success("Notification deleted", {
        description: "The notification has been removed.",
      });
    } catch {
      toast.error("Failed to delete notification", {
        description: "Please try again.",
      });
    } finally {
      busyRef.current = null;
      setBusyId(null);
    }
  }, []);

  return {
    ...state,
    busyId,
    markingAll,
    markAsRead,
    markAllAsRead,
    removeNotification,
  } as const;
}
