import type { NotificationData } from "@/components/dashboard/useNotifications";

type Listener = () => void;

interface DashboardNotificationsState {
  notifications: NotificationData[];
  unreadCount: number;
  loading: boolean;
}

const initialState: DashboardNotificationsState = {
  notifications: [],
  unreadCount: 0,
  loading: true,
};

function createStore(initial: DashboardNotificationsState) {
  let state = { ...initial };
  const listeners = new Set<Listener>();

  return {
    getState: () => state,
    subscribe: (listener: Listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    setState: (partial: Partial<DashboardNotificationsState>) => {
      state = { ...state, ...partial };
      listeners.forEach((listener) => listener());
    },
    reset: () => {
      state = { ...initialState };
      listeners.forEach((listener) => listener());
    },
    setLoading: (loading: boolean) => {
      state = { ...state, loading };
      listeners.forEach((listener) => listener());
    },
    setNotifications: (notifications: NotificationData[]) => {
      state = { ...state, notifications };
      listeners.forEach((listener) => listener());
    },
    setUnreadCount: (unreadCount: number) => {
      state = { ...state, unreadCount };
      listeners.forEach((listener) => listener());
    },
    prependNotification: (notification: NotificationData) => {
      const exists = state.notifications.some(
        (current) => current.id === notification.id,
      );

      state = {
        ...state,
        notifications: [
          notification,
          ...state.notifications.filter(
            (current) => current.id !== notification.id,
          ),
        ],
        unreadCount:
          !notification.read_at && !exists
            ? state.unreadCount + 1
            : state.unreadCount,
      };
      listeners.forEach((listener) => listener());
    },
    markAsRead: (id: string) => {
      let wasUnread = false;

      state = {
        ...state,
        notifications: state.notifications.map((notification) => {
          if (notification.id !== id) {
            return notification;
          }

          wasUnread = !notification.read_at;

          return {
            ...notification,
            read_at: notification.read_at ?? new Date().toISOString(),
          };
        }),
        unreadCount: wasUnread
          ? Math.max(0, state.unreadCount - 1)
          : state.unreadCount,
      };
      listeners.forEach((listener) => listener());
    },
    markAllAsRead: () => {
      const hasUnread = state.notifications.some(
        (notification) => !notification.read_at,
      );

      state = {
        ...state,
        notifications: state.notifications.map((notification) => ({
          ...notification,
          read_at: notification.read_at ?? new Date().toISOString(),
        })),
        unreadCount: hasUnread ? 0 : state.unreadCount,
      };
      listeners.forEach((listener) => listener());
    },
    removeNotification: (id: string) => {
      const notification = state.notifications.find(
        (current) => current.id === id,
      );

      state = {
        ...state,
        notifications: state.notifications.filter(
          (current) => current.id !== id,
        ),
        unreadCount:
          notification && !notification.read_at
            ? Math.max(0, state.unreadCount - 1)
            : state.unreadCount,
      };
      listeners.forEach((listener) => listener());
    },
  };
}

export const dashboardNotificationsStore = createStore(initialState);
