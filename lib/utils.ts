export const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 11) return "Good morning";
  if (hour < 15) return "Good afternoon";
  if (hour < 18) return "Good evening";

  return "Good evening";
};

export const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export const formatDisplayDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

export const formatDateKey = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
};

export const formatMonthKey = (date: Date) => formatDateKey(date).slice(0, 7);

export const formatDate = (iso: string) => {
  const date = new Date(`${iso}T00:00:00`);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const weekRange = (weekStart: string) => {
  const start = new Date(`${weekStart}T00:00:00`);
  const end = new Date(start);

  end.setDate(end.getDate() + 6);

  return `${formatDisplayDate(start)} - ${formatDisplayDate(end)}`;
};

export const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

export const formatTimeAgo = (value: string | Date): string => {
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.floor(diff / 60_000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export const formatDayLabel = (days: string | null): string => {
  if (!days) return "";

  return days
    .split(",")
    .map((day) => capitalize(day.trim()).slice(0, 3))
    .join(", ");
};