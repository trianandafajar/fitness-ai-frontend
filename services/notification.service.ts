import { api } from "@/lib/axios";

export const notificationService = {
  getAll: () => api.get("/notifications"),

  getUnreadCount: () => api.get("/notifications/unread-count"),

  markAsRead: (id: string) => api.post(`/notifications/${id}/read`),

  markAllAsRead: () => api.post("/notifications/read-all"),
};
