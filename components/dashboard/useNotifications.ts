export interface NotificationData {
  id: string;
  type: string;
  data: {
    schedule_id: number;
    day_of_week: string;
    scheduled_time: string | null;
    exercises: { name: string; sets: number | null; reps: number | null }[];
    reminder_type: string;
    message: string;
    description?: string;
  };
  read_at: string | null;
  created_at: string;
}

export function getNotificationDescription(notification: NotificationData): string {
  return notification.data.description ?? (
    notification.data.reminder_type === "pre"
      ? "Get ready for your scheduled workout."
      : "Your scheduled workout is starting now."
  );
}
