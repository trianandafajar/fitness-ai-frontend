import { ComponentType } from "react";
import {
  IconDashboard,
  IconWorkout,
  IconMealLog,
  IconProgress,
  IconMealPlan,
  IconKpi,
  IconNotification,
} from "./icons";

export interface NavItem {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

// bottom nav
export const bottomNavAll: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: IconDashboard },
  { href: "/dashboard/workout-schedules", label: "Workout", icon: IconWorkout },
  { href: "/dashboard/meal-schedules", label: "Meal Plan", icon: IconMealPlan },
  { href: "/dashboard/meal-logs", label: "Meal Log", icon: IconMealLog },
  { href: "/dashboard/weight-logs", label: "Weight", icon: IconProgress },
  { href: "/dashboard/kpi-history", label: "KPI", icon: IconKpi },
];
