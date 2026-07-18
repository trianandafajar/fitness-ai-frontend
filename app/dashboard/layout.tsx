"use client";

import { useEffect } from "react";
import BottomNav from "@/components/dashboard/BottomNav";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import PageContainer from "@/components/ui/PageContainer";
import { useAuth } from "@/hooks/useAuth";
import { getEcho } from "@/lib/echo";
import { notificationService } from "@/services/notification.service";
import { dashboardNotificationsStore } from "@/stores/dashboard-notifications.store";
import type { NotificationData } from "@/components/dashboard/useNotifications";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, fetchUser } = useAuth();

  useEffect(() => {
    if (!user?.id) {
      fetchUser().catch(() => {});
    }
  }, [fetchUser, user?.id]);

  useEffect(() => {
    if (!user?.id) {
      dashboardNotificationsStore.reset();
      return;
    }

    let cancelled = false;

    async function hydrateNotifications() {
      dashboardNotificationsStore.setNotifications([]);
      dashboardNotificationsStore.setUnreadCount(0);
      dashboardNotificationsStore.setLoading(true);

      try {
        const [allRes, unreadRes] = await Promise.all([
          notificationService.getAll(),
          notificationService.getUnreadCount(),
        ]);

        if (cancelled) {
          return;
        }

        dashboardNotificationsStore.setNotifications(allRes.data.data ?? []);
        dashboardNotificationsStore.setUnreadCount(unreadRes.data.count ?? 0);
      } catch {
        if (!cancelled) {
          dashboardNotificationsStore.setNotifications([]);
          dashboardNotificationsStore.setUnreadCount(0);
        }
      } finally {
        if (!cancelled) {
          dashboardNotificationsStore.setLoading(false);
        }
      }
    }

    hydrateNotifications();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;

    const echo = getEcho();
    if (!echo) {
      console.warn("Echo not initialized");
      return;
    }

    const channelName = `user.${user.id}`;
    const channel = echo.private(channelName);

    channel.notification((notif: NotificationData) => {
      dashboardNotificationsStore.prependNotification(notif);
    });

    return () => {
      echo.leave(channelName);
    };
  }, [user?.id]);

  return (
    <PageContainer className="pb-28 sm:pb-28">
      <DashboardHeader />
      <div className="flex-1">{children}</div>
      <BottomNav />
    </PageContainer>
  );
}
