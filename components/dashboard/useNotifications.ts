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
  };
  read_at: string | null;
  created_at: string;
}
