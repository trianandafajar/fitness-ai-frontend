"use client";

import { useCallback, useSyncExternalStore } from "react";
import { dashboardNotificationsStore } from "@/stores/dashboard-notifications.store";
import { notificationService } from "@/services/notification.service";

export function useDashboardNotifications() {
  const state = useSyncExternalStore(
    dashboardNotificationsStore.subscribe,
    dashboardNotificationsStore.getState,
    dashboardNotificationsStore.getState,
  );

  const markAsRead = useCallback(async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      dashboardNotificationsStore.markAsRead(id);
    } catch {}
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      dashboardNotificationsStore.markAllAsRead();
    } catch {}
  }, []);

  return {
    ...state,
    markAsRead,
    markAllAsRead,
  } as const;
}
